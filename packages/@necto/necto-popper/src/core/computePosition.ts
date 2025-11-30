/**
 * Core positioning computation
 * Pure functional approach - no classes needed!
 */

import { DEFAULT_OPTIONS } from '../types';
import { getElementRects } from './getElementRects';
import { computeCoords } from '../utils/getPlacementCoords';

import type { ComputePositionResult, ComputePositionOptions } from '../types';

/**
 * Computes the position of a floating element relative to a reference element.
 *
 * This is the main entry point - a pure function that:
 * 1. Gets element measurements
 * 2. Computes initial position based on placement
 * 3. Applies middleware (modifiers) in sequence
 * 4. Returns final coordinates
 *
 * @example
 * const position = await computePosition(button, tooltip, {
 *   placement: 'top',
 *   middleware: [offset(8), flip(), shift()]
 * });
 */
export async function computePosition(
  reference: Element,
  floating: HTMLElement,
  options: ComputePositionOptions = {}
): Promise<ComputePositionResult> {
  const {
    placement = DEFAULT_OPTIONS.placement,
    strategy = DEFAULT_OPTIONS.strategy,
    middleware = []
  } = options;

  // 1. Get element measurements
  const rects = getElementRects(reference, floating);

  // 2. Compute initial coordinates based on placement
  let { x, y } = computeCoords(placement, rects);

  let currentPlacement = placement;
  const middlewareData: Record<string, unknown> = {};

  // 3. Apply middleware in sequence (functional pipeline pattern)
  for (const mw of middleware) {
    const result = await mw.fn({
      x,
      y,
      placement: currentPlacement,
      strategy,
      rects,
      elements: { reference, floating }
    });

    // Middleware can modify x, y, or even change placement
    if (result.x !== undefined) x = result.x;
    if (result.y !== undefined) y = result.y;
    if (result.placement !== undefined) currentPlacement = result.placement;

    // Store middleware data
    if (result.data) {
      middlewareData[mw.name] = result.data;
    }

    // Reset allows middleware to restart the pipeline (e.g., flip changed placement)
    if (result.reset) {
      const newCoords = computeCoords(currentPlacement, rects);
      x = newCoords.x;
      y = newCoords.y;
    }
  }

  // 4. Return final result
  return {
    x,
    y,
    placement: currentPlacement,
    strategy,
    middlewareData
  };
}
