/**
 * Middleware system types
 * Advanced TypeScript patterns for composable positioning modifiers
 */

import type { Placement, Strategy } from './placement';
import type { ElementRects, Elements } from './geometry';

/**
 * The state passed to middleware functions
 * Readonly to prevent mutations - pure functional approach
 */
export interface MiddlewareState {
  readonly x: number;
  readonly y: number;
  readonly placement: Placement;
  readonly strategy: Strategy;
  readonly rects: ElementRects;
  readonly elements: Elements;
}

/**
 * The result returned by middleware functions
 * All properties are optional - only specify what you want to change
 */
export interface MiddlewareResult {
  /** New x coordinate (if changed) */
  x?: number;
  /** New y coordinate (if changed) */
  y?: number;
  /** New placement (if changed, e.g., after flipping) */
  placement?: Placement;
  /** If true, restart the middleware pipeline from the beginning */
  reset?: boolean;
  /** Additional data to pass to other middleware */
  data?: Record<string, unknown>;
}

/**
 * Middleware function type
 * Pure function: takes state, returns modifications
 */
export type MiddlewareFn = (
  state: MiddlewareState
) => MiddlewareResult | Promise<MiddlewareResult>;

/**
 * Middleware with metadata
 */
export interface Middleware {
  /** The name of this middleware (for debugging) */
  readonly name: string;
  /** The middleware function */
  readonly fn: MiddlewareFn;
}

/**
 * Helper to create named middleware
 */
export function createMiddleware(name: string, fn: MiddlewareFn): Middleware {
  return { name, fn };
}

/**
 * Type for middleware factory functions
 */
export type MiddlewareFactory<TOptions = void> = TOptions extends void
  ? () => Middleware
  : (options: TOptions) => Middleware;

/**
 * Utility type to extract options type from a middleware factory
 */
export type MiddlewareOptions<T> = T extends MiddlewareFactory<infer O>
  ? O
  : never;
