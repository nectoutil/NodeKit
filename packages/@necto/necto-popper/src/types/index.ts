/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type { Side, Alignment, Placement, Strategy } from './placement';

export {
  isSide,
  isAlignment,
  isPlacement,
  getSide,
  getAlignment,
  getAxis,
  getOppositeSide,
  getOppositeAlignment
} from './placement';

export type {
  Coordinates,
  Dimensions,
  Rect,
  ElementRects,
  Elements,
  Padding,
  OverflowData,
  RootBoundary,
  BoundaryOptions
} from './geometry';

export { resolvePadding, hasAnyOverflow, clamp } from './geometry';

export type {
  MiddlewareState,
  MiddlewareResult,
  MiddlewareFn,
  Middleware,
  MiddlewareFactory,
  MiddlewareOptions
} from './middleware';

export { createMiddleware } from './middleware';

export type { ComputePositionOptions, ComputePositionResult } from './options';

export { DEFAULT_OPTIONS } from './options';
