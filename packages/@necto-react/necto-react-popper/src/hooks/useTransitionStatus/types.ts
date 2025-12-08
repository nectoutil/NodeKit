/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { CSSProperties } from 'react';

export type TransitionStatus = 'unmounted' | 'initial' | 'open' | 'close';

export interface UseTransitionStatusProps {
  /**
   * Whether the floating element is open.
   */
  open: boolean;

  /**
   * Duration of the transition in ms.
   * @default 250
   */
  duration?: number | { open?: number; close?: number };
}

export interface UseTransitionStatusReturn {
  /**
   * Whether the element should be mounted.
   */
  isMounted: boolean;

  /**
   * The current transition status.
   */
  status: TransitionStatus;
}

export interface UseTransitionStylesProps extends UseTransitionStatusProps {
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
