/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isShadowRoot } from './shadow-dom';

export function isNode(value: unknown): value is Node {
  return value !== null &&
    typeof value === 'object' &&
    'nodeType' in value &&
    typeof (value as Node).nodeType === 'number';
}

export function nodeContains(
  node: Node | null | undefined,
  otherNode: Node | null | undefined,
  supportShadowDOM: boolean = true
): boolean {
  if (!node || !otherNode) return false;

  // Fast path if shadow DOM support is disabled
  if (!supportShadowDOM) {
    return node.contains(otherNode);
  }

  let current: Node | null = otherNode;

  while (current) {
    if (current === node) return true;

    if (
      current instanceof Element &&
      current.tagName === 'SLOT' &&
      (current as HTMLSlotElement).assignedSlot
    ) {
      current = (current as HTMLSlotElement).assignedSlot!.parentNode;
    } else if (isShadowRoot(current)) {
      current = (current as ShadowRoot).host;
    } else {
      current = current.parentNode;
    }
  }

  return false;
}
