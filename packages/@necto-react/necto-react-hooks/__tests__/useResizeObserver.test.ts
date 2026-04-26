/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef } from 'react';
import { renderHook } from '@testing-library/react';
import { useResizeObserver } from '@necto-react/hooks';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

/**
 * Minimal recording fake. The factory's behavior (subscribe/unsubscribe
 * plumbing, batching, dispatch dedup, etc.) is covered in the
 * `@necto/dom` test suite. Here we only assert that the React hook delegates
 * to the underlying controller correctly: observes on mount, unobserves on
 * unmount, swaps targets on rerender, etc.
 */
class RecordingResizeObserver {
  static instances: Array<RecordingResizeObserver> = [];

  static latest(): RecordingResizeObserver {
    const instance = RecordingResizeObserver.instances.at(-1);
    if (!instance) throw new Error('No RecordingResizeObserver has been constructed yet.');
    return instance;
  }

  readonly observed: Set<Element> = new Set();
  readonly callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    RecordingResizeObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.observed.add(target);
  }

  unobserve(target: Element): void {
    this.observed.delete(target);
  }

  disconnect(): void {
    this.observed.clear();
  }

  /** Test-only: drive a single entry through the factory's callback. */
  trigger(target: Element): void {
    this.callback(
      [{ target, contentRect: { width: 0, height: 0 } } as ResizeObserverEntry],
      this as unknown as ResizeObserver
    );
  }
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', RecordingResizeObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useResizeObserver', () => {
  test('returns the controller object on mount', () => {
    const target = document.createElement('div');
    const { result } = renderHook(() =>
      useResizeObserver({ current: target }, () => {})
    );

    expect(result.current).not.toBeNull();
    expect(typeof result.current?.subscribe).toBe('function');
    expect(typeof result.current?.unsubscribe).toBe('function');
    expect(typeof result.current?.disconnect).toBe('function');
  });

  test('observes the target element on mount', () => {
    const target = document.createElement('div');
    renderHook(() => useResizeObserver({ current: target }, () => {}));

    expect(RecordingResizeObserver.latest().observed.has(target)).toBe(true);
  });

  test('accepts a raw element target without a ref wrapper', () => {
    const target = document.createElement('div');
    renderHook(() => useResizeObserver(target, () => {}));

    expect(RecordingResizeObserver.latest().observed.has(target)).toBe(true);
  });

  test('does not observe anything when the target is null', () => {
    renderHook(() => useResizeObserver({ current: null }, () => {}));

    if (RecordingResizeObserver.instances.length > 0) {
      expect(RecordingResizeObserver.latest().observed.size).toBe(0);
    }
  });

  test('unobserves the target when the hook unmounts', () => {
    const target = document.createElement('div');
    const { unmount } = renderHook(() =>
      useResizeObserver({ current: target }, () => {})
    );
    expect(RecordingResizeObserver.latest().observed.has(target)).toBe(true);

    unmount();

    expect(RecordingResizeObserver.latest().observed.has(target)).toBe(false);
  });

  test('swaps observed target when the ref changes between renders', () => {
    const firstTarget = document.createElement('div');
    const secondTarget = document.createElement('div');

    const { rerender } = renderHook(
      ({ targetRef }) => useResizeObserver(targetRef, () => {}),
      { initialProps: { targetRef: { current: firstTarget } } }
    );

    expect(RecordingResizeObserver.latest().observed.has(firstTarget)).toBe(true);

    rerender({ targetRef: { current: secondTarget } });

    expect(RecordingResizeObserver.latest().observed.has(firstTarget)).toBe(false);
    expect(RecordingResizeObserver.latest().observed.has(secondTarget)).toBe(true);
  });

  test('reuses the same controller across multiple hook calls (singleton)', () => {
    const firstTarget = document.createElement('div');
    const secondTarget = document.createElement('div');

    const { result: firstResult } = renderHook(() =>
      useResizeObserver({ current: firstTarget }, () => {})
    );
    const { result: secondResult } = renderHook(() =>
      useResizeObserver({ current: secondTarget }, () => {})
    );

    expect(firstResult.current).toBe(secondResult.current);
    expect(RecordingResizeObserver.instances).toHaveLength(1);
  });

  test('forwards the latest callback after a re-render (useLatestRef integration)', async () => {
    const target = document.createElement('div');
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();

    const { rerender } = renderHook(
      ({ handler }) => useResizeObserver({ current: target }, handler),
      { initialProps: { handler: firstCallback } }
    );

    rerender({ handler: secondCallback });
    RecordingResizeObserver.latest().trigger(target);

    // Factory batches dispatches via requestAnimationFrame.
    await new Promise<void>((resolve) =>
      globalThis.requestAnimationFrame(() => resolve())
    );

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledTimes(1);
  });

  test('integrates with useRef-based targets', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(document.createElement('div'));
      useResizeObserver(ref, () => {});
      return ref;
    });

    expect(RecordingResizeObserver.latest().observed.has(result.current.current!)).toBe(true);
  });
});
