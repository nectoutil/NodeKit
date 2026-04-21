/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useId } from '../src/useId/useId';
import {
  defaultContext,
  idsUpdaterMap,
  registry
} from '../src/useId/hookContext';

describe('useId Hook', () => {
  afterEach(() => {
    idsUpdaterMap.clear();
  });

  it('generates a unique ID with the default prefix if none is provided', () => {
    const { result } = renderHook(() => useId());
    expect(result.current).toMatch(/^necto-/);
  });

  it('generates ID with a custom prefix', () => {
    const { result } = renderHook(() => useId({ prefix: 'custom' }));
    expect(result.current).toMatch(/^custom-/);
  });

  it('returns the provided defaultId if given', () => {
    const { result } = renderHook(() =>
      useId({ prefix: 'custom', defaultId: 'my-default-id' })
    );
    expect(result.current).toBe('my-default-id');
  });

  it('does not change the ID across re-renders', () => {
    const { result, rerender } = renderHook(() => useId({ prefix: 'stable' }));
    const firstId = result.current;
    rerender();
    expect(result.current).toBe(firstId);
  });

  it('generates unique IDs across different hooks', () => {
    const { result: a } = renderHook(() => useId({ prefix: 'unique1' }));
    const { result: b } = renderHook(() => useId({ prefix: 'unique2' }));
    expect(a.current).not.toBe(b.current);
  });

  it('does not increment the counter when defaultId is provided', () => {
    const before = defaultContext.current;
    renderHook(() => useId({ defaultId: 'hardcoded' }));
    expect(defaultContext.current).toBe(before);
  });

  it('registers the id in idsUpdaterMap while mounted', () => {
    const { result } = renderHook(() => useId({ prefix: 'tracked' }));
    expect(idsUpdaterMap.has(result.current)).toBe(true);
  });

  it('removes the id from idsUpdaterMap on unmount', () => {
    const { result, unmount } = renderHook(() =>
      useId({ prefix: 'cleanup' })
    );
    const id = result.current;
    expect(idsUpdaterMap.has(id)).toBe(true);

    unmount();

    expect(idsUpdaterMap.has(id)).toBe(false);
  });

  it('stores exactly one updater per mounted hook instance', () => {
    const { result } = renderHook(() => useId({ prefix: 'single' }));
    const updaters = idsUpdaterMap.get(result.current);
    expect(updaters).toBeDefined();
    expect(updaters).toHaveLength(1);
  });

  it('tracks distinct ids for two concurrently-mounted hooks', () => {
    const { result: a, unmount: unmountA } = renderHook(() =>
      useId({ prefix: 'a' })
    );
    const { result: b, unmount: unmountB } = renderHook(() =>
      useId({ prefix: 'b' })
    );

    expect(idsUpdaterMap.has(a.current)).toBe(true);
    expect(idsUpdaterMap.has(b.current)).toBe(true);

    unmountA();
    expect(idsUpdaterMap.has(a.current)).toBe(false);
    expect(idsUpdaterMap.has(b.current)).toBe(true);

    unmountB();
    expect(idsUpdaterMap.has(b.current)).toBe(false);
  });

  it('exposes a non-null FinalizationRegistry in environments that support it', () => {
    expect(registry).not.toBeNull();
    expect(registry).toBeInstanceOf(FinalizationRegistry);
  });

  it('falls back to the internal counter when React.useId is unavailable', () => {
    const originalUseId = (React as { useId?: () => string }).useId;
    Object.defineProperty(React, 'useId', {
      value: undefined,
      configurable: true,
      writable: true
    });

    try {
      const before = defaultContext.current;
      const { result } = renderHook(() => useId({ prefix: 'fallback' }));
      expect(result.current).toMatch(/^fallback-\d+$/);
      expect(defaultContext.current).toBeGreaterThan(before);
    } finally {
      Object.defineProperty(React, 'useId', {
        value: originalUseId,
        configurable: true,
        writable: true
      });
    }
  });

  it('produces differently-suffixed ids on successive calls when using the counter fallback', () => {
    const originalUseId = (React as { useId?: () => string }).useId;
    Object.defineProperty(React, 'useId', {
      value: undefined,
      configurable: true,
      writable: true
    });

    try {
      const { result: a } = renderHook(() => useId({ prefix: 'seq' }));
      const { result: b } = renderHook(() => useId({ prefix: 'seq' }));
      expect(a.current).not.toBe(b.current);
    } finally {
      Object.defineProperty(React, 'useId', {
        value: originalUseId,
        configurable: true,
        writable: true
      });
    }
  });
});
