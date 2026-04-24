/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Capitalizes the first character of a string; leaves the rest unchanged.
 */
export function capitalize(str: string): string {
  if (str.length === 0) return str;

  return str[0].toUpperCase() + str.slice(1);
}
