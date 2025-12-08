/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Placement, Strategy } from './placement';
import type { Middleware } from './middleware';

export interface ComputePositionOptions {
  /**
   * Where to place the floating element relative to the reference.
   * @default 'bottom'
   */
  placement?: Placement;

  /**
   * The CSS position property to use.
   * @default 'absolute'
   */
  strategy?: Strategy;

  /**
   * Array of middleware to apply in order.
   * @default []
   */
  middleware?: Middleware[];
}

export interface ComputePositionResult {
  x: number;
  y: number;
  placement: Placement;
  strategy: Strategy;
  middlewareData?: Record<string, unknown>;
}

export const DEFAULT_OPTIONS: Required<
  Omit<ComputePositionOptions, 'middleware'>
> = {
  placement: 'bottom',
  strategy: 'absolute'
};
