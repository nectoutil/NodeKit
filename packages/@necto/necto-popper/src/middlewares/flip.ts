/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { detectOverflow, hasOverflow } from '../utils/detectOverflow';
import {
  createMiddleware,
  getSide,
  getAlignment,
  getOppositeSide
} from '../types';

import type { Middleware, Placement, BoundaryOptions } from '../types';

export interface FlipOptions extends BoundaryOptions {
  /**
   * Fallback placements to try if the main placement doesn't fit.
   */
  fallbackPlacements?: Placement[];
}

/**
 * Creates a flip middleware that changes placement when overflowing.
 * @param options - Configuration options for flip behavior.
 * @returns A middleware that flips placement when there's insufficient space.
 */
export function flip(options: FlipOptions = {}): Middleware {
  return createMiddleware('flip', (state) => {
    const { placement, rects } = state;
    const floatingRect = rects.floating;

    const overflow = detectOverflow(floatingRect, options);
    const isOverflowing = hasOverflow(floatingRect, options);

    if (!isOverflowing) {
      return {};
    }

    const side = getSide(placement);
    const alignment = getAlignment(placement);

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

    const oppositeSide = getOppositeSide(side);
    const oppositePlacement: Placement = alignment
      ? `${oppositeSide}-${alignment}`
      : oppositeSide;

    return {
      placement: oppositePlacement,
      reset: true,
      data: { flipped: true, originalPlacement: placement }
    };
  });
}
