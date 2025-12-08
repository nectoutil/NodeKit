/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { AriaAttributes } from 'react';

/**
 * Options for the useAriaProps hook.
 */
export interface UseAriaPropsOptions {
  /** Whether the element is invalid. */
  isInvalid?: boolean;

  /** Whether the element is disabled. */
  isDisabled?: boolean;

  /** Whether the element is read-only. */
  isReadOnly?: boolean;

  /** Whether the element is required. */
  isRequired?: boolean;

  /** Whether the element is busy. */
  isBusy?: boolean;

  /** Whether the element is pressed. */
  isPressed?: boolean | 'mixed';

  /** Whether the element is expanded. */
  isExpanded?: boolean;

  /** Whether the element is selected. */
  isSelected?: boolean;

  /** Whether the element is checked. */
  isChecked?: boolean | 'mixed';

  /** Whether the element is hidden. */
  isHidden?: boolean;

  /** Whether the element has a popup. */
  hasPopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

  /** The current value (for range widgets). */
  valueCurrent?: number;

  /** The minimum value (for range widgets). */
  valueMin?: number;

  /** The maximum value (for range widgets). */
  valueMax?: number;

  /** The current value as text (for range widgets). */
  valueText?: string;
}

/**
 * Return type for the useAriaProps hook.
 */
export type UseAriaPropsReturn = AriaAttributes;
