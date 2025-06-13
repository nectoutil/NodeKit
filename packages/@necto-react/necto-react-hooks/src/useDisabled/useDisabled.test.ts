/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useDisabled } from './useDisabled';
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';

describe('useDisabled Hook', () => {
  it('returns false by default when no provider is present', () => {
    const { result } = renderHook(() => useDisabled());
    expect(result.current).toBe(false);
  });

  it('returns false by default when called with an empty object', () => {
    const { result } = renderHook(() => useDisabled({}));
    expect(result.current).toBe(false);
  });

  it('returns the provided defaultFallback when type does not exist', () => {
    const { result } = renderHook(() =>
      useDisabled({ type: 'doesNotExist', defaultFallback: true })
    );
    expect(result.current).toBe(true);
  });
});
