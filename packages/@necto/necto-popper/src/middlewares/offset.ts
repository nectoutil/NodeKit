/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createMiddleware, getSide } from '../types';

import type { Middleware } from '../types';

export interface OffsetOptions {
  /**
   * The offset distance in pixels.
   */
  value: number;
}

/**
 * Creates an offset middleware that adds distance between reference and floating elements.
 * @param options - The offset value or options object.
 * @returns A middleware that applies the specified offset.
 */
export function offset(options: OffsetOptions | number): Middleware {
  const value = typeof options === 'number' ? options : options.value;

  return createMiddleware('offset', (state) => {
    const { x, y, placement } = state;
    const side = getSide(placement);

    let newX = x;
    let newY = y;

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
