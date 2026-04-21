/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Returns the ownerDocument of an element, or the global document */
export function getOwnerDocument(el: Element | null | undefined): Document {
  if (el?.ownerDocument) {
    return el.ownerDocument;
  }

  if (typeof document !== 'undefined') {
    return document;
  }

  return null as unknown as Document;
}

/** Returns the window object that owns an element */
export function getOwnerWindow(
  el: (Window & typeof global) | Element | null | undefined
): Window & typeof global {
  if (el && 'window' in el && el.window === el) {
    return el;
  }

  const ownerDocument: Document = getOwnerDocument(
    el as Element | null | undefined
  );
  if (ownerDocument?.defaultView) {
    return ownerDocument.defaultView;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  return null as unknown as Window & typeof global;
}
