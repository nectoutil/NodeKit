/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export interface UseStyleInjectionProps {
  id?: string;
  css: string | string[];
  window?: Window | null;
  insertionPoint?: HTMLElement | null;
  enabled?: boolean;
}
