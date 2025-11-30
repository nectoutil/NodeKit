/**
 * Offset middleware - adds distance between reference and floating element
 * Example of a simple middleware function
 */

import type { Middleware } from '../types';
import { createMiddleware, getSide } from '../types';

export interface OffsetOptions {
  /**
   * The offset distance
   */
  value: number;
}

/**
 * Creates an offset middleware.
 * This is a "middleware factory" - a function that returns a middleware function.
 *
 * Pattern: Configuration → Middleware Function → Result
 *
 * @example
 * computePosition(ref, floating, {
 *   middleware: [offset({ value: 10 })] // Adds 10px gap
 * });
 */
export function offset(options: OffsetOptions | number): Middleware {
  const value = typeof options === 'number' ? options : options.value;

  // Return the actual middleware using createMiddleware helper
  return createMiddleware('offset', (state) => {
    const { x, y, placement } = state;
    const side = getSide(placement);

    let newX = x;
    let newY = y;

    // Apply offset based on side
    switch (side) {
      case 'top':
        newY -= value;
        break;
      case 'bottom':
        newY += value;
        break;
      case 'left':
        newX -= value;
        break;
      case 'right':
        newX += value;
        break;
    }

    return {
      x: newX,
      y: newY,
      data: { offset: value }
    };
  });
}
