/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { CookiePriority, CookieSameSite } from './cookies';

export interface CookieAttributes {
  path?: string;

  domain?: string;

  expires?: Date;

  maxAge?: number;

  httpOnly?: boolean;

  secure?: boolean;

  sameSite?: CookieSameSite | boolean;

  partitioned?: boolean;

  /** Eviction priority hint (Chromium). */
  priority?: CookiePriority;
}
