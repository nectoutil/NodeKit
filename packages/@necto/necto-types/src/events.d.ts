/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * The type of pointer device that triggered the event.
 */
export type PointerType = 'mouse' | 'touch' | 'keyboard' | 'pen' | 'virtual';

/**
 * Standardized event for press-like interactions.
 */
export interface PressEvent {
  /** The type of press event (e.g., "pressstart", "pressend"). */
  type: string;

  /** The pointer device type that triggered the event. */
  pointerType: PointerType;

  /** The target element of the event. */
  target: EventTarget;

  /** Whether the shift key was held during the event. */
  shiftKey: boolean;

  /** Whether the control key was held during the event. */
  ctrlKey: boolean;

  /** Whether the meta key was held during the event. */
  metaKey: boolean;

  /** Whether the alt key was held during the event. */
  altKey: boolean;
}
