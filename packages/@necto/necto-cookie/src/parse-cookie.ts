/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { safeDecode, sliceTrimmed, sliceUnquoted } from './utils';

import type { Cookies, ParseCookieOptions } from './types';

export function parseCookie(
  header: string | null | undefined,
  options: ParseCookieOptions = {}
): Cookies {
  const { decode = safeDecode } = options;

  const result: Cookies = Object.create(null);

  if (!header) {
    return result;
  }

  const length: number = header.length;

  if (length < 2) {
    return result;
  }

  let index: number = 0;

  do {
    const eqIndex: number = header.indexOf('=', index);

    if (eqIndex === -1) {
      break;
    }

    const semiIndex: number = header.indexOf(';', index);
    const endIndex: number = semiIndex === -1 ? length : semiIndex;

    if (eqIndex > endIndex) {
      index = header.lastIndexOf(';', eqIndex - 1) + 1;
      continue;
    }

    const name: string = sliceTrimmed(header, index, eqIndex);

    if (name !== '' && !(name in result)) {
      result[name] = decode(sliceUnquoted(header, eqIndex + 1, endIndex));
    }

    index = endIndex + 1;
  } while (index < length);

  return result;
}
