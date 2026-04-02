/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: false,
    splitting: false,
    clean: true,
    cjsInterop: true,
    platform: 'neutral',
    external: ['@necto/constants', '@necto/file', '@necto/platform'],
    outExtension({ format }) {
      return {
        js: format === 'cjs' ? '.cjs' : '.mjs'
      };
    }
  }
]);
