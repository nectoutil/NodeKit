/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ElementProps } from '../types';

export interface UseFloatingFocusOptions {
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
   * Whether to only show on keyboard focus.
   * @default true
   */
  visibleOnly?: boolean;
}

export interface UseFloatingFocusReturn {
  reference: ElementProps;
  floating: ElementProps;
}
