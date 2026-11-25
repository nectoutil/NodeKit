/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { CookieAttributes } from './attributes';

export type CookieListener = (value: string | undefined) => void;

export type CookieDeleteAttributes = Omit<CookieAttributes, 'expires' | 'maxAge'>;

export interface CookieClientOptions {
  /** Attributes merged into every set and delete. */
  attributes?: CookieAttributes;

  /** Cookie encoder, it defaults to encodeURIComponent. */
  encode?: (value: string) => string;

  /** Cookie decoder, it defaults to a safe decodeURIComponent. */
  decode?: (value: string) => string;
}
