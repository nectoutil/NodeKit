import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDisabled, DisabledProvider } from '@necto-react-hooks/useDisabled';

import type { ReactNode } from 'react';

describe('useDisabled Hook', () => {
  it('returns false by default when no provider is present', () => {
    const { result } = renderHook(() => useDisabled());
    expect(result.current).toBe(false);
  });

  it('returns false by default when called with an empty object', () => {
    const { result } = renderHook(() => useDisabled({}));
    expect(result.current).toBe(false);
  });

  it('returns the correct value from context', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <DisabledProvider value={{ general: true, featureX: false }}>
        {children}
      </DisabledProvider>
    );

    // Should return true for "general"
    const { result: resultGeneral } = renderHook(() => useDisabled({ type: 'general' }), { wrapper });
    expect(resultGeneral.current).toBe(true);

    // Should return false for "featureX"
    const { result: resultFeatureX } = renderHook(() => useDisabled({ type: 'featureX' }), { wrapper });
    expect(resultFeatureX.current).toBe(false);

    // Should return fallback if type is not present
    const { result: resultUnknown } = renderHook(() => useDisabled({ type: 'doesNotExist', defaultFallback: true }), { wrapper });
    expect(resultUnknown.current).toBe(true);
  });
});
