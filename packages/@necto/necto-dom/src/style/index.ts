/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getOwnerDocument } from '../owner';

import type { StyleEntry, InjectStyleOptions, StyleMap } from './types';

const STYLE_ATTRIBUTE: string = 'data-style-id' as const;
const WINDOW_STYLES_MAP: WeakMap<Window, StyleMap> = new WeakMap<
  Window,
  StyleMap
>();

/**
 * Injects a CSS string into the document head as a `<style>` element.
 * Deduplicates by id + css content, reference-counted, and auto-removes when all consumers unmount.
 *
 * @param css - The CSS string to inject.
 * @param options - Configuration options (id, window, insertionPoint).
 * @returns A cleanup function that decrements the reference count and removes the style when no longer needed.
 */
export function injectStyle(
  css: string,
  options: InjectStyleOptions = {}
): () => void {
  const {
    id,
    insertionPoint,
    window: targetWindow = typeof window !== 'undefined' ? window : null
  } = options;

  if (!targetWindow || !css) {
    return (): void => {};
  }

  let styleMap: StyleMap | undefined = WINDOW_STYLES_MAP.get(targetWindow);
  if (!styleMap) {
    styleMap = new Map();
    WINDOW_STYLES_MAP.set(targetWindow, styleMap);
  }

  const key = `${id ?? 'necto'}:${css}`;
  let entry: StyleEntry | undefined = styleMap.get(key);

  if (!entry) {
    const doc: Document | null = insertionPoint
      ? getOwnerDocument(insertionPoint)
      : typeof document !== 'undefined'
        ? document
        : null;

    if (!doc) {
      return (): void => {};
    }

    const internalId = `necto-<:${Math.random().toString(36).slice(2, 9)}:>`;

    const style: HTMLStyleElement = doc.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute(STYLE_ATTRIBUTE, internalId);

    if (id) {
      style.id = id;
    }

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
    const currentEntry: StyleEntry | undefined = styleMap.get(key);

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
