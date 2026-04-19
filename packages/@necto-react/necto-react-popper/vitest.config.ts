/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths({ root: '../../..' })],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],

    coverage: {
      provider: 'istanbul',
      reporter: ['lcov', 'text'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['node_modules', 'dist']
    }
  }
});
