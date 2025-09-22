import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage'
    }
  },
  resolve: {
    alias: {
      '@core-ui': resolve(rootDir, 'packages/core-ui/src'),
      '@canvas-adapters': resolve(rootDir, 'packages/canvas-adapters/src'),
      '@agent-services': resolve(rootDir, 'packages/agent-services/src'),
      '@auth-billing': resolve(rootDir, 'packages/auth-billing/src'),
      '@shared-utils': resolve(rootDir, 'packages/shared-utils/src')
    }
  }
});
