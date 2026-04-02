/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isNode } from '../node';
import { getOwnerDocument, getOwnerWindow } from '../owner';

import type { ContainmentRect } from './types';

export function getContainmentRect(
  containment: Element | null | undefined,
  fallbackElement?: Element | null
): ContainmentRect {
  if (containment && isNode(containment)) {
    const r = (containment as Element).getBoundingClientRect();
    return {
      top: r.top,
      left: r.left,
      bottom: r.bottom,
      right: r.right
    };
  } else {
    const doc = fallbackElement
      ? getOwnerDocument(fallbackElement)
      : typeof document !== 'undefined'
        ? document
        : null;
    const win = fallbackElement
      ? getOwnerWindow(fallbackElement)
      : typeof window !== 'undefined'
        ? window
        : null;
    return {
      top: 0,
      left: 0,
      bottom: win?.innerHeight || doc?.documentElement?.clientHeight || 0,
      right: win?.innerWidth || doc?.documentElement?.clientWidth || 0
    };
  }
}

export type { ContainmentRect } from './types';
