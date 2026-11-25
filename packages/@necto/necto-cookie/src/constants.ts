/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const CookieSameSite = {
  Lax: 'lax',
  None: 'none',
  Strict: 'strict'
} as const;

export const CookiePriority = {
  Low: 'low',
  High: 'high',
  Medium: 'medium'
} as const;

export const MAX_AGE_REGEX: RegExp = new RegExp(/^-?\d+$/);

export const SAME_SITE_VALUES: ReadonlySet<string> = new Set<string>(Object.values(CookieSameSite));

export const PRIORITY_VALUES: ReadonlySet<string> = new Set<string>(Object.values(CookiePriority));

export const MAX_COOKIE_SIZE: number = 4096;

export const COOKIE_NAME_REGEX: RegExp = new RegExp(/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/);

export const COOKIE_VALUE_REGEX: RegExp = new RegExp(
  /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]*$/
);

export const COOKIE_PATH_REGEX: RegExp = new RegExp(/^[\x20-\x3A\x3C-\x7E]*$/);

export const COOKIE_DOMAIN_REGEX: RegExp = new RegExp(
  /^\.?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i
);

export const SECURE_PREFIX: string = '__Secure-';

export const HOST_PREFIX: string = '__Host-';

export const BROADCAST_CHANNEL_NAME: string = 'necto-cookie';
