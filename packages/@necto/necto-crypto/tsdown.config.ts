/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { env } from 'node:process';
import { defineConfig } from 'tsdown';
import { codecovRollupPlugin } from '@codecov/rollup-plugin';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  minify: true,
  plugins: [
    codecovRollupPlugin({
      enableBundleAnalysis: !!env.CODECOV_TOKEN,
      bundleName: '@necto/crypto',
      uploadToken: env.CODECOV_TOKEN
    })
  ]
});
