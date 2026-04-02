/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type TransitionStatus = 'unmounted' | 'initial' | 'open' | 'close';

export interface UseTransitionStatusOptions {
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
