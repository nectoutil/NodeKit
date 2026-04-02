// biome-ignore-all lint/suspicious/noExplicitAny: Utility functions require any for generic comparison.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Recursively compares two values for deep equality.
 * Handles primitives, null, undefined, and nested objects.
 */
export function deepEqual(left: any, right: any): boolean {
  if (left === right) {
    return true;
  }

  const isLeftObject: boolean = typeof left === 'object' && left != null;
  const isRightObject: boolean = typeof right === 'object' && right != null;

  if (!isLeftObject || !isRightObject) {
    return left === right;
  }

  const leftKeys: Array<string> = Object.keys(left);
  const rightKeys: Array<string> = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  for (const key of leftKeys) {
    if (!rightKeys.includes(key) || !deepEqual(left[key], right[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Returns the device pixel ratio for a given element's window.
 */
export function getDevicePixelRatio(element: Element): number {
  return (element.ownerDocument.defaultView || window).devicePixelRatio || 1;
}

/**
 * Rounds a value to the nearest device pixel to avoid sub-pixel rendering.
 */
export function roundByDevicePixelRatio(
  element: Element,
  value: number
): number {
  const dpr: number = getDevicePixelRatio(element);

  return Math.round(value * dpr) / dpr;
}
