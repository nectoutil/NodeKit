/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isNode } from './node';
import { getOwnerDocument, getOwnerWindow } from './owner';

export function getContainmentRect(
  containment: Element | null | undefined,
  fallbackElement?: Element | null
): { top: number; left: number; bottom: number; right: number } {
  if (containment && isNode(containment)) {
    const r = (containment as Element).getBoundingClientRect();
    return {
      top: r.top,
      left: r.left,
      bottom: r.bottom,
      right: r.right
    };
  } else {
    // Use fallbackElement if provided, otherwise use global document/window
    const doc = fallbackElement ? getOwnerDocument(fallbackElement) : document;
    const win = fallbackElement ? getOwnerWindow(fallbackElement) : window;
    return {
      top: 0,
      left: 0,
      bottom: win.innerHeight || doc.documentElement.clientHeight,
      right: win.innerWidth || doc.documentElement.clientWidth
    };
  }
}
