/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Portions adapted from Node.js (lib/path.js) and unjs/pathe, both MIT licensed.
 */

import { BACKSLASH_RE, PathPlatforms } from './constants';

import type { PathOptions, PathPlatform } from './types';

export function basename(path: string, suffix?: string, options?: PathOptions): string {
  if (typeof path !== 'string') {
    throw new TypeError(
      __DEV__
        ? `[necto.path] NT0401: "path" must be a string, received ${typeof path}`
        : '[necto.path] NT0401: https://necto.dev/errors/NT0401'
    );
  }

  if (suffix !== undefined && typeof suffix !== 'string') {
    throw new TypeError(
      __DEV__
        ? `[necto.path] NT0402: "suffix" must be a string, received ${typeof suffix}`
        : '[necto.path] NT0402: https://necto.dev/errors/NT0402'
    );
  }

  const platform: PathPlatform = options?.platform ?? PathPlatforms.Windows;
  const isPosix: boolean = platform === PathPlatforms.Posix;

  const input: string = isPosix ? path : path.replace(BACKSLASH_RE, '/');
  const segments: string[] = input.split('/');

  let base: string = '';
  for (let i: number = segments.length - 1; i >= 0; i--) {
    if (segments[i]) {
      base = segments[i];
      break;
    }
  }

  if (base === '') {
    const suffixApplies: boolean =
      suffix !== undefined &&
      suffix.length > 0 &&
      suffix.length <= input.length &&
      suffix !== input;

    return suffixApplies ? input : '';
  }

  if (suffix && base !== suffix && base.endsWith(suffix)) {
    return base.slice(0, -suffix.length);
  }

  return base;
}
