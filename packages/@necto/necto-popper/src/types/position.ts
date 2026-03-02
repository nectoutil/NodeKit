/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Placement } from './placement';

/**
 * High-level positioning props for component APIs.
 * Components can extend this interface so positioning props
 * fall through directly to the positioning engine.
 */
export interface PositionProps {
  /**
   * The placement of the overlay relative to the trigger.
   * @default 'bottom'
   */
  placement?: Placement;

  /**
   * Offset distance (main axis) in pixels.
   * @default 0
   */
  offset?: number;

  /**
   * Offset distance (cross axis) in pixels.
   * @default 0
   */
  crossOffset?: number;

  /**
   * Whether the overlay should flip to the opposite side when
   * there is insufficient space.
   * @default true
   */
  shouldFlip?: boolean;

  /**
   * Minimum padding between the overlay and the viewport edge.
   * @default 12
   */
  containerPadding?: number;

  /**
   * Minimum padding between the arrow and the edges of the overlay.
   * @default 0
   */
  arrowBoundaryOffset?: number;

  /**
   * Maximum height of the overlay in pixels.
   * When set, the overlay height will be capped to the available space.
   */
  maxHeight?: number;
}
