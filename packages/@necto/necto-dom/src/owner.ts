/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Returns the ownerDocument of an element, or the global document */
export function getOwnerDocument(el: Element | null | undefined): Document {
  return el?.ownerDocument ?? document;
}

/** Returns the window object that owns an element */
export function getOwnerWindow(
  el: (Window & typeof global) | Element | null | undefined
): Window & typeof global {
  if (el && 'window' in el && el.window === el) {
    return el;
  }

  return (
    getOwnerDocument(el as Element | null | undefined).defaultView || window
  );
}
