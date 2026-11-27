/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getOwnerDocument } from './owner';

import type { InjectStyleOptions, StyleEntry, StyleMap } from './types/style';

const STYLE_ATTRIBUTE: string = 'data-style-id';
const WINDOW_STYLES_MAP: WeakMap<Window, StyleMap> = new WeakMap();

export function injectStyle(css: string, options: InjectStyleOptions = {}): () => void {
  const {
    id,
    insertionPoint,
    window: targetWindow = typeof window !== 'undefined' ? window : null
  } = options;

  if (!targetWindow || !css) return (): void => {};

  let styleMap = WINDOW_STYLES_MAP.get(targetWindow);

  if (!styleMap) {
    styleMap = new Map();
    WINDOW_STYLES_MAP.set(targetWindow, styleMap);
  }

  const key = `${id ?? 'necto'}:${css}`;
  let entry = styleMap.get(key);

  if (!entry) {
    const doc = insertionPoint
      ? getOwnerDocument(insertionPoint)
      : typeof document !== 'undefined'
        ? document
        : null;

    if (!doc) return (): void => {};

    const style = doc.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute(STYLE_ATTRIBUTE, `necto-<:${Math.random().toString(36).slice(2, 9)}:>`);

    if (id) style.id = id;

    style.textContent = css;

    if (insertionPoint) {
      doc.head.insertBefore(style, insertionPoint);
    } else {
      doc.head.appendChild(style);
    }

    entry = { element: style, count: 1 };
    styleMap.set(key, entry);
  } else if (entry.element) {
    entry.element.textContent = css;
    entry.count++;
  }

  return (): void => {
    const currentEntry = styleMap.get(key);

    if (currentEntry?.element) {
      currentEntry.count--;

      if (currentEntry.count < 1) {
        currentEntry.element.remove();
        currentEntry.element = null;
        styleMap.delete(key);
      }
    }
  };
}
