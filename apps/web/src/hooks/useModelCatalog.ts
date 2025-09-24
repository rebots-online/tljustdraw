import { createLogger } from '@shared-utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  DEFAULT_OPENROUTER_MODEL_ID,
  FALLBACK_OPENROUTER_MODELS,
  OpenRouterModel,
  OpenRouterModelResponse,
  normalizeOpenRouterModel,
} from '../state/models';

const logger = createLogger({ name: '@tljustdraw/web/useModelCatalog' });

export type CatalogSource = 'remote' | 'static' | 'bundled';

interface UseModelCatalogResult {
  models: OpenRouterModel[];
  activeModelId: string;
  setActiveModelId: (modelId: string) => void;
  loading: boolean;
  error?: string;
  source: CatalogSource;
}

const parseResponse = async (response: Response): Promise<OpenRouterModel[]> => {
  if (!response.ok) {
    throw new Error(`Failed to load models (${response.status})`);
  }

  const payload = (await response.json()) as
    | { data?: OpenRouterModelResponse[] }
    | OpenRouterModelResponse[];
  const data = Array.isArray(payload) ? payload : (payload?.data ?? []);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('OpenRouter model catalog empty');
  }

  return data.map(normalizeOpenRouterModel);
};

const REMOTE_CATALOG_ENDPOINT =
  (import.meta.env.VITE_OPENROUTER_MODEL_CATALOG_URL as string | undefined) ??
  '/api/openrouter/models';
const STATIC_CATALOG_ENDPOINT = '/api/openrouter/models.json';

export const useModelCatalog = (): UseModelCatalogResult => {
  const [models, setModels] = useState<OpenRouterModel[]>(FALLBACK_OPENROUTER_MODELS);
  const [activeModelId, setActiveModelId] = useState<string>(DEFAULT_OPENROUTER_MODEL_ID);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [source, setSource] = useState<CatalogSource>('bundled');

  const activeModelIdRef = useRef(activeModelId);
  const hydrationRunRef = useRef(false);
  useEffect(() => {
    activeModelIdRef.current = activeModelId;
  }, [activeModelId]);

  useEffect(() => {
    if (hydrationRunRef.current) {
      return;
    }
    hydrationRunRef.current = true;

    let cancelled = false;
    const controller = new AbortController();

    const hydrate = async () => {
      setLoading(true);
      setError(undefined);

      const endpoints: Array<{ url: string; source: CatalogSource }> = [
        { url: REMOTE_CATALOG_ENDPOINT, source: 'remote' },
        { url: STATIC_CATALOG_ENDPOINT, source: 'static' },
      ];

      let lastError: Error | undefined;
      let resolvedModels: OpenRouterModel[] | undefined;
      let resolvedSource: CatalogSource | undefined;
      let resolvedEndpoint: string | undefined;

      try {
        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint.url, {
              method: 'GET',
              headers: { Accept: 'application/json' },
              signal: controller.signal,
            });
            const nextModels = await parseResponse(response);
            resolvedModels = nextModels;
            resolvedSource = endpoint.source;
            resolvedEndpoint = endpoint.url;
            break;
          } catch (attemptError) {
            if (attemptError instanceof DOMException && attemptError.name === 'AbortError') {
              throw attemptError;
            }
            const failure = attemptError as Error;
            lastError = failure;
            logger.warn('OpenRouter model catalog fetch failed', {
              endpoint: endpoint.url,
              error: failure.message,
            });
          }
        }
      } catch (hydrateError) {
        if (hydrateError instanceof DOMException && hydrateError.name === 'AbortError') {
          return;
        }
        lastError = (hydrateError as Error) ?? lastError;
      }

      if (cancelled) {
        return;
      }

      if (resolvedModels && resolvedSource) {
        setModels(resolvedModels);
        setSource(resolvedSource);

        const currentActiveModelId = activeModelIdRef.current;
        if (!resolvedModels.some((model) => model.id === currentActiveModelId)) {
          const defaultModel = resolvedModels.find(
            (model) => model.id === DEFAULT_OPENROUTER_MODEL_ID
          );
          setActiveModelId(
            defaultModel?.id ?? resolvedModels[0]?.id ?? DEFAULT_OPENROUTER_MODEL_ID
          );
        }

        logger.info(
          resolvedSource === 'remote'
            ? 'Hydrated OpenRouter models from remote endpoint'
            : 'Hydrated OpenRouter models from static asset',
          {
            endpoint: resolvedEndpoint,
            count: resolvedModels.length,
          }
        );
        setLoading(false);
        return;
      }

      setSource('bundled');
      setError(lastError?.message ?? 'OpenRouter model catalog unavailable');
      setModels(FALLBACK_OPENROUTER_MODELS);
      setActiveModelId(DEFAULT_OPENROUTER_MODEL_ID);
      logger.warn('Falling back to bundled OpenRouter model catalog', {
        error: lastError?.message,
        count: FALLBACK_OPENROUTER_MODELS.length,
      });
      setLoading(false);
    };

    void hydrate();

    return () => {
      cancelled = true;
      controller.abort();
      setLoading(false);
    };
  }, []);

  const setActiveModel = useCallback((modelId: string) => {
    setActiveModelId(modelId);
    logger.info('OpenRouter model selected', { modelId });
  }, []);

  const sortedModels = useMemo(() => {
    const defaultIndex = models.findIndex((model) => model.id === DEFAULT_OPENROUTER_MODEL_ID);
    if (defaultIndex <= 0) {
      return models;
    }
    const clone = [...models];
    const [defaultModel] = clone.splice(defaultIndex, 1);
    return [defaultModel, ...clone];
  }, [models]);

  return {
    models: sortedModels,
    activeModelId,
    setActiveModelId: setActiveModel,
    loading,
    error,
    source,
  };
};
