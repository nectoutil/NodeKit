/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { CSSProperties } from 'react';
import type {
  UseTransitionStatusOptions,
  UseTransitionStatusReturn
} from '../useTransitionStatus';

export interface UseTransitionStylesOptions extends UseTransitionStatusOptions {
  /**
   * Initial styles when opening.
   */
  initial?: CSSProperties;

  /**
   * Styles when open.
   */
  openStyles?: CSSProperties;

  /**
   * Styles when closing.
   */
  closeStyles?: CSSProperties;

  /**
   * Common styles applied to all states.
   */
  common?: CSSProperties;
}

export interface UseTransitionStylesReturn extends UseTransitionStatusReturn {
  /**
   * Styles to apply based on current status.
   */
  styles: CSSProperties;
}
