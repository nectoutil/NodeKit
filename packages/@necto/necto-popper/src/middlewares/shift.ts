/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { detectOverflow } from '../utils/detectOverflow';
import { createMiddleware } from '../types';

import type { Middleware, BoundaryOptions } from '../types';

export interface ShiftOptions extends BoundaryOptions {
  /**
   * Maximum distance to shift in pixels.
   */
  maxShift?: number;

  /**
   * Which axes to shift on.
   * @default 'both'
   */
  axis?: 'x' | 'y' | 'both';
}

/**
 * Creates a shift middleware that keeps the floating element within the viewport.
 * @param options - Configuration options for shift behavior.
 * @returns A middleware that shifts position to prevent overflow.
 */
export function shift(options: ShiftOptions = {}): Middleware {
  return createMiddleware('shift', (state) => {
    const { x, y, rects } = state;
    const { maxShift, axis = 'both' } = options;
    const floatingRect = rects.floating;

    const overflow = detectOverflow(
      { ...floatingRect, x, y },
      { boundary: options.boundary, padding: options.padding }
    );

    let newX = x;
    let newY = y;

    if (axis === 'x' || axis === 'both') {
      if (overflow.left > 0) {
        const shiftAmount = Math.min(overflow.left, maxShift ?? overflow.left);
        newX += shiftAmount;
      } else if (overflow.right > 0) {
        const shiftAmount = Math.min(
          overflow.right,
          maxShift ?? overflow.right
        );
        newX -= shiftAmount;
      }
    }

    if (axis === 'y' || axis === 'both') {
      if (overflow.top > 0) {
        const shiftAmount = Math.min(overflow.top, maxShift ?? overflow.top);
        newY += shiftAmount;
      } else if (overflow.bottom > 0) {
        const shiftAmount = Math.min(
          overflow.bottom,
          maxShift ?? overflow.bottom
        );
        newY -= shiftAmount;
      }
    }

    if (newX !== x || newY !== y) {
      return {
        x: newX,
        y: newY,
        data: {
          shifted: { x: newX - x, y: newY - y }
        }
      };
    }

    return {};
  });
}
