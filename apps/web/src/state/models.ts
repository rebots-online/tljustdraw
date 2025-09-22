export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  contextLength?: number;
  pricing?: {
    prompt?: number;
    completion?: number;
    currency?: string;
  };
  tags?: string[];
}

export interface OpenRouterModelResponse {
  id: string;
  name?: string;
  description?: string;
  context_length?: number;
  pricing?: {
    prompt?: number;
    completion?: number;
    currency?: string;
  };
  pricing_units?: string;
  top_provider?: {
    name?: string;
  };
  [key: string]: unknown;
}

export const DEFAULT_OPENROUTER_MODEL_ID = 'openrouter/x-ai/grok-4-fast:free';

export const normalizeOpenRouterModel = (model: OpenRouterModelResponse): OpenRouterModel => ({
  id: model.id,
  name: model.name ?? model.id,
  description: model.description,
  contextLength: model.context_length,
  pricing: model.pricing
    ? {
        prompt: model.pricing.prompt,
        completion: model.pricing.completion,
        currency: model.pricing.currency ?? model.pricing_units ?? 'USD',
      }
    : undefined,
  tags: typeof model.top_provider?.name === 'string' ? [model.top_provider.name] : undefined,
});

export const FALLBACK_OPENROUTER_MODELS: OpenRouterModel[] = [
  {
    id: DEFAULT_OPENROUTER_MODEL_ID,
    name: 'Grok 4 Fast (OpenRouter)',
    description: 'Default Grok 4 Fast free-tier model via OpenRouter.',
    contextLength: 262144,
    pricing: { prompt: 0, completion: 0, currency: 'USD' },
    tags: ['default', 'free-tier'],
  },
  {
    id: 'openrouter/openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Balanced OpenAI GPT-4o mini via OpenRouter.',
    contextLength: 128000,
    tags: ['openai'],
  },
  {
    id: 'openrouter/google/gemini-flash-1.5',
    name: 'Gemini Flash 1.5',
    description: 'Fast multimodal Gemini Flash 1.5.',
    contextLength: 1048576,
    tags: ['google'],
  },
];
