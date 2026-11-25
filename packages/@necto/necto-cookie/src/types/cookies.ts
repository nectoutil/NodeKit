/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  CookiePriority as CookiePriorityMap,
  CookieSameSite as CookieSameSiteMap
} from '../constants';

export type Cookies = Record<string, string | undefined>;

export type CookieSameSite = (typeof CookieSameSiteMap)[keyof typeof CookieSameSiteMap];

export type CookiePriority = (typeof CookiePriorityMap)[keyof typeof CookiePriorityMap];
