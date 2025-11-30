/**
 * Get element bounding rectangles
 *
 * Uses @necto/dom utilities - reusing existing code!
 */

import { isNode } from '@necto/dom';
import type { ElementRects, Rect } from '../types';

/**
 * Gets the bounding rectangles for reference and floating elements.
 * Pure function - just reads DOM and returns data.
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
 * Converts a DOMRect to our Rect type
 *
 * Uses @necto/dom's isNode for validation
 */
function getRectFromElement(element: Element): Rect {
  // Validate element using @necto/dom utility
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
