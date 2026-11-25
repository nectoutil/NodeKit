/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface ParseCookieOptions {
  /** Cookie decoder, it defaults to a safe decodeURIComponent. */
  decode?: (value: string) => string;
}
