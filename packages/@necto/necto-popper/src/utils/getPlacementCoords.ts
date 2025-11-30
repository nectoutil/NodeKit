/**
 * Calculate coordinates based on placement
 * Pure math functions - easy to test!
 */

import type { Placement, Coordinates, ElementRects } from '../types';
import { getSide, getAlignment, getAxis } from '../types';

/**
 * Computes x,y coordinates for a given placement.
 * Pure function: same inputs always produce same outputs.
 */
export function computeCoords(
  placement: Placement,
  rects: ElementRects
): Coordinates {
  const { reference, floating } = rects;

  // Extract the side and alignment from placement using our utility functions
  const side = getSide(placement);
  const alignment = getAlignment(placement);

  let x = 0;
  let y = 0;

  // Position on the correct side
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

  // Apply alignment (start/end) using our utility function
  if (alignment) {
    const axis = getAxis(side);

    if (axis === 'x') {
      // Horizontal alignment
      if (alignment === 'start') {
        x = reference.x;
      } else if (alignment === 'end') {
        x = reference.x + reference.width - floating.width;
      }
    } else {
      // Vertical alignment
      if (alignment === 'start') {
        y = reference.y;
      } else if (alignment === 'end') {
        y = reference.y + reference.height - floating.height;
      }
    }
  }

  return { x, y };
}
