/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isNode } from './node';
import { getOwnerDocument, getOwnerWindow } from './owner';

import type { ContainmentRect } from './types/containment';

export function getContainmentRect(
  containment: Element | null | undefined,
  fallbackElement?: Element | null
): ContainmentRect {
  if (containment && isNode(containment)) {
    const { top, bottom, left, right }: DOMRect = containment.getBoundingClientRect();

    return {
      top,
      left,
      right,
      bottom
    };
  }

  const ownerDoc: Document | null = fallbackElement
    ? getOwnerDocument(fallbackElement)
    : typeof document !== 'undefined'
      ? document
      : null;

  const ownerWin: (Window & typeof globalThis) | null = fallbackElement
    ? getOwnerWindow(fallbackElement)
    : typeof window !== 'undefined'
      ? window
      : null;

  return {
    top: 0,
    left: 0,
    bottom: ownerWin?.innerHeight || ownerDoc?.documentElement?.clientHeight || 0,
    right: ownerWin?.innerWidth || ownerDoc?.documentElement?.clientWidth || 0
  };
}
