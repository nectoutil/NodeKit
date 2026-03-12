/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DOM } from '@necto/constants';

import type { HTMLElementsMap } from '@necto/types';

/**
 * Capitalizes the first letter of a string.
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
const capitalizeFirstLetter = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Creates a mapping of capitalized HTML tag names to their original tag names.
 * @returns A record where keys are capitalized tag names and values are original tag names.
 */
const createHTMLElementsMap = (): HTMLElementsMap =>
  DOM.HTML_TAGS.reduce((acc, tag) => {
    acc[capitalizeFirstLetter(tag)] = tag as keyof HTMLElementTagNameMap;
    return acc;
  }, {} as HTMLElementsMap);

let _htmlElements: HTMLElementsMap | undefined;

/**
 * Lazily-initialized mapping of capitalized HTML tag names to their original tag names.
 * Deferred to avoid module initialization order issues when bundlers split
 * `@necto/constants` and `@necto/dom` into separate chunks.
 */
const HTMLElements: HTMLElementsMap = new Proxy({} as HTMLElementsMap, {
  get(_target, prop, receiver) {
    if (!_htmlElements) _htmlElements = createHTMLElementsMap();
    return Reflect.get(_htmlElements, prop, receiver);
  },
  ownKeys() {
    if (!_htmlElements) _htmlElements = createHTMLElementsMap();
    return Reflect.ownKeys(_htmlElements);
  },
  getOwnPropertyDescriptor(_target, prop) {
    if (!_htmlElements) _htmlElements = createHTMLElementsMap();
    return Object.getOwnPropertyDescriptor(_htmlElements, prop);
  },
});

export { HTMLElements };
