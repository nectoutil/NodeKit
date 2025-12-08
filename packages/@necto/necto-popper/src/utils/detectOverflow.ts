/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getContainmentRect } from '@necto/dom';
import { resolvePadding, hasAnyOverflow } from '../types';

import type { Rect, OverflowData, BoundaryOptions } from '../types';

/**
 * Detects how much a rect overflows its boundary.
 * @param rect - The rectangle to check for overflow.
 * @param options - Boundary and padding options.
 * @returns Overflow amounts for each side (positive values indicate overflow).
 */
export function detectOverflow(
  rect: Rect,
  options: BoundaryOptions = {}
): OverflowData {
  const { boundary, padding: paddingOption = 0 } = options;
  const padding = resolvePadding(paddingOption);
  const boundaryRect = getContainmentRect(boundary);

  return {
    top: boundaryRect.top + padding.top - rect.y,
    right: rect.x + rect.width - (boundaryRect.right - padding.right),
    bottom: rect.y + rect.height - (boundaryRect.bottom - padding.bottom),
    left: boundaryRect.left + padding.left - rect.x
  };
}

/**
 * Checks if a rect is overflowing on any side.
 * @param rect - The rectangle to check.
 * @param options - Boundary and padding options.
 * @returns True if the rect overflows on any side.
 */
export function hasOverflow(
  rect: Rect,
  options: BoundaryOptions = {}
): boolean {
  const overflow = detectOverflow(rect, options);
  return hasAnyOverflow(overflow);
}
