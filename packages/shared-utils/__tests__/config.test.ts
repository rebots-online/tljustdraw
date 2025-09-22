import { describe, expect, it } from 'vitest';

import { ConfigValidationError, loadEnvConfig } from '../src/config';

describe('loadEnvConfig', () => {
  it('returns defaults when no overrides are provided', async () => {
    const config = await loadEnvConfig({ envSource: {} });

    expect(config.environment).toBe('development');
    expect(config.backendUrl).toBe('http://localhost:8787');
    expect(config.realtimeSyncUrl).toBe('ws://localhost:8787/sync');
    expect(config.defaultAgentRole).toBe('facilitator');
    expect(config.telemetryEnabled).toBe(true);
    expect(config.featureFlags).toEqual({});
  });

  it('prefers overrides over environment and secure stores', async () => {
    const config = await loadEnvConfig({
      envSource: {
        TLJ_BACKEND_URL: 'https://api.example.com',
        TLJ_TELEMETRY_ENABLED: 'false',
      },
      overrides: {
        backendUrl: 'https://override.example.com',
        telemetryEnabled: true,
      },
    });

    expect(config.backendUrl).toBe('https://override.example.com');
    expect(config.telemetryEnabled).toBe(true);
  });

  it('falls back to secure store when env is missing', async () => {
    const secureStore = {
      getItem: async (key: string) => {
        if (key === 'OPENROUTER_API_KEY') {
          return 'secure-openrouter-key';
        }
        return null;
      },
    };

    const config = await loadEnvConfig({ envSource: {}, secureStore });

    expect(config.openRouterApiKey).toBe('secure-openrouter-key');
  });

  it('parses feature flags JSON from IndexedDB store', async () => {
    const indexedStore = {
      getItem: async (key: string) => {
        if (key === 'TLJ_FEATURE_FLAGS') {
          return JSON.stringify({ agentV2: true, newImporter: false });
        }
        return null;
      },
    };

    const config = await loadEnvConfig({ envSource: {}, indexedStore });

    expect(config.featureFlags).toEqual({ agentV2: true, newImporter: false });
  });

  it('throws ConfigValidationError when env values are invalid', async () => {
    await expect(
      loadEnvConfig({
        envSource: {
          TLJ_BACKEND_URL: 'not-a-valid-url',
        },
      })
    ).rejects.toBeInstanceOf(ConfigValidationError);
  });
});
