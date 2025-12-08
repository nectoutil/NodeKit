/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DOM } from '@necto/constants';

import type { AriaAttribute } from './types';

/**
 * Converts an aria attribute name to a capitalized key.
 * @param attr - The aria attribute (e.g., 'aria-pressed').
 * @returns The capitalized key (e.g., 'Pressed').
 */
const toAriaKey = (attr: string): string => {
  const withoutPrefix = attr.replace('aria-', '');
  return withoutPrefix.charAt(0).toUpperCase() + withoutPrefix.slice(1);
};

/**
 * Creates a mapping of capitalized ARIA keys to their attribute names.
 * @returns A record where keys are capitalized names and values are aria attributes.
 */
const createAriaPropsMap = (): Record<string, string> =>
  DOM.ARIA_ATTRIBUTES.reduce(
    (acc, attr) => {
      acc[toAriaKey(attr)] = attr;
      return acc;
    },
    {} as Record<string, string>
  );

/**
 * All valid ARIA attribute names as constants.
 * Use: AriaProps.Pressed → 'aria-pressed'
 *
 * @example
 * ```tsx
 * import { AriaProps } from '@necto/dom';
 *
 * const props = {
 *   [AriaProps.Pressed]: isSelected,
 *   [AriaProps.Disabled]: isDisabled
 * };
 * ```
 */
export const AriaProps: Record<string, string> = createAriaPropsMap();

/**
 * Array of all ARIA attribute values.
 * Useful for filterDOMProps or validation.
 *
 * @example
 * ```ts
 * filterDOMProps(props, {
 *   extraAllowedProps: new Set([...ALLOWED_EXTERNAL_PROPS, ...ALL_ARIA_PROPS])
 * });
 * ```
 */
export const ALL_ARIA_PROPS: readonly string[] = DOM.ARIA_ATTRIBUTES;

/**
 * Set of all ARIA attribute values for O(1) lookup.
 */
export const ARIA_PROPS_SET: Set<string> = new Set(ALL_ARIA_PROPS);

/**
 * Checks if a string is a valid ARIA attribute.
 * @param prop - The property name to check.
 * @returns True if the property is a valid ARIA attribute.
 *
 * @example
 * ```ts
 * isAriaAttribute('aria-pressed'); // true
 * isAriaAttribute('aria-invalid'); // true
 * isAriaAttribute('data-foo');     // false
 * isAriaAttribute('onClick');      // false
 * ```
 */
export const isAriaAttribute = (prop: string): boolean =>
  ARIA_PROPS_SET.has(prop);

/**
 * Checks if a string starts with 'aria-' prefix.
 * This is a quick check that doesn't validate against the full list.
 * @param prop - The property name to check.
 * @returns True if the property starts with 'aria-'.
 */
export const hasAriaPrefix = (prop: string): boolean =>
  prop.startsWith('aria-');

export type { AriaAttribute } from './types';
