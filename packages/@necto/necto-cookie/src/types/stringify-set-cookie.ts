/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface StringifySetCookieOptions {
  /** Cookie encoder, it defaults to encodeURIComponent. */
  encode?: (value: string) => string;
}
