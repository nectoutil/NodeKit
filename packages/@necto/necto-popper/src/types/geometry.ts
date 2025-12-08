/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export interface Coordinates {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Rect extends Coordinates, Dimensions {}

export interface ElementRects {
  readonly reference: Rect;
  readonly floating: Rect;
}

export interface Elements {
  readonly reference: Element;
  readonly floating: HTMLElement;
}

export type Padding =
  | number
  | Partial<{
      top: number;
      right: number;
      bottom: number;
      left: number;
    }>;

/**
 * Resolves padding to all four sides.
 * @param padding - The padding value or object.
 * @returns Resolved padding for all sides.
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

export interface OverflowData {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

/**
 * Checks if there's any overflow on any side.
 * @param overflow - The overflow data to check.
 * @returns True if any side has overflow.
 */
export function hasAnyOverflow(overflow: OverflowData): boolean {
  return (
    overflow.top > 0 ||
    overflow.right > 0 ||
    overflow.bottom > 0 ||
    overflow.left > 0
  );
}

export type RootBoundary = 'viewport' | 'document' | Element;

export interface BoundaryOptions {
  /**
   * The boundary element to check overflow against.
   */
  boundary?: Element;

  /**
   * Padding around the boundary.
   * @default 0
   */
  padding?: Padding;

  /**
   * The root boundary to use.
   * @default 'viewport'
   */
  rootBoundary?: RootBoundary;
}

/**
 * Clamps a value between min and max.
 * @param value - The value to clamp.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
