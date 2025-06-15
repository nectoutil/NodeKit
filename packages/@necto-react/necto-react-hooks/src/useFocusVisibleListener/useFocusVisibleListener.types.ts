// biome-ignore-all lint/suspicious/noExplicitAny: Explicit any okay for this type definitions.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Represents the type of user interaction modality that triggered focus.
 *
 * - 'keyboard': Focus was triggered via keyboard input (e.g., Tab key).
 * - 'pointer': Focus was triggered via pointer input (e.g., mouse, touch).
 * - 'virtual': Focus was triggered programmatically or by assistive technology.
 */
export type Modality = 'keyboard' | 'pointer' | 'virtual';

/**
 * Union type of possible events that can trigger focus handling.
 */
export type HandlerEvent =
  | PointerEvent
  | MouseEvent
  | KeyboardEvent
  | FocusEvent
  | null;

/**
 * Function signature for focus modality change handlers.
 *
 * @param {Modality} modality - The current interaction modality.
 * @param {HandlerEvent} e - The event that triggered the modality change.
 */
export type Handler = (modality: Modality, e: HandlerEvent) => void;

/**
 * Props for the useFocusVisibleListener hook.
 */
export interface UseFocusVisibleListenerProps {
  /** Function called when focus visibility changes. */
  fn: (isFocusVisible: boolean) => void;

  /** Dependency array that determines when to rebind the listener. */
  deps: ReadonlyArray<any>;

  /** Additional options for focus visibility tracking. */
  opts?: { isTextInput?: boolean };
}