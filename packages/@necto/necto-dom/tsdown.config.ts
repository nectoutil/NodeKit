/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { env } from 'node:process';
import { defineConfig } from 'tsdown';
import { codecovRollupPlugin } from '@codecov/rollup-plugin';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: false,
    clean: true,
    platform: 'neutral',
    external: ['@necto/constants', '@necto/file', '@necto/platform'],
    plugins: [
      codecovRollupPlugin({
        enableBundleAnalysis: !!env.CODECOV_TOKEN,
        bundleName: '@necto/dom',
        uploadToken: env.CODECOV_TOKEN
      })
    ]
  }
]);
