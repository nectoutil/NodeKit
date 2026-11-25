/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { CookieAttributes } from './attributes';

export interface SetCookie extends CookieAttributes {
  name: string;
  value: string;
}

export interface ParseSetCookieOptions {
  /** Cookie decoder, it defaults to a safe decodeURIComponent. */
  decode?: (value: string) => string;
}
