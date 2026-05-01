/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { act, fireEvent, renderHook } from '@testing-library/react';
import { useOnClickOutside } from '@necto-react/hooks';
import { afterEach, describe, expect, test, vi } from 'vitest';

describe('useOnClickOutside', () => {
  afterEach((): void => {
    // Clean up any elements appended to body during tests.
    document.body.innerHTML = '';
  });

  test('calls the handler when clicking outside the element (single ref)', (): void => {
    const containerRef = { current: document.createElement('div') };
    const handler = vi.fn();

    renderHook((): void => {
      useOnClickOutside(containerRef, handler);
    });

    expect(handler).toHaveBeenCalledTimes(0);

    act((): void => {
      fireEvent.mouseDown(document);
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('calls the handler when clicking outside the element (multiple refs)', (): void => {
    const containerRef1 = { current: document.createElement('div') };
    const containerRef2 = { current: document.createElement('div') };
    const handler = vi.fn();

    renderHook((): void => {
      useOnClickOutside([containerRef1, containerRef2], handler);
    });

    expect(handler).toHaveBeenCalledTimes(0);

    act((): void => {
      fireEvent.mouseDown(document);
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('calls the handler when clicking outside (multiple refs, one with null current)', (): void => {
    const containerRef1 = { current: document.createElement('div') };
    const containerRef2 = { current: null };
    const handler = vi.fn();

    renderHook((): void => {
      useOnClickOutside([containerRef1, containerRef2], handler);
    });

    expect(handler).toHaveBeenCalledTimes(0);

    act((): void => {
      fireEvent.mouseDown(document);
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('does NOT call the handler when clicking inside the element', (): void => {
    // Element must be connected for the `isInside` check to be meaningful;
    // a detached element would short-circuit on the `isConnected` guard.
    const inside = document.createElement('div');
    document.body.appendChild(inside);
    const containerRef = { current: inside };
    const handler = vi.fn();

    renderHook((): void => {
      useOnClickOutside([containerRef], handler);
    });

    act((): void => {
      fireEvent.mouseDown(inside);
    });

    expect(handler).toHaveBeenCalledTimes(0);
  });

  test('does NOT call the handler when clicking on a non-connected element', (): void => {
    const containerRef = { current: document.createElement('div') };
    const handler = vi.fn();

    renderHook((): void => {
      useOnClickOutside([containerRef], handler);
    });

    act((): void => {
      const detached = document.createElement('div');
      document.body.appendChild(detached);
      document.body.removeChild(detached);
      fireEvent.mouseDown(detached);
    });

    expect(handler).toHaveBeenCalledTimes(0);
  });

  test('honors a custom eventType', (): void => {
    const containerRef = { current: document.createElement('div') };
    const handler = vi.fn();

    renderHook((): void => {
      useOnClickOutside(containerRef, handler, { eventType: 'mouseup' });
    });

    // mousedown should NOT trigger the configured 'mouseup' handler.
    act((): void => {
      fireEvent.mouseDown(document);
    });
    expect(handler).toHaveBeenCalledTimes(0);

    // mouseup SHOULD trigger.
    act((): void => {
      fireEvent.mouseUp(document);
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('does NOT call the handler when the wrapped useEventListener is disabled', (): void => {
    const containerRef = { current: document.createElement('div') };
    const handler = vi.fn();

    renderHook((): void => {
      useOnClickOutside(containerRef, handler, {
        eventListenerOptions: { enabled: false }
      });
    });

    act((): void => {
      fireEvent.mouseDown(document);
    });

    expect(handler).toHaveBeenCalledTimes(0);
  });
});
