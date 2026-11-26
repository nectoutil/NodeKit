/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Portions adapted from Node.js (lib/path.js) and unjs/pathe, both MIT licensed.
 */

import { basename } from './basename';
import { EXTNAME_RE } from './constants';

import type { PathOptions } from './types';

export function extname(path: string, options?: PathOptions): string {
  const base: string = basename(path, undefined, options);

  if (base === '..') {
    return '';
  }

  const match: RegExpExecArray | null = EXTNAME_RE.exec(base);

  return (match && match[1]) || '';
}
