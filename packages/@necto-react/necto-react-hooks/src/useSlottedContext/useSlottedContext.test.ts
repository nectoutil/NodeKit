/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext } from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSlottedContext } from './useSlottedContext';

describe('useSlottedContext', () => {
  it('returns the direct context value when no slots are present', () => {
    const Context = createContext<{ label: string } | { slots?: Record<string | symbol, { label: string }> } | null | undefined>({ label: 'direct' });

    const { result } = renderHook(() =>
      useSlottedContext({ context: Context })
    );

    expect(result.current).toEqual({ label: 'direct' });
  });

  it('returns null when slot is explicitly null', () => {
    const Context = createContext<{ label: string } | { slots?: Record<string | symbol, { label: string }> } | null | undefined>({ label: 'direct' });

    const { result } = renderHook(() =>
      useSlottedContext({ context: Context, slot: null })
    );

    expect(result.current).toBeNull();
  });

  it('returns the value for a valid slot', () => {
    const Context = createContext<{ label: string } | { slots?: Record<string | symbol, { label: string }> } | null | undefined>({
      slots: {
        header: { label: 'header' },
        footer: { label: 'footer' },
      },
    });

    const { result } = renderHook(() =>
      useSlottedContext({ context: Context, slot: 'header' })
    );

    expect(result.current).toEqual({ label: 'header' });
  });

  it('throws an error for an invalid slot', () => {
    const Context = createContext<{ label: string } | { slots?: Record<string | symbol, { label: string }> } | null | undefined>({
      slots: {
        header: { label: 'header' },
      },
    });

    expect(() =>
      renderHook(() =>
        useSlottedContext({ context: Context, slot: 'footer' })
      )
    ).toThrowError(/Invalid slot "footer"/);
  });

it('throws if slots exist but are empty', () => {
  const Context = createContext<{ label: string } | { slots?: Record<string | symbol, { label: string }> } | null | undefined>({
    slots: {},
  });

  expect(() =>
    renderHook(() =>
      useSlottedContext({ context: Context, slot: 'header' })
    )
  ).toThrowError(/Invalid slot "header"/);
});
});