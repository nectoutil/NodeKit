/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { capitalize } from '@necto/strings';

import {
  HOST_PREFIX,
  SECURE_PREFIX,
  MAX_COOKIE_SIZE,
  COOKIE_NAME_REGEX,
  COOKIE_PATH_REGEX,
  COOKIE_VALUE_REGEX,
  COOKIE_DOMAIN_REGEX
} from './constants';

import type { SetCookie, StringifySetCookieOptions } from './types';

export function stringifySetCookie(
  cookie: SetCookie,
  options: StringifySetCookieOptions = {}
): string {
  const { encode = encodeURIComponent } = options;

  const {
    name,
    value,
    path,
    domain,
    expires,
    maxAge,
    httpOnly,
    secure,
    sameSite,
    partitioned,
    priority
  } = cookie;

  if (!COOKIE_NAME_REGEX.test(name)) {
    throw new TypeError(`Invalid cookie name: ${name}`);
  }

  const encoded: string = encode(value);

  if (!COOKIE_VALUE_REGEX.test(encoded)) {
    throw new TypeError(`Invalid cookie value for "${name}": ${encoded}`);
  }

  if (name.length + encoded.length + 1 > MAX_COOKIE_SIZE) {
    throw new TypeError(`Cookie "${name}" exceeds ${MAX_COOKIE_SIZE} bytes`);
  }

  if (sameSite === 'none' && !secure) {
    throw new TypeError(`Cookie "${name}" with SameSite=None must be Secure`);
  }

  if (partitioned && !secure) {
    throw new TypeError(`Partitioned cookie "${name}" must be Secure`);
  }

  if (name.startsWith(SECURE_PREFIX) && !secure) {
    throw new TypeError(`Cookie "${name}" must be Secure`);
  }

  if (name.startsWith(HOST_PREFIX) && (!secure || domain !== undefined || path !== '/')) {
    throw new TypeError(`Cookie "${name}" must be Secure, have Path=/ and no Domain`);
  }

  let header: string = `${name}=${encoded}`;

  if (maxAge !== undefined) {
    if (!Number.isInteger(maxAge)) {
      throw new TypeError(`Invalid Max-Age for "${name}": ${maxAge}`);
    }

    header += `; Max-Age=${maxAge}`;
  }

  if (domain !== undefined) {
    if (!COOKIE_DOMAIN_REGEX.test(domain)) {
      throw new TypeError(`Invalid Domain for "${name}": ${domain}`);
    }

    header += `; Domain=${domain}`;
  }

  if (path !== undefined) {
    if (!COOKIE_PATH_REGEX.test(path)) {
      throw new TypeError(`Invalid Path for "${name}": ${path}`);
    }

    header += `; Path=${path}`;
  }

  if (expires !== undefined) {
    if (!(expires instanceof Date) || Number.isNaN(expires.getTime())) {
      throw new TypeError(`Invalid Expires for "${name}": ${String(expires)}`);
    }

    header += `; Expires=${expires.toUTCString()}`;
  }

  if (httpOnly) {
    header += '; HttpOnly';
  }

  if (secure) {
    header += '; Secure';
  }

  if (partitioned) {
    header += '; Partitioned';
  }

  if (priority) {
    header += `; Priority=${capitalize(priority)}`;
  }

  if (sameSite) {
    header += `; SameSite=${sameSite === true ? 'Strict' : capitalize(sameSite)}`;
  }

  return header;
}
