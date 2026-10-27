/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HAS_SPACE, HAS_CAMEL, SEP_SPLITTER, CAM_SPLITTER, HAS_SEPARATOR } from './constants';

export function undoCase(str: string): string {
  if (HAS_SPACE.test(str)) {
    return str.toLowerCase();
  }

  if (HAS_SEPARATOR.test(str)) {
    return (
      str.replace(SEP_SPLITTER, (_: string, next: any): string => {
        return next ? ' ' + next : '';
      }) || str
    ).toLowerCase();
  }

  if (HAS_CAMEL.test(str)) {
    return str
      .replace(CAM_SPLITTER, (_, previous, uppers) => {
        return previous + ' ' + uppers.toLowerCase().split('').join(' ');
      })
      .toLowerCase();
  }

  return str.toLowerCase();
}
