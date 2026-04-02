/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export interface CreateStyleElementOptions {
  /** User-facing HTML `id` attribute on the `<style>` element. */
  id?: string;

  /** Internal tracking ID. Auto-generated if not provided. */
  internalId?: string;

  insertionPoint?: HTMLElement | null;
}

export interface StyleEntry {
  element: HTMLStyleElement | null;
  count: number;
}

export type StyleMap = Map<string, StyleEntry>;

export interface InjectStyleOptions {
  /** User-facing HTML `id` attribute on the `<style>` element. */
  id?: string;

  window?: Window | null;
  insertionPoint?: HTMLElement | null;
}
