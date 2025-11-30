/**
 * Shift middleware - shifts the floating element to stay in view
 */

import { detectOverflow } from '../utils/detectOverflow';
import type { Middleware, BoundaryOptions } from '../types';
import { createMiddleware, clamp } from '../types';

export interface ShiftOptions extends BoundaryOptions {
  /**
   * Maximum distance to shift (prevents shifting too far)
   */
  maxShift?: number;

  /**
   * Which axes to shift on
   * @default 'both'
   */
  axis?: 'x' | 'y' | 'both';
}

/**
 * Creates a shift middleware that keeps element within viewport.
 *
 * Uses @necto/dom's getContainmentRect for boundary detection!
 *
 * @example
 * computePosition(ref, floating, {
 *   middleware: [shift({ padding: 8 })]
 * });
 */
export function shift(options: ShiftOptions = {}): Middleware {
  return createMiddleware('shift', (state) => {
    const { x, y, rects } = state;
    const { maxShift, axis = 'both' } = options;
    const floatingRect = rects.floating;

    // Detect overflow using our utility (which uses @necto/dom!)
    const overflow = detectOverflow(
      { ...floatingRect, x, y },
      { boundary: options.boundary, padding: options.padding }
    );

    let newX = x;
    let newY = y;

    // Shift horizontally if needed and allowed
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

    // Shift vertically if needed and allowed
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

    // Only return new coordinates if they changed
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
