/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fc from 'fast-check';
import nodePath from 'node:path';
import { describe, it, expect } from 'vitest';

import { PATHS, pathArb } from '../__fixtures__/paths';
import { dirname, PathPlatforms } from '../src/index';

const posix = { platform: PathPlatforms.Posix } as const;

describe('dirname', () => {
  it('matches node:path.posix for every fixture', () => {
    for (const p of PATHS) {
      expect(dirname(p, posix)).toBe(nodePath.posix.dirname(p));
    }
  });

  it('matches node:path.posix under fuzzing', () => {
    fc.assert(
      fc.property(pathArb, (p) => {
        expect(dirname(p, posix)).toBe(nodePath.posix.dirname(p));
      }),
      { numRuns: 2000, seed: 42 }
    );
  });

  it('normalizes backslashes and drive roots by default (windows platform)', () => {
    expect(dirname('C:\\foo\\bar')).toBe('C:/foo');
    expect(dirname('C:\\foo')).toBe('C:/');
    expect(dirname('foo\\bar\\baz')).toBe('foo/bar');
  });

  it('throws a typed error for non-string input', () => {
    // @ts-expect-error runtime guard
    expect(() => dirname(42)).toThrow(TypeError);
  });
});
