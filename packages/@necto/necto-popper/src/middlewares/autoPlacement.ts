/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { detectOverflow } from '../utils/detectOverflow';
import { createMiddleware, getSide, getAlignment } from '../types';

import type {
  Middleware,
  Placement,
  Side,
  Alignment,
  BoundaryOptions
} from '../types';

export interface AutoPlacementOptions extends BoundaryOptions {
  /**
   * Allowed placements to choose from.
   */
  allowedPlacements?: Placement[];

  /**
   * Whether to also auto-align.
   * @default true
   */
  autoAlignment?: boolean;
}

const ALL_SIDES: Side[] = ['top', 'right', 'bottom', 'left'];
const ALL_ALIGNMENTS: Array<Alignment | undefined> = [
  undefined,
  'start',
  'end'
];

/**
 * Creates an auto-placement middleware that picks the best placement.
 * @param options - Configuration options.
 * @returns A middleware that automatically selects optimal placement.
 */
export function autoPlacement(options: AutoPlacementOptions = {}): Middleware {
  const {
    allowedPlacements,
    autoAlignment = true,
    ...detectOverflowOptions
  } = options;

  return createMiddleware('autoPlacement', (state) => {
    const { rects, placement } = state;
    const currentSide = getSide(placement);
    const currentAlignment = getAlignment(placement);

    const placements: Placement[] =
      allowedPlacements ??
      (autoAlignment
        ? ALL_SIDES.flatMap((side) =>
            ALL_ALIGNMENTS.map((alignment) =>
              alignment ? (`${side}-${alignment}` as Placement) : side
            )
          )
        : ALL_SIDES);

    const overflows: Array<{ placement: Placement; overflow: number }> = [];

    for (const p of placements) {
      const overflow = detectOverflow(rects.floating, detectOverflowOptions);
      const side = getSide(p);

      let overflowAmount = 0;
      switch (side) {
        case 'top':
          overflowAmount = overflow.top;
          break;
        case 'bottom':
          overflowAmount = overflow.bottom;
          break;
        case 'left':
          overflowAmount = overflow.left;
          break;
        case 'right':
          overflowAmount = overflow.right;
          break;
      }

      overflows.push({ placement: p, overflow: overflowAmount });
    }

    const sorted = overflows.sort((a, b) => a.overflow - b.overflow);
    const bestPlacement = sorted[0]?.placement ?? placement;

    if (bestPlacement !== placement) {
      return {
        placement: bestPlacement,
        reset: true,
        data: {
          placements: sorted.map((o) => o.placement),
          overflows: sorted.map((o) => o.overflow)
        }
      };
    }

    return {
      data: {
        placements: sorted.map((o) => o.placement),
        overflows: sorted.map((o) => o.overflow)
      }
    };
  });
}
