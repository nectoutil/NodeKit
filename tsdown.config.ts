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
  workspace: [
    'packages/@necto/*',
    'packages/@necto-react/*'
  ],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  plugins: [
    codecovRollupPlugin({
      bundleName: 'nodekit',
      uploadToken: env.CODECOV_TOKEN,
      enableBundleAnalysis: !!env.CODECOV_TOKEN
    })
  ]
});
