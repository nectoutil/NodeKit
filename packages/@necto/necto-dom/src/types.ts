/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Text selection state
 */
export type TextSelectionStates = 'default' | 'disabled' | 'restoring';

/**
 * Represents an element with scroll position information.
 */
export interface ScrollableElement {
  /** The HTML element that is scrollable. */
  element: HTMLElement;

  /** The vertical scroll position of the element. */
  scrollTop: number;

  /** The horizontal scroll position of the element. */
  scrollLeft: number;
}
