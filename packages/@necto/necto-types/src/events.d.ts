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
 * DOM event names for tracking pointer-down/up, touch-start/end, and focus
 * transitions. The set hooks like `useOnClickOutside`, `useDismiss`, focus
 * traps, and press-tracking utilities consume.
 *
 * Each option models a different point in the interaction lifecycle:
 * - `'mousedown'` / `'touchstart'` fire BEFORE click is finalized — fastest
 *   to react, but consumer can't drag out to cancel.
 * - `'mouseup'` / `'touchend'` fire AFTER release — gives the user a chance
 *   to cancel by dragging away before lifting.
 * - `'focusin'` / `'focusout'` track focus changes (keyboard navigation,
 *   click-to-focus). Pair with pointer events for full coverage.
 */
export type InteractionEventName =
  | 'mousedown'
  | 'mouseup'
  | 'touchstart'
  | 'touchend'
  | 'focusin'
  | 'focusout';

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
