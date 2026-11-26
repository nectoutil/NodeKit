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
import { extname, PathPlatforms } from '../src/index';

const posix = { platform: PathPlatforms.Posix } as const;

describe('extname', () => {
  it('matches node:path.posix for every fixture', () => {
    for (const p of PATHS) {
      expect(extname(p, posix)).toBe(nodePath.posix.extname(p));
    }
  });

  it('matches node:path.posix under fuzzing', () => {
    fc.assert(
      fc.property(pathArb, (p) => {
        expect(extname(p, posix)).toBe(nodePath.posix.extname(p));
      }),
      { numRuns: 2000, seed: 42 }
    );
  });

  it('resolves the extension from the last segment by default (windows platform)', () => {
    expect(extname('C:\\foo\\bar.md')).toBe('.md');
    expect(extname('a\\b.tar.gz')).toBe('.gz');
  });

  it('throws a typed error for non-string input', () => {
    // @ts-expect-error runtime guard
    expect(() => extname(42)).toThrow(TypeError);
  });
});
