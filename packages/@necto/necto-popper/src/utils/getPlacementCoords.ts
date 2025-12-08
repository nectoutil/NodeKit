/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getSide, getAlignment, getAxis } from '../types';

import type { Placement, Coordinates, ElementRects } from '../types';

/**
 * Computes x,y coordinates for a given placement.
 * @param placement - The desired placement position.
 * @param rects - The bounding rectangles of reference and floating elements.
 * @returns The computed x,y coordinates.
 */
export function computeCoords(
  placement: Placement,
  rects: ElementRects
): Coordinates {
  const { reference, floating } = rects;
  const side = getSide(placement);
  const alignment = getAlignment(placement);

  let x = 0;
  let y = 0;

  switch (side) {
    case 'top':
      x = reference.x + reference.width / 2 - floating.width / 2;
      y = reference.y - floating.height;
      break;
    case 'bottom':
      x = reference.x + reference.width / 2 - floating.width / 2;
      y = reference.y + reference.height;
      break;
    case 'left':
      x = reference.x - floating.width;
      y = reference.y + reference.height / 2 - floating.height / 2;
      break;
    case 'right':
      x = reference.x + reference.width;
      y = reference.y + reference.height / 2 - floating.height / 2;
      break;
  }

  if (alignment) {
    const axis = getAxis(side);

    if (axis === 'x') {
      if (alignment === 'start') {
        x = reference.x;
      } else if (alignment === 'end') {
        x = reference.x + reference.width - floating.width;
      }
    } else {
      if (alignment === 'start') {
        y = reference.y;
      } else if (alignment === 'end') {
        y = reference.y + reference.height - floating.height;
      }
    }
  }

  return { x, y };
}
