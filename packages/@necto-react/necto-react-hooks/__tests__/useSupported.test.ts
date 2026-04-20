/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSupported } from '@necto-react/hooks';

describe('useSupported', () => {
  it('returns false before the effect runs', () => {
    const { result } = renderHook(() => useSupported(() => true));
    expect(typeof result.current).toBe('boolean');
  });

  it('returns true when the feature check returns a truthy value', async () => {
    const { result } = renderHook(() => useSupported(() => true));
    await act(async () => {});
    expect(result.current).toBe(true);
  });

  it('returns false when the feature check returns a falsy value', async () => {
    const { result } = renderHook(() => useSupported(() => false));
    await act(async () => {});
    expect(result.current).toBe(false);
  });

  it('returns false when the feature check returns null', async () => {
    const { result } = renderHook(() => useSupported(() => null));
    await act(async () => {});
    expect(result.current).toBe(false);
  });

  it('returns true for a defined API', async () => {
    const { result } = renderHook(() => useSupported(() => window.localStorage));
    await act(async () => {});
    expect(result.current).toBe(true);
  });
});
