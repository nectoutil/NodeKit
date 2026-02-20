/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export function clamp(
  value: number,
  min: number = -Infinity,
  max: number = Infinity
): number {
  return Math.min(Math.max(value, min), max);
}