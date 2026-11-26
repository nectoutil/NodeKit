/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fc from 'fast-check';
import nodePath from 'node:path';
import { describe, it, expect } from 'vitest';

import { basename, PathPlatforms } from '../src/index';
import { PATHS, pathArb, suffixArb } from '../__fixtures__/paths';

const posix = { platform: PathPlatforms.Posix } as const;

// node:path has a long-standing quirk where basename() with a suffix can return a
// value containing a separator (e.g. basename('/a//b/', '.b') === 'b/'). necto, like
// pathe, returns the clean basename, so these malformed node outputs are excluded.
const isNodeQuirk = (output: string): boolean => output.includes('/') && /[^/]/.test(output);

describe('basename', () => {
  it('matches node:path.posix for every fixture', () => {
    for (const p of PATHS) {
      expect(basename(p, undefined, posix)).toBe(nodePath.posix.basename(p));
    }
  });

  it('matches node:path.posix for every fixture with a suffix', () => {
    for (const p of PATHS) {
      for (const s of ['.txt', '.html', '.b', 'bar', '']) {
        const expected = nodePath.posix.basename(p, s);
        if (isNodeQuirk(expected)) {
          continue;
        }
        expect(basename(p, s, posix)).toBe(expected);
      }
    }
  });

  it('matches node:path.posix under fuzzing', () => {
    fc.assert(
      fc.property(pathArb, (p) => {
        expect(basename(p, undefined, posix)).toBe(nodePath.posix.basename(p));
      }),
      { numRuns: 2000, seed: 42 }
    );
  });

  it('matches node:path.posix under fuzzing with a suffix', () => {
    fc.assert(
      fc.property(pathArb, suffixArb, (p, s) => {
        const expected = nodePath.posix.basename(p, s);
        fc.pre(!isNodeQuirk(expected));
        expect(basename(p, s, posix)).toBe(expected);
      }),
      { numRuns: 2000, seed: 42 }
    );
  });

  it('returns a clean basename where node:path has a trailing-slash quirk', () => {
    expect(nodePath.posix.basename('/a//b/', '.b')).toBe('b/');
    expect(basename('/a//b/', '.b', posix)).toBe('b');
  });

  it('normalizes backslashes by default (windows platform)', () => {
    expect(basename('C:\\foo\\bar.txt')).toBe('bar.txt');
    expect(basename('foo\\bar')).toBe('bar');
  });

  it('throws a typed error for non-string input', () => {
    // @ts-expect-error runtime guard
    expect(() => basename(42)).toThrow(TypeError);
    // @ts-expect-error runtime guard
    expect(() => basename('ok', 5)).toThrow(TypeError);
  });
});
