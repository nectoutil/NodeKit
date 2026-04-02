/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getOwnerDocument } from '../owner';

import type {
  CreateStyleElementOptions,
  InjectStyleOptions,
  StyleMap
} from './types';

const STYLE_ATTRIBUTE = 'necto-style-id';
const DEFAULT_ID = 'necto-style';

const windowStylesMap = new WeakMap<Window, StyleMap>();

function getStyleMap(targetWindow: Window): StyleMap {
  let map = windowStylesMap.get(targetWindow);
  if (!map) {
    map = new Map();
    windowStylesMap.set(targetWindow, map);
  }
  return map;
}

function createStyleElement(
  css: string,
  options: CreateStyleElementOptions = {}
): HTMLStyleElement {
  const { id = DEFAULT_ID, elementId, insertionPoint } = options;
  const doc = insertionPoint
    ? getOwnerDocument(insertionPoint)
    : typeof document !== 'undefined'
      ? document
      : null;
  if (!doc) return null as unknown as HTMLStyleElement;

  const style = doc.createElement('style');
  style.setAttribute('type', 'text/css');
  style.setAttribute(STYLE_ATTRIBUTE, id);

  if (elementId) {
    style.id = elementId;
  }

  style.textContent = css;

  if (insertionPoint) {
    doc.head.insertBefore(style, insertionPoint);
  } else {
    doc.head.appendChild(style);
  }

  return style;
}

export function injectStyle(
  css: string,
  options: InjectStyleOptions = {}
): () => void {
  const {
    id = DEFAULT_ID,
    elementId,
    window: targetWindow = typeof window !== 'undefined' ? window : null,
    insertionPoint
  } = options;

  if (!targetWindow || !css) return () => {};

  const styleMap = getStyleMap(targetWindow);
  const key = `${id}:${css}`;
  let entry = styleMap.get(key);

  if (!entry) {
    entry = {
      element: createStyleElement(css, { id, elementId, insertionPoint }),
      count: 1
    };
    styleMap.set(key, entry);
  } else if (entry.element) {
    entry.element.textContent = css;
    entry.count++;
  }

  return () => {
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
