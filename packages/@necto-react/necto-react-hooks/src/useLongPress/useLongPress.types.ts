/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { PressEvent } from '@necto/types';
import type { RefObject, PointerEvent, MouseEvent } from 'react';

/**
 * Event passed to long press callbacks.
 */
export interface LongPressEvent {
  /** The type of event. */
  type: 'longpressstart' | 'longpressend' | 'longpress';

  /** The pointer type that triggered the event. */
  pointerType: PressEvent['pointerType'];

  /** The target element. */
  target: EventTarget;
}

/**
 * Options for the useLongPress hook.
 */
export interface UseLongPressOptions {
  /** Whether long press events are disabled. */
  isDisabled?: boolean;

  /** Ref to the target element. */
  ref?: RefObject<HTMLElement | null>;

  /** Handler called when a long press interaction starts. */
  onLongPressStart?: (e: LongPressEvent) => void;

  /** Handler called when a long press interaction ends. */
  onLongPressEnd?: (e: LongPressEvent) => void;

  /** Handler called when the long press threshold is reached. */
  onLongPress?: (e: LongPressEvent) => void;

  /**
   * The duration in milliseconds before a press is considered a long press.
   * @default 500
   */
  threshold?: number;

  /**
   * A description for assistive technology users indicating that a long press
   * action is available, e.g. "Long press to open menu".
   */
  accessibilityDescription?: string;
}

/**
 * Return value from the useLongPress hook.
 */
export interface UseLongPressReturn {
  /** Props to spread on the target element for long press behavior. */
  longPressProps: {
    onPointerDown?: (e: PointerEvent) => void;
    onPointerUp?: (e: PointerEvent) => void;
    onPointerCancel?: (e: PointerEvent) => void;
    onContextMenu?: (e: MouseEvent) => void;
    'aria-description'?: string;
  };
}
