/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type HTMLElementsMap = Record<string, keyof HTMLElementTagNameMap>;

export type HTMLElementsKeys = keyof HTMLElementsMap;

export type HTMLElementType<Tag extends keyof HTMLElementTagNameMap> = HTMLElementTagNameMap[Tag];