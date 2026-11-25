/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { defineConfig } from 'vite-plus/pack';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  entry: ['src/index.ts'],
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
