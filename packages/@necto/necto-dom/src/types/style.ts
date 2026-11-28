/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface StyleEntry {
  element: HTMLStyleElement | null;
  count: number;
}

export type StyleMap = Map<string, StyleEntry>;

export interface InjectStyleOptions {
  id?: string;
  window?: Window | null;
  insertionPoint?: HTMLElement | null;
}
