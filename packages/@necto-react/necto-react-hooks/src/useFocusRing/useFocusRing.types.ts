/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { DOMAttributes } from '@necto-react/types';

/**
 * Props for the useFocusRing hook.
 */
export interface UseFocusRingProps {
  /** Whether to track focus visibility within a subtree instead of just the element. */
  within?: boolean;

  /** Whether the target element is a text input. */
  isTextInput?: boolean;

  /** Whether the element should automatically receive focus when mounted. */
  autoFocus?: boolean;
}

/**
 * Return value for the useFocusRing hook.
 */
export interface UseFocusRingReturn {
  /** Whether the element is currently focused. */
  isFocused: boolean;

  /** Whether the focus is visible (e.g., due to keyboard navigation). */
  isFocusVisible: boolean;

  /** Props to spread onto the target element to enable focus ring behavior. */
  focusProps: DOMAttributes;
}

// Represents the type of user interaction modality that triggered focus.
export type Modality = 'keyboard' | 'pointer' | 'virtual';
