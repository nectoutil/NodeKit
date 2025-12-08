/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Placement, Strategy } from './placement';
import type { ElementRects, Elements } from './geometry';

export interface MiddlewareState {
  readonly x: number;
  readonly y: number;
  readonly placement: Placement;
  readonly strategy: Strategy;
  readonly rects: ElementRects;
  readonly elements: Elements;
}

export interface MiddlewareResult {
  x?: number;
  y?: number;
  placement?: Placement;
  reset?: boolean;
  data?: Record<string, unknown>;
}

export type MiddlewareFn = (
  state: MiddlewareState
) => MiddlewareResult | Promise<MiddlewareResult>;

export interface Middleware {
  readonly name: string;
  readonly fn: MiddlewareFn;
}

/**
 * Creates a named middleware.
 * @param name - The middleware name for debugging.
 * @param fn - The middleware function.
 * @returns A middleware object.
 */
export function createMiddleware(name: string, fn: MiddlewareFn): Middleware {
  return { name, fn };
}

export type MiddlewareFactory<TOptions = void> = TOptions extends void
  ? () => Middleware
  : (options: TOptions) => Middleware;

export type MiddlewareOptions<T> = T extends MiddlewareFactory<infer O>
  ? O
  : never;
