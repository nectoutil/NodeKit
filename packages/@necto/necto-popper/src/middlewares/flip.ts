/**
 * Flip middleware - flips placement when there's not enough space
 * Example of a more complex middleware
 */

import { detectOverflow, hasOverflow } from '../utils/detectOverflow';
import type { Middleware, Placement, BoundaryOptions } from '../types';
import {
  createMiddleware,
  getSide,
  getAlignment,
  getOppositeSide
} from '../types';

export interface FlipOptions extends BoundaryOptions {
  /**
   * Fallback placements to try if the main placement doesn't fit
   * If not provided, will just flip to the opposite side
   */
  fallbackPlacements?: Placement[];
}

/**
 * Creates a flip middleware that changes placement when overflowing.
 *
 * Uses @necto/dom's getContainmentRect under the hood!
 *
 * @example
 * computePosition(ref, floating, {
 *   middleware: [flip()] // Auto-flips if no space
 * });
 */
export function flip(options: FlipOptions = {}): Middleware {
  return createMiddleware('flip', (state) => {
    const { placement, rects } = state;
    const floatingRect = rects.floating;

    // Check if current placement causes overflow using our utility
    const overflow = detectOverflow(floatingRect, options);
    const isOverflowing = hasOverflow(floatingRect, options);

    if (!isOverflowing) {
      return {}; // No changes needed
    }

    // Determine which side has the most overflow
    const side = getSide(placement);
    const alignment = getAlignment(placement);

    // Check if we should flip to the opposite side
    let shouldFlip = false;

    switch (side) {
      case 'top':
        shouldFlip = overflow.top > 0;
        break;
      case 'bottom':
        shouldFlip = overflow.bottom > 0;
        break;
      case 'left':
        shouldFlip = overflow.left > 0;
        break;
      case 'right':
        shouldFlip = overflow.right > 0;
        break;
    }

    if (!shouldFlip) {
      return {};
    }

    // Flip to opposite side
    const oppositeSide = getOppositeSide(side);
    const oppositePlacement: Placement = alignment
      ? `${oppositeSide}-${alignment}`
      : oppositeSide;

    return {
      placement: oppositePlacement,
      reset: true, // Tell computePosition to recalculate coords
      data: { flipped: true, originalPlacement: placement }
    };
  });
}
