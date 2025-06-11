/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { FocusEvent as ReactFocusEvent } from 'react';

/**
 * Event handlers for hover interactions.
 */
export interface HoverEvent {
  /** Called when a hover interaction starts. */
  onHoverStart?: (event: HoverEvent) => void;

  /** Called when a hover interaction ends. */
  onHoverEnd?: (event: HoverEvent) => void;

  /** Called when the hover state changes. */
  onHoverChange?: (isHovering: boolean) => void;
}

/**
 * Event handlers for focus interactions.
 */
export interface FocusEvent<Target = Element> {
  /** Called when the element receives focus. */
  onFocus?: (e: ReactFocusEvent<Target>) => void;

  /** Called when the element loses focus. */
  onBlur?: (e: ReactFocusEvent<Target>) => void;

  /** Called when the focus state changes. */
  onFocusChange?: (isFocused: boolean) => void;
}

/**
 * Event handlers for keyboard interactions.
 */
export interface KeyboardEvents {
  /** Called when a key is pressed down. */
  onKeyDown?: (e: KeyboardEvent) => void;

  /** Called when a key is released. */
  onKeyUp?: (e: KeyboardEvent) => void;
}
