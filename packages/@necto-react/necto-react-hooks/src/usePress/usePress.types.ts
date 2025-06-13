/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { RefObject } from 'react';
import type { PressEvent } from '@necto/types';

/**
 * Text selection state
 */
export type TextSelectionStates = 'default' | 'disabled' | 'restoring';

/**
 * Props for the usePress hook.
 */
export interface UsePressProps {
  /** Whether the press interaction is disabled. */
  isDisabled?: boolean;

  /** Prevents the element from receiving focus when pressed. */
  preventFocusOnPress?: boolean;

  /** Allows text selection during press interactions. */
  allowTextSelectionOnPress?: boolean;

  /** Ref to the target DOM element. */
  ref?: RefObject<HTMLElement>;

  /** Handler called when a press interaction is successfully completed. */
  onPress?: (e: PressEvent) => void;

  /** Handler called when a press interaction starts (e.g., mouse down, touch start, key down). */
  onPressStart?: (e: PressEvent) => void;

  /** Handler called when a press interaction ends (e.g., mouse up, touch end, key up). */
  onPressEnd?: (e: PressEvent) => void;

  /** Handler called when the pressed state changes. */
  onPressChange?: (isPressed: boolean) => void;

  /** Handler called when a press is released over the target. */
  onPressUp?: (e: PressEvent) => void;

  /** Handler called on click events for compatibility. */
  onClick?: (e: MouseEvent) => void;
}

/**
 * Return type for the usePress hook.
 */
export interface UsePressReturn {
  /** Props to spread onto the target element to enable press interactions. */
  pressProps: {
    onMouseDown?: (e: MouseEvent) => void;
    onMouseUp?: (e: MouseEvent) => void;
    onMouseLeave?: (e: MouseEvent) => void;
    onMouseEnter?: (e: MouseEvent) => void;
    onTouchStart?: (e: TouchEvent) => void;
    onTouchEnd?: (e: TouchEvent) => void;
    onKeyDown?: (e: KeyboardEvent) => void;
    onKeyUp?: (e: KeyboardEvent) => void;
    onClick?: (e: MouseEvent) => void;
  };

  /** Whether the element is currently pressed. */
  isPressed: boolean;
}
