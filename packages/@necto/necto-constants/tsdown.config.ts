/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    noExternal: [
      'html-tags',
      'svg-tag-names',
      'aria-attributes',
      'css-color-names',
      'http-status-codes',
      'html-void-elements',
      'svg-element-attributes',
      'html-element-attributes'
    ]
  }
]);
