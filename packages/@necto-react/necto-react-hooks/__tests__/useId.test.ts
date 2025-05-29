import { describe, it, expect } from 'vitest';
import { useId } from '@necto-react-hooks/useId';
import { renderHook } from '@testing-library/react';

import { useId as ariaID } from "@react-aria/utils";

describe('useId Hook', () => {
  it('generates a unique ID with the default prefix if none is provided', () => {
    const { result } = renderHook(() => useId());
    expect(result.current).toMatch(/^necto-(«r\d+»|\d+-\d+)$/);
  });

  it('generates ID with a custom prefix', () => {
    const customPrefix = 'custom';
    const { result } = renderHook(() => useId(customPrefix));
    expect(result.current).toMatch(/^custom-(«r\d+»|\d+-\d+)$/);
  });

  it('returns the provided defaultId if given', () => {
    const defaultId = 'my-default-id';
    const { result } = renderHook(() => useId('custom', defaultId));
    expect(result.current).toBe(defaultId);
  });

  it('does not change the ID across re-renders', () => {
    const { result, rerender } = renderHook(() => useId('stable'));
    const firstId = result.current;
    rerender(); // Trigger re-render
    expect(result.current).toBe(firstId);
  });

  it('generates unique IDs across different hooks', () => {
    const { result: result1 } = renderHook(() => useId('unique1'));
    const { result: result2 } = renderHook(() => useId('unique2'));
    expect(result1.current).not.toBe(result2.current);
  });
});

