/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { defineConfig } from 'vite-plus/pack';

// Minimal placeholder config while the package is in scaffold-only state.
// Replace with proper config (browser/jsdom env, coverage includes, etc.)
// once real implementation lands.
export default defineConfig({
  entry: ['src/index.ts', 'src/openapi/index.ts'],
  test: {
    environment: 'node',
    coverage: {
      provider: 'istanbul',
      reporter: ['lcov', 'text'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts']
    }
  }
});
