/**
 * Configuration options for computePosition
 */

import type { Placement, Strategy } from './placement';
import type { Middleware } from './middleware';

/**
 * Options for computing position
 */
export interface ComputePositionOptions {
  /**
   * Where to place the floating element relative to the reference
   * @default 'bottom'
   */
  placement?: Placement;

  /**
   * The CSS position property to use
   * @default 'absolute'
   */
  strategy?: Strategy;

  /**
   * Array of middleware to apply
   * Middleware functions are applied in order
   * @default []
   */
  middleware?: Middleware[];
}

/**
 * The result of computing position
 */
export interface ComputePositionResult {
  /**
   * The x coordinate for the floating element
   */
  x: number;

  /**
   * The y coordinate for the floating element
   */
  y: number;

  /**
   * The final placement (may differ from initial if flipped)
   */
  placement: Placement;

  /**
   * The strategy used
   */
  strategy: Strategy;

  /**
   * Additional data from middleware
   */
  middlewareData?: Record<string, unknown>;
}

/**
 * Default values for options
 */
export const DEFAULT_OPTIONS: Required<
  Omit<ComputePositionOptions, 'middleware'>
> = {
  placement: 'bottom',
  strategy: 'absolute'
};
