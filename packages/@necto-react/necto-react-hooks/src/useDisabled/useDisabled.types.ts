/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Flags indicating disabled states for different interaction types.
 */
export type DisabledFlags = {
  /** Whether the element is generally disabled. */
  general?: boolean;

  /** Whether the element is disabled for form interactions. */
  form?: boolean;

  /** Whether the element is disabled for user interactions (e.g., pointer, keyboard). */
  interactions?: boolean;

  /** Custom disabled flags for additional types of interactions. */
  [key: string]: boolean | undefined;
};

/**
 * Props for the useDisabled hook.
 */
export interface UseDisabledProps {
  /** The key of the disabled flag to check. Defaults to 'general'. */
  type?: keyof DisabledFlags;

  /** The fallback value if the flag is not set. Defaults to false. */
  defaultFallback?: boolean;
}

/**
 * Return type for the useDisabled hook.
 */
export type UseDisabledPropsReturn = boolean;
