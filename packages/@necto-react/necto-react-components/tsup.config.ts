/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { defineConfig } from 'tsup';

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
  sourcemap: true
});
