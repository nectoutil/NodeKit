/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { useFocusVisible } from '../src/useFocusVisible/useFocusVisible';

describe('useFocusVisible', () => {
  it('should return an object with isFocusVisible property', () => {
    const { result } = renderHook(() => useFocusVisible());

    expect(result.current).toHaveProperty('isFocusVisible');
    expect(typeof result.current.isFocusVisible).toBe('boolean');
  });

  it('should return true when autoFocus is true', () => {
    const { result } = renderHook(() => useFocusVisible({ autoFocus: true }));

    expect(result.current.isFocusVisible).toBe(true);
  });
});
