/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { detectOverflow } from '../utils/detectOverflow';
import { createMiddleware } from '../types';

import type { Middleware, BoundaryOptions } from '../types';

export interface HideOptions extends BoundaryOptions {
  /**
   * The strategy to use for hiding.
   * - 'referenceHidden': Hide when the reference is fully clipped.
   * - 'escaped': Hide when the floating element has escaped the boundary.
   * @default 'referenceHidden'
   */
  strategy?: 'referenceHidden' | 'escaped';
}

/**
 * Creates a hide middleware that determines visibility state.
 * @param options - Configuration options.
 * @returns A middleware that computes hide data.
 */
export function hide(options: HideOptions = {}): Middleware {
  const { strategy = 'referenceHidden', ...detectOverflowOptions } = options;

  return createMiddleware('hide', (state) => {
    const { rects, elements } = state;

    if (strategy === 'referenceHidden') {
      const referenceRect = elements.reference.getBoundingClientRect();
      const overflow = detectOverflow(
        {
          x: referenceRect.x,
          y: referenceRect.y,
          width: referenceRect.width,
          height: referenceRect.height
        },
        detectOverflowOptions
      );

      const referenceHidden =
        overflow.top >= referenceRect.height ||
        overflow.bottom >= referenceRect.height ||
        overflow.left >= referenceRect.width ||
        overflow.right >= referenceRect.width;

      return {
        data: {
          referenceHidden,
          referenceHiddenOffsets: overflow
        }
      };
    }

    const overflow = detectOverflow(rects.floating, detectOverflowOptions);
    const escaped =
      overflow.top < 0 ||
      overflow.bottom < 0 ||
      overflow.left < 0 ||
      overflow.right < 0;

    return {
      data: {
        escaped,
        escapedOffsets: overflow
      }
    };
  });
}
