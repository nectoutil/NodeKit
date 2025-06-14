// biome-ignore-all lint/suspicious/noExplicitAny: Explicity any okay for tests.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { renderHook, act } from '@testing-library/react';
import { useElementVisibility } from '@necto-react/hooks';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
let intersectionObserverCallback: ((entries: IntersectionObserverEntry[]) => void) | null = null;

const mockIntersectionObserver = vi.fn().mockImplementation((callback) => {
  intersectionObserverCallback = callback;
  return {
    observe: mockObserve,
    disconnect: mockDisconnect,
  };
});

// @ts-ignore
window.IntersectionObserver = mockIntersectionObserver;

describe('useElementVisibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    intersectionObserverCallback = null;
  });

  it('should return a ref and initial visibility state', () => {
    const { result } = renderHook(() => useElementVisibility());

    expect(result.current[0]).toBeDefined();
    expect(result.current[1]).toBe(false);
    expect(result.current[2]).toBe(null);
  });

  it('should create IntersectionObserver when element is attached', () => {
    const { result } = renderHook(() => useElementVisibility());

    act(() => {
      const mockElement = document.createElement('div');
      (result.current[0] as (node: Element | null) => void)(mockElement as any);
    });

    expect(mockIntersectionObserver).toHaveBeenCalled();
    expect(mockObserve).toHaveBeenCalled();
  });

  it('should update visibility when element becomes visible', () => {
    const { result } = renderHook(() => useElementVisibility());

    // Attach element
    act(() => {
      const mockElement = document.createElement('div');
      (result.current[0] as (node: Element | null) => void)(mockElement as any);
    });

    // Trigger intersection
    act(() => {
      if (intersectionObserverCallback) {
        intersectionObserverCallback([{
          isIntersecting: true,
          intersectionRatio: 1,
          intersectionRect: new DOMRectReadOnly(),
          boundingClientRect: new DOMRectReadOnly(),
          rootBounds: new DOMRectReadOnly(),
          time: Date.now(),
          target: document.createElement('div'),
        }]);
      }
    });

    expect(result.current[1]).toBe(true);
  });

   it('should call onChange callback when visibility changes', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useElementVisibility({ onChange }));

    // Attach element
    act(() => {
      const mockElement = document.createElement('div');
      (result.current[0] as (node: Element | null) => void)(mockElement);
    });

    // Trigger visibility change
    act(() => {
      if (intersectionObserverCallback) {
        intersectionObserverCallback([{
          isIntersecting: true,
          intersectionRatio: 1,
          intersectionRect: new DOMRectReadOnly(),
          boundingClientRect: new DOMRectReadOnly(),
          rootBounds: new DOMRectReadOnly(),
          time: Date.now(),
          target: document.createElement('div'),
        }]);
      }
    });

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('should persist visibility when once option is enabled', () => {
    const { result } = renderHook(() => useElementVisibility({ once: true }));

    // Attach element
    act(() => {
      const mockElement = document.createElement('div');
      (result.current[0] as (node: Element | null) => void)(mockElement);
    });

    // Make visible
    act(() => {
      if (intersectionObserverCallback) {
        intersectionObserverCallback([{
          isIntersecting: true,
          intersectionRatio: 1,
          intersectionRect: new DOMRectReadOnly(),
          boundingClientRect: new DOMRectReadOnly(),
          rootBounds: new DOMRectReadOnly(),
          time: Date.now(),
          target: document.createElement('div'),
        }]);
      }
    });

    expect(result.current[1]).toBe(true);

    // Make not visible
    act(() => {
      if (intersectionObserverCallback) {
        intersectionObserverCallback([{
          isIntersecting: false,
          intersectionRatio: 0,
          intersectionRect: new DOMRectReadOnly(),
          boundingClientRect: new DOMRectReadOnly(),
          rootBounds: new DOMRectReadOnly(),
          time: Date.now(),
          target: document.createElement('div'),
        }]);
      }
    });

    // Should still be true due to 'once' option
    expect(result.current[1]).toBe(true);
  });

  it('should disconnect observer on unmount', () => {
    const { result, unmount } = renderHook(() => useElementVisibility());

    act(() => {
      const mockElement = document.createElement('div');
      (result.current[0] as (node: Element | null) => void)(mockElement);
    });

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });
});