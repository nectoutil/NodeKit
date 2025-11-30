/**
 * Central export for all types
 * Organized and consolidated for clarity
 */

// ============================================================================
// PLACEMENT - Placement-related types and utilities
// ============================================================================
export type {
  Side,
  Alignment,
  Placement,
  Strategy
} from './placement';

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

// ============================================================================
// GEOMETRY - Geometric types, boundaries, padding, overflow
// ============================================================================
export type {
  Coordinates,
  Dimensions,
  Rect,
  ElementRects,
  Elements,
  Padding,
  OverflowData,
  RootBoundary,
  BoundaryOptions // Moved from boundary.ts
} from './geometry';

export {
  resolvePadding,
  hasAnyOverflow,
  clamp
} from './geometry';

// ============================================================================
// MIDDLEWARE - Middleware system types
// ============================================================================
export type {
  MiddlewareState,
  MiddlewareResult,
  MiddlewareFn,
  Middleware,
  MiddlewareFactory,
  MiddlewareOptions
} from './middleware';

export { createMiddleware } from './middleware';

// ============================================================================
// OPTIONS - Main API options and results
// ============================================================================
export type {
  ComputePositionOptions,
  ComputePositionResult
} from './options';

export { DEFAULT_OPTIONS } from './options';
