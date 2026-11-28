/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { defineConfig } from 'vite-plus';
import tsconfigPaths from 'vite-tsconfig-paths';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  pack: [
    {
      entry: ['src/index.ts'],
      format: ['esm', 'cjs'],
      fixedExtension: true,
      sourcemap: true,
      dts: true,
      minify: true,
      outDir: 'dist',
      define: {
        __DEV__: 'process.env.NODE_ENV !== "production"'
      }
    }
  ],
  define: {
    __DEV__: 'true'
  },
  plugins: [tsconfigPaths()],
  test: {
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['node_modules', 'dist', '.turbo'],
    include: ['__tests__/**/*.test.{ts,js,tsx,jsx}'],
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
      exclude: ['node_modules', 'dist']
    }
  }
});
