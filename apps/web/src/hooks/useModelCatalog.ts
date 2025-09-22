import { createLogger } from '@shared-utils';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_OPENROUTER_MODEL_ID,
  FALLBACK_OPENROUTER_MODELS,
  OpenRouterModel,
  OpenRouterModelResponse,
  normalizeOpenRouterModel,
} from '../state/models';

const logger = createLogger({ name: '@tljustdraw/web/useModelCatalog' });

interface UseModelCatalogResult {
  models: OpenRouterModel[];
  activeModelId: string;
  setActiveModelId: (modelId: string) => void;
  loading: boolean;
  error?: string;
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

export const useModelCatalog = (): UseModelCatalogResult => {
  const [models, setModels] = useState<OpenRouterModel[]>(FALLBACK_OPENROUTER_MODELS);
  const [activeModelId, setActiveModelId] = useState<string>(DEFAULT_OPENROUTER_MODEL_ID);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const hydrate = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const response = await fetch('/api/openrouter/models', {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        const nextModels = await parseResponse(response);
        if (!cancelled) {
          setModels(nextModels);
          if (!nextModels.some((model) => model.id === activeModelId)) {
            const defaultModel = nextModels.find(
              (model) => model.id === DEFAULT_OPENROUTER_MODEL_ID
            );
            setActiveModelId(defaultModel?.id ?? nextModels[0]?.id ?? DEFAULT_OPENROUTER_MODEL_ID);
          }
        }
        logger.info('Hydrated OpenRouter models', {
          count: nextModels.length,
        });
      } catch (fetchError) {
        if (cancelled || (fetchError instanceof DOMException && fetchError.name === 'AbortError')) {
          return;
        }
        logger.warn('Falling back to bundled OpenRouter model catalog', {
          error: (fetchError as Error).message,
        });
        setError((fetchError as Error).message);
        setModels(FALLBACK_OPENROUTER_MODELS);
        setActiveModelId(DEFAULT_OPENROUTER_MODEL_ID);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void hydrate();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [activeModelId]);

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
  };
};
