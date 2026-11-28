/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus/pack';
import { coverageConfigDefaults } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  entry: ['./src/index.ts'],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['node_modules', 'dist', '**/*.visual.spec.*'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      screenshotFailures: false,
      instances: [
        {
          browser: 'chromium'
        },
        {
          browser: 'firefox'
        },
        {
          browser: 'webkit'
        }
      ]
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['lcov', 'text'],
      include: ['src/**/*.{ts,tsx}'],
      // Script.tsx serializes runInlineScript into an inline <script> via
      // toString(); instrumenting it injects cov_* references that are undefined
      // in the injected scope and throw at runtime, so it is excluded here.
      exclude: [...coverageConfigDefaults.exclude, 'dist', 'src/Script/Script.tsx']
    }
  }
});
