/**
 * Utilities for detecting overflow and viewport boundaries
 *
 * Uses @necto/dom utilities - perfect example of package reuse!
 */

import { getContainmentRect } from '@necto/dom';
import type { Rect, OverflowData, BoundaryOptions } from '../types';
import { resolvePadding, hasAnyOverflow } from '../types';

/**
 * Detects how much a rect overflows its boundary.
 *
 * Uses your existing @necto/dom getContainmentRect!
 *
 * @example
 * const overflow = detectOverflow(tooltipRect, { boundary: container })
 * if (overflow.top > 0) {
 *   // Tooltip is overflowing the top by `overflow.top` pixels
 * }
 */
export function detectOverflow(
  rect: Rect,
  options: BoundaryOptions = {}
): OverflowData {
  const { boundary, padding: paddingOption = 0 } = options;

  // Resolve padding using our utility
  const padding = resolvePadding(paddingOption);

  // ✅ Using your existing @necto/dom utility!
  const boundaryRect = getContainmentRect(boundary);

  return {
    top: boundaryRect.top + padding.top - rect.y,
    right: rect.x + rect.width - (boundaryRect.right - padding.right),
    bottom: rect.y + rect.height - (boundaryRect.bottom - padding.bottom),
    left: boundaryRect.left + padding.left - rect.x
  };
}

/**
 * Check if a rect is overflowing on any side
 */
export function hasOverflow(
  rect: Rect,
  options: BoundaryOptions = {}
): boolean {
  const overflow = detectOverflow(rect, options);
  return hasAnyOverflow(overflow);
}
