/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createMiddleware, getSide, clamp } from '../types';

import type { Middleware } from '../types';

export interface ArrowOptions {
  /**
   * The arrow element to position.
   */
  element: HTMLElement | null;

  /**
   * Padding from the edges of the floating element.
   * @default 0
   */
  padding?: number;
}

/**
 * Creates an arrow middleware that positions an arrow element.
 * @param options - The arrow element and padding options.
 * @returns A middleware that computes arrow positioning data.
 */
export function arrow(options: ArrowOptions): Middleware {
  const { element, padding = 0 } = options;

  return createMiddleware('arrow', (state) => {
    if (!element) {
      return {};
    }

    const { x, y, placement, rects } = state;
    const side = getSide(placement);
    const isVertical = side === 'top' || side === 'bottom';

    // Cross-axis length of the arrow element.
    // For left/right, the arrow rotates 90deg so its width becomes the cross-axis length.
    const arrowLength = element.offsetWidth;

    const floatingLength = isVertical
      ? rects.floating.width
      : rects.floating.height;

    const minPadding: number = padding;
    const maxPadding: number = floatingLength - arrowLength - padding;

    const referenceCenter: number = isVertical
      ? rects.reference.x + rects.reference.width / 2
      : rects.reference.y + rects.reference.height / 2;

    const floatingStart = isVertical ? x : y;

    const center = referenceCenter - floatingStart - arrowLength / 2;
    const arrowOffset = clamp(center, minPadding, maxPadding);

    return {
      data: {
        x: isVertical ? arrowOffset : undefined,
        y: isVertical ? undefined : arrowOffset
      }
    };
  });
}
