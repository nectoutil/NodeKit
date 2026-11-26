/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';

import path from '../src/index';

describe('path object', () => {
  it('exposes sep and delimiter', () => {
    expect(path.sep).toBe('/');
    expect(path.delimiter).toBe(':');
  });

  it('delegates basename, dirname, and extname', () => {
    expect(path.basename('/a/b.txt')).toBe('b.txt');
    expect(path.dirname('/a/b/c')).toBe('/a/b');
    expect(path.extname('/a/b.txt')).toBe('.txt');
  });

  it('uses the windows-normalizing default', () => {
    expect(path.basename('C:\\a\\b.txt')).toBe('b.txt');
    expect(path.dirname('C:\\a\\b')).toBe('C:/a');
    expect(path.extname('C:\\a\\b.json')).toBe('.json');
  });
});
