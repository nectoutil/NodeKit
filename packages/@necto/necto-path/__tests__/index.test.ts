/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';

import path, { basename, dirname, extname, PathPlatforms } from '../src/index';

describe('index exports', () => {
  it('exports the standalone functions', () => {
    expect(typeof basename).toBe('function');
    expect(typeof dirname).toBe('function');
    expect(typeof extname).toBe('function');
  });

  it('exports a default path object with every method', () => {
    expect(typeof path.basename).toBe('function');
    expect(typeof path.dirname).toBe('function');
    expect(typeof path.extname).toBe('function');
  });

  it('exports PathPlatforms', () => {
    expect(PathPlatforms.Posix).toBe('posix');
    expect(PathPlatforms.Windows).toBe('windows');
  });
});
