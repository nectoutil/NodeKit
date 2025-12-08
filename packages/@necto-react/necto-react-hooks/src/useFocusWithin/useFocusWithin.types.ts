/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { DOMAttributes } from '@necto-react/types';
import type { FocusEvent as ReactFocusEvent } from 'react';

/**
 * Options for the useFocusWithin hook.
 */
export interface UseFocusWithinOptions {
  /** Whether the focus events should be disabled. */
  isDisabled?: boolean;

  /** Handler that is called when focus enters the element or its descendants. */
  onFocusWithin?: (e: ReactFocusEvent) => void;

  /** Handler that is called when focus leaves the element or its descendants. */
  onBlurWithin?: (e: ReactFocusEvent) => void;

  /** Handler that is called when the focus state within the element changes. */
  onFocusWithinChange?: (isFocusWithin: boolean) => void;
}

/**
 * The result returned by the useFocusWithin hook.
 */
export interface FocusWithinReturn {
  /** Props to spread onto the target element to enable focus within tracking. */
  focusWithinProps: DOMAttributes;
}
