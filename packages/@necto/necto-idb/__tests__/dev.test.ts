/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';

describe('__DEV__', () => {
  it('is substituted when the tests run', () => {
    expect(typeof __DEV__).toBe('boolean');
    expect(__DEV__).toBe(true);
  });
});
