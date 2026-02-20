/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Percentage type definition
 */
export type Percentage = number & { readonly __brand: 'Percentage' };

/**
 * Creates a Percentage from a decimal value (0-1)
 * @throws {RangeError} if value is outside 0-1 range
 */
export function percentage(value: number): Percentage {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError(`Percentage must be between 0 and 1, got ${value}`);
  }

  return value as Percentage;
}

/**
 * Creates a Percentage from a whole number (0-100)
 */
export function percentageFromWhole(value: number): Percentage {
  return percentage(value / 100);
}

/**
 * Converts Percentage to whole number (0-100)
 */
export function percentageToWhole(value: Percentage): number {
  return value * 100;
}

/**
 * Formats a Percentage as a localized string
 */
export function formatPercentage(
  value: Percentage,
  locale?: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    ...options
  }).format(value);
}

/**
 * Clamps a number and returns it as a Percentage
 */
export function clampToPercentage(value: number): Percentage {
  return percentage(Math.min(Math.max(value, 0), 1));
}