/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { FocusEvents, DOMAttributes } from '@necto-react/types';
import type { FocusableElement } from '@necto/types';

/**
 * Props for the useFocus hook.
 */
export interface UseFocusProps<T = FocusableElement> extends FocusEvents<T> {
  /** Whether focus events are disabled. */
  isDisabled?: boolean;
}

/**
 * Return type for the useFocus hook.
 */
export interface UseFocusReturn<T = FocusableElement> {
  /** Props that can be spread onto a focusable DOM element. */
  focusProps?: DOMAttributes<T>;
}
