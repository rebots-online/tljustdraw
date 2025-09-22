import { z } from 'zod';

export type AgentRole = 'facilitator' | 'summarizer' | 'critic' | 'scribe';

const AppConfigSchema = z.object({
  environment: z.enum(['development', 'production', 'test']).default('development'),
  backendUrl: z.string().url().default('http://localhost:8787'),
  realtimeSyncUrl: z.string().url().nullable().default('ws://localhost:8787/sync'),
  openRouterApiKey: z.string().min(1).nullable().default(null),
  geminiApiKey: z.string().min(1).nullable().default(null),
  openAIApiKey: z.string().min(1).nullable().default(null),
  ollamaBaseUrl: z.string().url().nullable().default('http://localhost:11434'),
  revenueCatApiKey: z.string().min(1).nullable().default(null),
  defaultAgentRole: z
    .enum(['facilitator', 'summarizer', 'critic', 'scribe'])
    .default('facilitator'),
  telemetryEnabled: z.boolean().default(true),
  featureFlags: z.record(z.boolean()).default({}),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;
export type AppConfigInput = z.input<typeof AppConfigSchema>;

export interface AsyncKeyValueStore {
  getItem(key: string): Promise<string | null> | string | null;
}

export interface ConfigLoadOptions {
  envSource?: Record<string, string | undefined>;
  secureStore?: AsyncKeyValueStore;
  indexedStore?: AsyncKeyValueStore;
  overrides?: Partial<AppConfigInput>;
}

interface ConfigFieldDescriptor<TValue> {
  env?: string;
  secure?: string;
  indexed?: string;
  parse?: (raw: string) => TValue | undefined;
  default: TValue;
}

type ConfigField = keyof AppConfigInput;

type DescriptorMap = {
  [K in ConfigField]: ConfigFieldDescriptor<AppConfigInput[K]>;
};

const parseBoolean = (raw: string): boolean | undefined => {
  const normalized = raw.trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true;
  }
  if (['false', '0', 'no', 'off'].includes(normalized)) {
    return false;
  }
  return undefined;
};

const parseJsonFlags = (raw: string): Record<string, boolean> | undefined => {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return undefined;
    }
    return Object.entries(parsed).reduce<Record<string, boolean>>((acc, [key, value]) => {
      acc[key] = Boolean(value);
      return acc;
    }, {});
  } catch {
    return undefined;
  }
};

const DESCRIPTORS: DescriptorMap = {
  environment: {
    env: 'TLJ_ENV',
    default: 'development',
  },
  backendUrl: {
    env: 'TLJ_BACKEND_URL',
    default: 'http://localhost:8787',
  },
  realtimeSyncUrl: {
    env: 'TLJ_REALTIME_SYNC_URL',
    default: 'ws://localhost:8787/sync',
  },
  openRouterApiKey: {
    env: 'OPENROUTER_API_KEY',
    secure: 'OPENROUTER_API_KEY',
    default: null,
  },
  geminiApiKey: {
    env: 'GEMINI_API_KEY',
    secure: 'GEMINI_API_KEY',
    default: null,
  },
  openAIApiKey: {
    env: 'OPENAI_API_KEY',
    secure: 'OPENAI_API_KEY',
    default: null,
  },
  ollamaBaseUrl: {
    env: 'OLLAMA_BASE_URL',
    default: 'http://localhost:11434',
  },
  revenueCatApiKey: {
    env: 'REVENUECAT_PUBLIC_API_KEY',
    secure: 'REVENUECAT_PUBLIC_API_KEY',
    default: null,
  },
  defaultAgentRole: {
    env: 'TLJ_DEFAULT_AGENT_ROLE',
    parse: (raw) => {
      const normalized = raw.trim().toLowerCase();
      if (['facilitator', 'summarizer', 'critic', 'scribe'].includes(normalized)) {
        return normalized as AgentRole;
      }
      return undefined;
    },
    default: 'facilitator',
  },
  telemetryEnabled: {
    env: 'TLJ_TELEMETRY_ENABLED',
    parse: parseBoolean,
    default: true,
  },
  featureFlags: {
    env: 'TLJ_FEATURE_FLAGS',
    indexed: 'TLJ_FEATURE_FLAGS',
    parse: parseJsonFlags,
    default: {},
  },
};

const resolveFromStore = async (
  store: AsyncKeyValueStore | undefined,
  key: string | undefined
): Promise<string | undefined> => {
  if (!store || !key) {
    return undefined;
  }
  const value = await store.getItem(key);
  return value === null ? undefined : value;
};

export class ConfigValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigValidationError';
  }
}

export const loadEnvConfig = async (options: ConfigLoadOptions = {}): Promise<AppConfig> => {
  const env = options.envSource ?? (typeof process !== 'undefined' ? process.env : {});
  const overrides = options.overrides ?? {};
  const resolvedEntries = await Promise.all(
    (Object.keys(DESCRIPTORS) as ConfigField[]).map(async (field) => {
      if (overrides[field] !== undefined) {
        return [field, overrides[field]] as const;
      }

      const descriptor = DESCRIPTORS[field];
      const fromEnv = descriptor.env ? env[descriptor.env] : undefined;
      if (fromEnv !== undefined) {
        const parsed = descriptor.parse ? descriptor.parse(fromEnv) : (fromEnv as unknown);
        if (parsed !== undefined) {
          return [field, parsed] as const;
        }
      }

      const fromSecure = await resolveFromStore(options.secureStore, descriptor.secure);
      if (fromSecure !== undefined) {
        const parsed = descriptor.parse ? descriptor.parse(fromSecure) : (fromSecure as unknown);
        if (parsed !== undefined) {
          return [field, parsed] as const;
        }
        if (!descriptor.parse) {
          return [field, fromSecure] as const;
        }
      }

      const fromIndexed = await resolveFromStore(options.indexedStore, descriptor.indexed);
      if (fromIndexed !== undefined) {
        const parsed = descriptor.parse ? descriptor.parse(fromIndexed) : (fromIndexed as unknown);
        if (parsed !== undefined) {
          return [field, parsed] as const;
        }
        if (!descriptor.parse) {
          return [field, fromIndexed] as const;
        }
      }

      return [field, descriptor.default] as const;
    })
  );

  const candidate: Partial<AppConfigInput> = resolvedEntries.reduce<Partial<AppConfigInput>>(
    (acc, [field, value]) => {
      acc[field] = value as AppConfigInput[typeof field];
      return acc;
    },
    {}
  );

  try {
    const parsed = AppConfigSchema.parse(candidate);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ConfigValidationError(error.errors.map((err) => err.message).join('; '));
    }
    throw error;
  }
};

export const AppConfigKeys = Object.freeze({
  env: 'TLJ_ENV',
  backendUrl: 'TLJ_BACKEND_URL',
  realtimeSyncUrl: 'TLJ_REALTIME_SYNC_URL',
  featureFlags: 'TLJ_FEATURE_FLAGS',
});
