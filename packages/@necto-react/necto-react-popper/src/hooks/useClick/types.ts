/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ElementProps } from '../types';

export interface UseClickProps {
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
   * Whether to toggle on click or only open.
   * @default true
   */
  toggle?: boolean;

  /**
   * The event type that triggers the click.
   * @default 'click'
   */
  event?: 'click' | 'mousedown';

  /**
   * Whether to ignore mouse events after touch events.
   * @default true
   */
  ignoreMouse?: boolean;

  /**
   * The keyboard keys that trigger the click.
   * @default ['Enter', ' ']
   */
  keyboardHandlers?: boolean;
}

export interface UseClickReturn {
  reference: ElementProps;
  floating: ElementProps;
}
