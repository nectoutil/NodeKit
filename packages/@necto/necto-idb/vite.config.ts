/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { defineConfig } from 'vite-plus';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  pack: [
    {
      entry: ['src/index.ts'],
      platform: 'neutral',
      fixedExtension: true,
      format: ['esm', 'cjs'],
      sourcemap: true,
      dts: true,
      minify: true,
      outDir: 'dist',
      define: {
        __DEV__: 'false'
      }
    },
    {
      entry: ['src/index.ts'],
      platform: 'neutral',
      fixedExtension: true,
      format: ['esm', 'cjs'],
      sourcemap: true,
      dts: false,
      minify: false,
      outDir: 'dist/dev',
      define: {
        __DEV__: 'true'
      }
    }
  ],
  define: {
    __DEV__: 'true'
  },
  test: {
    include: ['__tests__/**/*.test.{ts,js}'],
    exclude: ['node_modules', 'dist'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      screenshotFailures: false,
      instances: [{ browser: 'chromium' }, { browser: 'firefox' }, { browser: 'webkit' }]
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['lcov', 'text'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['node_modules', 'dist']
    }
  }
});
