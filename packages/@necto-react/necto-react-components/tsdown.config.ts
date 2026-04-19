/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { env } from 'node:process';
import { defineConfig } from 'tsdown';
import { codecovRollupPlugin } from '@codecov/rollup-plugin';

export default defineConfig({
  format: ['esm', 'cjs'],
  entry: ['./src/index.ts'],
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    /^@necto\//,
    /^@necto-react\//
  ],
  noExternal: ['@emotion/styled', 'clsx', 'react-icons'],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  plugins: [
    codecovRollupPlugin({
      enableBundleAnalysis: !!env.CODECOV_TOKEN,
      bundleName: '@necto-react/components',
      uploadToken: env.CODECOV_TOKEN
    })
  ]
});
