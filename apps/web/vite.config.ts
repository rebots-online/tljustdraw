import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageConditionNames = [
  'style',
  'development',
  'production',
  'import',
  'module',
  'browser',
  'default'
] as const;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared-utils': resolve(__dirname, '../../packages/shared-utils/src')
    },
    conditions: [...packageConditionNames]
  },
  optimizeDeps: {
    esbuildOptions: {
      conditions: [...packageConditionNames]
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
