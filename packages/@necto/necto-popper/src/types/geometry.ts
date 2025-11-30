/**
 * Geometry and boundary types for positioning calculations
 * Consolidated for simplicity - boundaries are geometric concepts
 */

// ============================================================================
// BASIC GEOMETRY
// ============================================================================

/**
 * 2D coordinates
 */
export interface Coordinates {
  x: number;
  y: number;
}

/**
 * Element dimensions
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * A rectangle with position and dimensions
 */
export interface Rect extends Coordinates, Dimensions {}

/**
 * Bounding rectangles for reference and floating elements
 */
export interface ElementRects {
  readonly reference: Rect;
  readonly floating: Rect;
}

/**
 * The actual HTML elements being positioned
 */
export interface Elements {
  readonly reference: Element;
  readonly floating: HTMLElement;
}

// ============================================================================
// PADDING & OVERFLOW
// ============================================================================

/**
 * Padding configuration - can be a number or per-side object
 */
export type Padding =
  | number
  | Partial<{
      top: number;
      right: number;
      bottom: number;
      left: number;
    }>;

/**
 * Resolve padding to all four sides
 */
export function resolvePadding(padding: Padding = 0): Required<{
  top: number;
  right: number;
  bottom: number;
  left: number;
}> {
  if (typeof padding === 'number') {
    return {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }

  return {
    top: padding.top ?? 0,
    right: padding.right ?? 0,
    bottom: padding.bottom ?? 0,
    left: padding.left ?? 0
  };
}

/**
 * Overflow amounts on each side
 */
export interface OverflowData {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

/**
 * Check if there's any overflow
 */
export function hasAnyOverflow(overflow: OverflowData): boolean {
  return (
    overflow.top > 0 ||
    overflow.right > 0 ||
    overflow.bottom > 0 ||
    overflow.left > 0
  );
}

// ============================================================================
// BOUNDARY (merged from boundary.ts)
// ============================================================================

/**
 * Root boundary - can be viewport, document, or a specific element
 */
export type RootBoundary = 'viewport' | 'document' | Element;

/**
 * Boundary options for overflow detection
 * Used by flip(), shift(), and other middleware
 */
export interface BoundaryOptions {
  /**
   * The boundary element to check overflow against
   * If undefined, uses the viewport
   */
  boundary?: Element;

  /**
   * Padding around the boundary
   * Can be a single number or per-side values
   * @default 0
   */
  padding?: Padding;

  /**
   * The root boundary to use
   * @default 'viewport'
   */
  rootBoundary?: RootBoundary;
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
