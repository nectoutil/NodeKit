/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Portions adapted from Node.js (lib/path.js) and unjs/pathe, both MIT licensed.
 */

import {
  BACKSLASH_RE,
  PathPlatforms,
  IS_ABSOLUTE_RE,
  DRIVE_LETTER_RE,
  TRAILING_SLASH_RE
} from './constants';

import type { PathOptions } from './types';

export function dirname(path: string, options?: PathOptions): string {
  if (typeof path !== 'string') {
    throw new TypeError(
      __DEV__
        ? `[necto.path] NT0403: "path" must be a string, received ${typeof path}`
        : '[necto.path] NT0403: https://necto.dev/errors/NT0403'
    );
  }

  const platform = options?.platform ?? PathPlatforms.Windows;
  const isPosix: boolean = platform === PathPlatforms.Posix;
  const input: string = isPosix ? path : path.replace(BACKSLASH_RE, '/');
  const segments: string[] = input.replace(TRAILING_SLASH_RE, '').split('/').slice(0, -1);

  if (!isPosix && segments.length === 1 && DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += '/';
  }

  const joined: string = segments.join('/');
  if (joined) {
    return isPosix && joined === '/' ? '//' : joined;
  }

  const absolute: boolean = isPosix ? input.startsWith('/') : IS_ABSOLUTE_RE.test(input);

  return absolute ? '/' : '.';
}
