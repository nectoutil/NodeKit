/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Returns the smallest value after converting each argument to a number.
 *
 * @param args - Values to convert to numbers and compare.
 * @returns The smallest converted value, `Infinity` when no values are given,
 * or `NaN` when an argument converts to `NaN`.
 * @throws {TypeError} If an argument is a `BigInt`, `Symbol`, or cannot be
 * converted to a number.
 *
 * @example
 * ```ts
 * min(3, -2, 1); // -2
 * min('2', '10'); // 2
 * ```
 */
export function min(...args: unknown[]): number {
  if (args.length === 0) {
    return Infinity;
  }

  let minimum: number = +(args[0] as number);

  if (Number.isNaN(minimum)) {
    return NaN;
  }

  for (let index: number = 1; index < args.length; index++) {
    const current: number = +(args[index] as number);

    if (Number.isNaN(current)) {
      return NaN;
    }

    if (current < minimum || (current === 0 && minimum === 0 && 1 / current === -Infinity)) {
      minimum = current;
    }
  }

  return minimum;
}