/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['__tests__/**/*.test.{ts,js,tsx,jsx}'],
    environment: 'jsdom',
    exclude: ['node_modules', 'dist', '.turbo'],

    coverage: {
      provider: 'istanbul',
      reporter: ['lcov', 'text'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['node_modules', 'dist']
    }
  },
  resolve: {
    alias: [
      {
        find: /^@necto-react\/hooks\/(.*)$/,
        replacement: path.resolve(__dirname, 'src/$1')
      },
      {
        find: '@necto-react/hooks',
        replacement: path.resolve(__dirname, 'src/index.ts')
      }
    ]
  }
});
