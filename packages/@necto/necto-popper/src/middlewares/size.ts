/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { detectOverflow } from '../utils/detectOverflow';
import { createMiddleware, getSide } from '../types';

import type { Middleware, BoundaryOptions } from '../types';

export interface SizeOptions extends BoundaryOptions {
  /**
   * Function to apply size styles to the floating element.
   */
  apply?: (args: {
    availableWidth: number;
    availableHeight: number;
    elements: { reference: Element; floating: HTMLElement };
  }) => void;
}

/**
 * Creates a size middleware that constrains the floating element dimensions.
 * @param options - Configuration options for size constraints.
 * @returns A middleware that computes available space.
 */
export function size(options: SizeOptions = {}): Middleware {
  const { apply, ...detectOverflowOptions } = options;

  return createMiddleware('size', (state) => {
    const { x, y, rects, elements, placement } = state;
    const side = getSide(placement);

    const overflow = detectOverflow(
      { ...rects.floating, x, y },
      detectOverflowOptions
    );

    const availableHeight =
      side === 'top'
        ? rects.reference.y - overflow.top
        : side === 'bottom'
          ? window.innerHeight -
            rects.reference.y -
            rects.reference.height -
            overflow.bottom
          : rects.floating.height - Math.max(overflow.top, overflow.bottom);

    const availableWidth =
      side === 'left'
        ? rects.reference.x - overflow.left
        : side === 'right'
          ? window.innerWidth -
            rects.reference.x -
            rects.reference.width -
            overflow.right
          : rects.floating.width - Math.max(overflow.left, overflow.right);

    apply?.({
      availableWidth: Math.max(0, availableWidth),
      availableHeight: Math.max(0, availableHeight),
      elements
    });

    return {
      data: {
        availableWidth,
        availableHeight
      }
    };
  });
}
