/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { FocusEvent } from 'react';

/**
 * Props for the useSyntheticBlurEvent hook.
 */
export interface UseSyntheticBlurEventProps<T extends Element = Element> {
  /**
   * Handler called when the blur event is triggered on the target element.
   * Receives a React FocusEvent for the target element.
   */
  onBlur: (event: FocusEvent<T>) => void;
}

/**
 * Return type for the useSyntheticBlurEvent hook.
 */
export type UseSyntheticBlurEventReturn<T> = (event: FocusEvent<T>) => void;