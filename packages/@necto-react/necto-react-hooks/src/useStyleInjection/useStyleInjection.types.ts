/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Options for the useStyleInjection hook.
 */
export interface UseStyleInjectionOptions {
  /** Internal necto tracking ID. Used as the `necto-style-id` attribute. */
  id?: string;

  /** User-facing HTML `id` attribute on the `<style>` element. */
  elementId?: string;

  css: string | string[];
  window?: Window | null;
  insertionPoint?: HTMLElement | null;
  enabled?: boolean;
}
