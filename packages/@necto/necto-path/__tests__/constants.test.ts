/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';

import {
  BACKSLASH_RE,
  DRIVE_LETTER_RE,
  EXTNAME_RE,
  IS_ABSOLUTE_RE,
  PathPlatforms,
  TRAILING_SLASH_RE
} from '../src/constants';

describe('constants', () => {
  it('defines the path platforms', () => {
    expect(PathPlatforms).toEqual({ Posix: 'posix', Windows: 'windows' });
  });

  it('BACKSLASH_RE replaces every backslash', () => {
    expect('a\\b\\c'.replace(BACKSLASH_RE, '/')).toBe('a/b/c');
  });

  it('TRAILING_SLASH_RE strips trailing slashes', () => {
    expect('a/b///'.replace(TRAILING_SLASH_RE, '')).toBe('a/b');
  });

  it('DRIVE_LETTER_RE matches only a bare drive', () => {
    expect(DRIVE_LETTER_RE.test('C:')).toBe(true);
    expect(DRIVE_LETTER_RE.test('C:/')).toBe(false);
  });

  it('IS_ABSOLUTE_RE detects absolute paths', () => {
    expect(IS_ABSOLUTE_RE.test('/x')).toBe(true);
    expect(IS_ABSOLUTE_RE.test('C:\\x')).toBe(true);
    expect(IS_ABSOLUTE_RE.test('x')).toBe(false);
  });

  it('EXTNAME_RE matches a trailing extension', () => {
    expect(EXTNAME_RE.test('a.txt')).toBe(true);
    expect(EXTNAME_RE.test('noext')).toBe(false);
  });
});
