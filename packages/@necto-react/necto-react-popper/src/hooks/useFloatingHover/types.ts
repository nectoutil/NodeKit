/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ElementProps } from '../types';

export interface UseFloatingHoverProps {
  /**
   * Whether the floating element is open.
   */
  open: boolean;

  /**
   * Callback to set the open state.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Whether the hook is enabled.
   * @default true
   */
  enabled?: boolean;

  /**
   * Delay in ms before showing.
   * @default 0
   */
  delay?: number | { open?: number; close?: number };

  /**
   * Whether hovering the floating element keeps it open.
   * @default true
   */
  handleClose?: boolean;

  /**
   * Whether to ignore mouse events.
   * @default false
   */
  mouseOnly?: boolean;

  /**
   * Delay before closing when leaving.
   * @default 0
   */
  restMs?: number;
}

export interface UseFloatingHoverReturn {
  reference: ElementProps;
  floating: ElementProps;
}
