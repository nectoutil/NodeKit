/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isNode } from '@necto/dom';

import type { ElementRects, Rect } from '../types';

/**
 * Gets the bounding rectangles for reference and floating elements.
 * @param reference - The reference element.
 * @param floating - The floating element.
 * @returns The bounding rectangles for both elements.
 */
export function getElementRects(
  reference: Element,
  floating: HTMLElement
): ElementRects {
  return {
    reference: getRectFromElement(reference),
    floating: getRectFromElement(floating)
  };
}

/**
 * Converts a DOMRect to a Rect type.
 * @param element - The element to get the bounding rect from.
 * @returns The element's bounding rectangle.
 */
function getRectFromElement(element: Element): Rect {
  if (!isNode(element)) {
    throw new Error('Invalid element provided to getRectFromElement');
  }

  const domRect = element.getBoundingClientRect();

  return {
    x: domRect.x,
    y: domRect.y,
    width: domRect.width,
    height: domRect.height
  };
}
