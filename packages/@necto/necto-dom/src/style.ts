import { getOwnerDocument } from './owner';

export interface CreateStyleElementOptions {
  id?: string;
  insertionPoint?: HTMLElement | null;
}

export interface StyleEntry {
  element: HTMLStyleElement | null;
  count: number;
}

export type StyleMap = Map<string, StyleEntry>;

const STYLE_ATTRIBUTE = 'necto-style-id';
const DEFAULT_ID = 'necto-style';

const windowStylesMap = new WeakMap<Window, StyleMap>();

export function getStyleMap(targetWindow: Window): StyleMap {
  let map = windowStylesMap.get(targetWindow);
  if (!map) {
    map = new Map();
    windowStylesMap.set(targetWindow, map);
  }
  return map;
}

export function createStyleElement(
  css: string,
  options: CreateStyleElementOptions = {}
): HTMLStyleElement {
  const { id = DEFAULT_ID, insertionPoint } = options;
  const doc = insertionPoint ? getOwnerDocument(insertionPoint) : document;

  const style = doc.createElement('style');
  style.setAttribute('type', 'text/css');
  style.setAttribute(STYLE_ATTRIBUTE, id);
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
  options: CreateStyleElementOptions & { window?: Window | null } = {}
): () => void {
  const {
    id = DEFAULT_ID,
    window: targetWindow = typeof window !== 'undefined' ? window : null,
    insertionPoint
  } = options;

  if (!targetWindow || !css) return () => {};

  const styleMap = getStyleMap(targetWindow);
  const key = `${id}:${css}`;
  let entry = styleMap.get(key);

  if (!entry) {
    entry = {
      element: createStyleElement(css, { id, insertionPoint }),
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

export function removeStyleElement(element: HTMLStyleElement): void {
  element.remove();
}
