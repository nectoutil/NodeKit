/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Modality, Handler } from './useFocusVisibleListener.types';

/**
 * Global state Map that tracks event listeners across all hook instances.
 * Maps Window objects to their focus event handlers.
 */
export const globalListeners = new Map<Window, { focus: () => void }>();

/**
 * Set of all registered change handlers that need to be notified when focus state changes.
 */
export const changeHandlers = new Set<Handler>();

// Shared state for focus tracking
let hasEventBeforeFocus: boolean = false;
let currentModality: Modality | null = null;
let hasBlurredWindowRecently: boolean = false;

/**
 * Encapsulated state for focus tracking with controlled access.
 */
export const focusState = {
  /** Whether there was a user event before focus. */
  get hasEventBeforeFocus(): boolean {
    return hasEventBeforeFocus;
  },
  set hasEventBeforeFocus(value: boolean) {
    hasEventBeforeFocus = value;
  },

  /** Whether the window has been blurred recently. */
  get hasBlurredWindowRecently(): boolean {
    return hasBlurredWindowRecently;
  },
  set hasBlurredWindowRecently(value: boolean) {
    hasBlurredWindowRecently = value;
  },

  /** The current interaction modality (keyboard, pointer, or virtual). */
  get currentModality(): Modality | null {
    return currentModality;
  },
  set currentModality(value: Modality | null) {
    currentModality = value;
  }
};

/**
 * Returns the current interaction modality.
 *
 * @returns {Modality | null} The current interaction modality (keyboard, pointer, or virtual) or null if unknown.
 */
export function getInteractionModality(): Modality | null {
  return currentModality;
}
