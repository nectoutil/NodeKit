/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Maps string keys to valid HTMLElement tag names.
 */
export type HTMLElementsMap = Record<string, keyof HTMLElementTagNameMap>;

/**
 * Keys of the HTMLElementsMap.
 */
export type HTMLElementsKeys = keyof HTMLElementsMap;

/**
 * Type for a specific HTMLElement given its tag name.
 * @template Tag - The tag name of the HTMLElement.
 */
export type HTMLElementType<Tag extends keyof HTMLElementTagNameMap> =
  HTMLElementTagNameMap[Tag];
