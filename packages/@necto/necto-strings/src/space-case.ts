/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { undoCase } from './undo-case';
import { SEP_SPLITTER } from './constants';

export function spaceCase(str: string): string {
  return undoCase(str)
    .replace(SEP_SPLITTER, (_, match) => {
      return match ? ' ' + match : '';
    })
    .trim();
}
