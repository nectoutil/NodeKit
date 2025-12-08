/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { KeyboardEvents, DOMAttributes } from '@necto-react/types';

/**
 * Options for the useKeyboard hook.
 */
export interface UseKeyboardOptions extends KeyboardEvents {
  /**
   * Whether the keyboard interaction is disabled.
   * Defaults to false.
   */
  isDisabled?: boolean;
}

/**
 * Return value of the useKeyboard hook.
 */
export interface UseKeyboardReturn {
  /**
   * Props to be spread onto the target element to enable keyboard interactions.
   */
  keyboardProps: DOMAttributes;
}
