/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DEFAULT_OPTIONS } from '../types';
import { getElementRects } from './getElementRects';
import { computeCoords } from '../utils/getPlacementCoords';

import type {
  Placement,
  Coordinates,
  ElementRects,
  MiddlewareResult,
  ComputePositionResult,
  ComputePositionOptions
} from '../types';

/**
 * Computes the position of a floating element relative to a reference element.
 * @param reference - The reference element to position against.
 * @param floating - The floating element to be positioned.
 * @param options - Configuration options for placement, strategy, and middleware.
 * @returns A promise resolving to the computed position result.
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

  const rects: ElementRects = getElementRects(reference, floating);
  let { x, y } = computeCoords(placement, rects);
  let currentPlacement: Placement = placement;
  const middlewareData: Record<string, unknown> = {};

  for (const mw of middleware) {
    const result: MiddlewareResult = await mw.fn({
      x,
      y,
      placement: currentPlacement,
      strategy,
      rects,
      elements: { reference, floating }
    });

    if (result.x !== undefined) x = result.x;
    if (result.y !== undefined) y = result.y;
    if (result.placement !== undefined) currentPlacement = result.placement;

    if (result.data) {
      middlewareData[mw.name] = result.data;
    }

    if (result.reset) {
      const newCoords: Coordinates = computeCoords(currentPlacement, rects);
      x = newCoords.x;
      y = newCoords.y;
    }
  }

  return {
    x,
    y,
    placement: currentPlacement,
    strategy,
    middlewareData
  };
}
