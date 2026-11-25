/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { safeDecode, sliceTrimmed, sliceUnquoted } from './utils';
import { MAX_AGE_REGEX, PRIORITY_VALUES, SAME_SITE_VALUES } from './constants';

import type { CookiePriority, CookieSameSite } from './types';
import type { ParseSetCookieOptions, SetCookie } from './types/parse-set-cookie';

export function parseSetCookie(
  header: string | null | undefined,
  options: ParseSetCookieOptions = {}
): SetCookie | undefined {
  const { decode = safeDecode } = options;

  if (!header) {
    return undefined;
  }

  const length: number = header.length;

  const semiIndex: number = header.indexOf(';');
  const pairEnd: number = semiIndex === -1 ? length : semiIndex;

  const eqIndex: number = header.indexOf('=');

  if (eqIndex === -1 || eqIndex > pairEnd) {
    return undefined;
  }

  const name: string = sliceTrimmed(header, 0, eqIndex);

  if (name === '') {
    return undefined;
  }

  const cookie: SetCookie = {
    name,
    value: decode(sliceUnquoted(header, eqIndex + 1, pairEnd))
  };

  let index: number = pairEnd + 1;

  while (index < length) {
    const nextSemi: number = header.indexOf(';', index);
    const end: number = nextSemi === -1 ? length : nextSemi;

    const attrEq: number = header.indexOf('=', index);
    const hasValue: boolean = attrEq !== -1 && attrEq < end;

    const key: string = sliceTrimmed(header, index, hasValue ? attrEq : end).toLowerCase();
    const value: string = hasValue ? sliceTrimmed(header, attrEq + 1, end) : '';

    switch (key) {
      case 'expires': {
        const date: Date = new Date(value);

        if (!Number.isNaN(date.getTime())) {
          cookie.expires = date;
        }

        break;
      }

      case 'max-age': {
        if (MAX_AGE_REGEX.test(value)) {
          cookie.maxAge = Number(value);
        }

        break;
      }

      case 'domain': {
        const domain: string = (value.startsWith('.') ? value.slice(1) : value).toLowerCase();

        if (domain !== '') {
          cookie.domain = domain;
        }

        break;
      }

      case 'path': {
        if (value.startsWith('/')) {
          cookie.path = value;
        }

        break;
      }

      case 'samesite': {
        const sameSite: string = value.toLowerCase();

        if (SAME_SITE_VALUES.has(sameSite)) {
          cookie.sameSite = sameSite as CookieSameSite;
        }

        break;
      }

      case 'priority': {
        const priority: string = value.toLowerCase();

        if (PRIORITY_VALUES.has(priority)) {
          cookie.priority = priority as CookiePriority;
        }

        break;
      }

      case 'secure': {
        cookie.secure = true;
        break;
      }

      case 'httponly': {
        cookie.httpOnly = true;
        break;
      }

      case 'partitioned': {
        cookie.partitioned = true;
        break;
      }
    }

    index = end + 1;
  }

  return cookie;
}
