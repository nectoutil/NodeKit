/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isNode } from '@necto/dom';

import type { ElementRects, Rect, Strategy } from '../types';

/**
 * Gets the offset parent of an element — the nearest positioned ancestor
 * that the element would be positioned relative to with `position: absolute`.
 * @param element - The element to find the offset parent for.
 * @returns The offset parent element or the documentElement.
 */
function getOffsetParent(element: HTMLElement): Element {
  let offsetParent = element.offsetParent;

  // If offsetParent is body with position:static, use documentElement
  if (
    offsetParent &&
    offsetParent === element.ownerDocument.body &&
    getComputedStyle(offsetParent).position === 'static' &&
    !isContainingBlock(offsetParent)
  ) {
    return element.ownerDocument.documentElement;
  }

  return offsetParent || element.ownerDocument.documentElement;
}

/**
 * Checks if an element creates a new containing block
 * (via transform, filter, will-change, etc.).
 * @param element - The element to check.
 * @returns True if the element creates a containing block.
 */
function isContainingBlock(element: Element): boolean {
  const style = getComputedStyle(element);
  return (
    style.transform !== 'none' ||
    /transform|perspective/.test(style.willChange || '') ||
    style.filter !== 'none' ||
    style.contain === 'paint' ||
    ('backdropFilter' in style &&
      (style as CSSStyleDeclaration).backdropFilter !== 'none')
  );
}

/**
 * Computes a rect for an element relative to the floating element's offset parent.
 * This converts viewport-relative getBoundingClientRect() values to coordinates
 * that work correctly with position:absolute on the floating element.
 * @param element - The element to get the rect for.
 * @param offsetParent - The offset parent of the floating element.
 * @param strategy - The CSS positioning strategy.
 * @returns The element's rect in offset-parent-relative coordinates.
 */
function getRectRelativeToOffsetParent(
  element: Element,
  offsetParent: Element,
  strategy: Strategy
): Rect {
  if (!isNode(element)) {
    throw new Error('Invalid element provided to getRectRelativeToOffsetParent');
  }

  const elementRect = element.getBoundingClientRect();
  const isFixed = strategy === 'fixed';

  let scrollLeft = 0;
  let scrollTop = 0;
  let offsetX = 0;
  let offsetY = 0;

  const isOffsetParentAnElement =
    offsetParent instanceof HTMLElement &&
    offsetParent !== element.ownerDocument.documentElement;

  if (isOffsetParentAnElement || !isFixed) {
    // Account for scroll of the offset parent
    if (
      offsetParent instanceof HTMLElement &&
      offsetParent !== element.ownerDocument.body
    ) {
      scrollLeft = offsetParent.scrollLeft;
      scrollTop = offsetParent.scrollTop;
    } else {
      const doc = element.ownerDocument.documentElement;
      scrollLeft = doc.scrollLeft;
      scrollTop = doc.scrollTop;
    }

    // Subtract the offset parent's position to get relative coordinates
    if (isOffsetParentAnElement) {
      const offsetParentRect = offsetParent.getBoundingClientRect();
      offsetX =
        offsetParentRect.x +
        (offsetParent as HTMLElement).clientLeft;
      offsetY =
        offsetParentRect.y +
        (offsetParent as HTMLElement).clientTop;
    }
  }

  return {
    x: elementRect.x + scrollLeft - offsetX,
    y: elementRect.y + scrollTop - offsetY,
    width: elementRect.width,
    height: elementRect.height
  };
}

/**
 * Gets the bounding rectangles for reference and floating elements,
 * with the reference rect computed relative to the floating element's
 * offset parent so that the coordinates work with position:absolute.
 * @param reference - The reference element.
 * @param floating - The floating element.
 * @param strategy - The CSS positioning strategy ('absolute' or 'fixed').
 * @returns The bounding rectangles for both elements.
 */
export function getElementRects(
  reference: Element,
  floating: HTMLElement,
  strategy: Strategy = 'absolute'
): ElementRects {
  const offsetParent = getOffsetParent(floating);

  return {
    reference: getRectRelativeToOffsetParent(
      reference,
      offsetParent,
      strategy
    ),
    floating: {
      x: 0,
      y: 0,
      width: floating.getBoundingClientRect().width,
      height: floating.getBoundingClientRect().height
    }
  };
}
