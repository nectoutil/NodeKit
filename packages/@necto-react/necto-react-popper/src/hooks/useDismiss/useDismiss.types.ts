/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ElementProps } from '../types';

export interface UseDismissOptions {
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
   * Whether to close on escape key.
   * @default true
   */
  escapeKey?: boolean;

  /**
   * Whether to close on outside press.
   * @default true
   */
  outsidePress?: boolean | ((event: MouseEvent) => boolean);

  /**
   * Whether to close on reference press.
   * @default false
   */
  referencePress?: boolean;

  /**
   * Whether to close when the reference element is hidden.
   * @default false
   */
  ancestorScroll?: boolean;

  /**
   * Whether to bubble the escape key event.
   * @default false
   */
  bubbles?: boolean | { escapeKey?: boolean; outsidePress?: boolean };
}

export interface UseDismissReturn {
  reference: ElementProps;
  floating: ElementProps;
}
