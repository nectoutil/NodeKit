/**
 * @necto/popper
 *
 * Core positioning engine for popovers, tooltips, dropdowns, and floating elements.
 * Framework-agnostic positioning utilities.
 *
 * Built on top of @necto/dom for robust DOM manipulation.
 */

// ============================================================================
// TYPES - Comprehensive type system for positioning
// ============================================================================
export type * from './types';
export * from './types'; // Export utilities and constants

// ============================================================================
// CORE - Main positioning engine
// ============================================================================
export { computePosition } from './core/computePosition';
export { getElementRects } from './core/getElementRects';

// ============================================================================
// MIDDLEWARE - Composable position modifiers
// ============================================================================
export { offset } from './middlewares/offset';
export type { OffsetOptions } from './middlewares/offset';

export { flip } from './middlewares/flip';
export type { FlipOptions } from './middlewares/flip';

export { shift } from './middlewares/shift';
export type { ShiftOptions } from './middlewares/shift';

// ============================================================================
// UTILITIES - Helper functions
// ============================================================================
export { computeCoords } from './utils/getPlacementCoords';
export { detectOverflow, hasOverflow } from './utils/detectOverflow';

// ============================================================================
// RE-EXPORTS - Commonly used @necto/dom utilities for convenience
// ============================================================================
export {
  getContainmentRect,
  isNode,
  getOwnerWindow,
  getOwnerDocument
} from '@necto/dom';
