/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useScript } from '../src/useScript/useScript';

describe('useScript', () => {
  it('reports loading and ready states for an injected script', () => {
    const src = '/scripts/use-script-load.test.js';
    const { result } = renderHook(() => useScript(src));

    expect(result.current).toBe('loading');

    const script = Array.from(document.scripts).find(
      (element) => element.src === new URL(src, document.baseURI).href
    );

    expect(script).toBeDefined();
    expect(script?.dataset.nectoScript).toBe(`src:${new URL(src, document.baseURI).href}`);

    act(() => {
      script?.dispatchEvent(new Event('load'));
    });

    expect(result.current).toBe('ready');
  });

  it('deduplicates the same script across hook instances', () => {
    const src = '/scripts/use-script-dedupe.test.js';
    const first = renderHook(() => useScript(src));
    const second = renderHook(() => useScript(src));
    const matchingScripts = Array.from(document.scripts).filter(
      (element) => element.src === new URL(src, document.baseURI).href
    );

    expect(matchingScripts).toHaveLength(1);

    act(() => {
      matchingScripts[0].dispatchEvent(new Event('load'));
    });

    expect(first.result.current).toBe('ready');
    expect(second.result.current).toBe('ready');
  });

  it('reports errors and removes a failed script', () => {
    const src = '/scripts/use-script-error.test.js';
    const { result } = renderHook(() => useScript(src));
    const script = Array.from(document.scripts).find(
      (element) => element.src === new URL(src, document.baseURI).href
    );

    act(() => {
      script?.dispatchEvent(new Event('error'));
    });

    expect(result.current).toBe('error');
    expect(script?.isConnected).toBe(false);
  });

  it('does not inject a script when disabled', () => {
    const { result } = renderHook(() =>
      useScript('/scripts/use-script-disabled.test.js', {
        enabled: false
      })
    );

    expect(result.current).toBe('idle');
  });
});
