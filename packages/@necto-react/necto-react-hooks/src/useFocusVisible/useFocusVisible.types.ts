/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Props for the useFocusVisible hook.
 */
export interface UseFocusVisibleProps {
  /** Whether the target element is a text input. */
  isTextInput?: boolean;

  /** Whether the element should automatically receive focus when mounted. */
  autoFocus?: boolean;
}

/**
 * Return value for the useFocusVisible hook.
 */
export interface UseFocusVisibleReturn {
  /** Whether focus is currently visible (e.g., due to keyboard navigation). */
  isFocusVisible: boolean;
}
