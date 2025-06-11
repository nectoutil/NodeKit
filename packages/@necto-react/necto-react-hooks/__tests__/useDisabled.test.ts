import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDisabled } from '@necto-react-hooks/useDisabled';

describe('useDisabled Hook', () => {
  it('default state without passing in an empty object', () => {
    const { result } = renderHook(() => useDisabled());
    expect(result.current).toBe(false);
  });

  it('default state with empty object', () => {
    const { result } = renderHook(() => useDisabled(new Object()));
    expect(result.current).toBe(false);
  });

  it('provide complex ', () => {

  });
});