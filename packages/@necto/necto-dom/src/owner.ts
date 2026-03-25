/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Returns the ownerDocument of an element, or the global document. Returns undefined during SSR. */
export function getOwnerDocument(el: Element | null | undefined): Document | undefined {
  if (el?.ownerDocument) return el.ownerDocument;
  if (typeof document !== 'undefined') return document;
  return undefined;
}

/** Returns the window object that owns an element. Returns undefined during SSR. */
export function getOwnerWindow(
  el: (Window & typeof global) | Element | null | undefined
): (Window & typeof global) | undefined {
  if (el && 'window' in el && el.window === el) {
    return el;
  }

  const doc: Document | undefined = getOwnerDocument(el as Element | null | undefined);
  if (doc?.defaultView) return doc.defaultView;
  if (typeof window !== 'undefined') return window;
  return undefined;
}
