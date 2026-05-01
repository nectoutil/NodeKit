/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable @typescript-eslint/consistent-type-definitions */

import { fireEvent, renderHook } from '@testing-library/react';
import { useEventListener } from '@necto-react/hooks';
import { afterEach, describe, expect, test, vi } from 'vitest';

// Augment the standard event maps with a `'test-event'` key so the hook
// accepts our synthetic event name for binding/unbinding tests.
declare global {
  interface WindowEventMap {
    'test-event': CustomEvent;
  }

  interface HTMLElementEventMap {
    'test-event': CustomEvent;
  }

  interface SVGElementEventMap {
    'test-event': CustomEvent;
  }

  interface DocumentEventMap {
    'test-event': CustomEvent;
  }
}

const windowAddEventListenerSpy = vi.spyOn(window, 'addEventListener');
const windowRemoveEventListenerSpy = vi.spyOn(window, 'removeEventListener');

const ref = { current: document.createElement('div') };
const refAddEventListenerSpy = vi.spyOn(ref.current, 'addEventListener');
const refRemoveEventListenerSpy = vi.spyOn(ref.current, 'removeEventListener');

const docRef = { current: window.document };
const docAddEventListenerSpy = vi.spyOn(docRef.current, 'addEventListener');
const docRemoveEventListenerSpy = vi.spyOn(
  docRef.current,
  'removeEventListener'
);

describe('useEventListener', () => {
  afterEach((): void => {
    vi.clearAllMocks();
  });

  test('binds and unbinds the event listener to the window when element is not provided', (): void => {
    const eventName = 'test-event';
    const handler = vi.fn();
    const options = undefined;

    const { unmount } = renderHook((): void => {
      useEventListener(eventName, handler);
    });

    expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options
    );

    unmount();

    expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options
    );
  });

  test('binds and unbinds the event listener to the element when element is provided', (): void => {
    const eventName = 'test-event';
    const handler = vi.fn();
    const options = undefined;

    const { unmount } = renderHook((): void => {
      useEventListener(eventName, handler, ref, options);
    });

    expect(refAddEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(refAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options
    );

    unmount();

    expect(refRemoveEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options
    );
  });

  test('binds and unbinds the event listener to the document when document is provided', (): void => {
    const eventName = 'test-event';
    const handler = vi.fn();
    const options = undefined;

    const { unmount } = renderHook((): void => {
      useEventListener(eventName, handler, docRef, options);
    });

    expect(docAddEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(docAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options
    );

    unmount();

    expect(docRemoveEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options
    );
  });

  test('passes the options through to the event listener', (): void => {
    const eventName = 'test-event';
    const handler = vi.fn();
    const options = {
      passive: true,
      once: true,
      capture: true
    };

    renderHook((): void => {
      useEventListener(eventName, handler, undefined, options);
    });

    expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options
    );
  });

  test('calls the handler when the event is triggered', (): void => {
    const eventName = 'click';
    const handler = vi.fn();

    renderHook((): void => {
      useEventListener(eventName, handler, ref);
    });

    fireEvent.click(ref.current);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('narrows the event payload to the right type per event name', (): void => {
    const clickHandler = vi.fn();
    const keydownHandler = vi.fn();

    renderHook((): void => {
      useEventListener('click', clickHandler, ref);
    });
    renderHook((): void => {
      useEventListener('keydown', keydownHandler, ref);
    });

    fireEvent.click(ref.current);
    fireEvent.keyDown(ref.current);

    expect(clickHandler).toHaveBeenCalledWith(expect.any(MouseEvent));
    expect(keydownHandler).toHaveBeenCalledWith(expect.any(KeyboardEvent));
  });

  test('does not bind the listener when enabled is false', (): void => {
    const eventName = 'test-event';
    const handler = vi.fn();

    renderHook((): void => {
      useEventListener(eventName, handler, undefined, { enabled: false });
    });

    expect(windowAddEventListenerSpy).not.toHaveBeenCalled();
  });

  test('rebinds when enabled flips from false to true', (): void => {
    const eventName = 'test-event';
    const handler = vi.fn();

    const { rerender } = renderHook(
      ({ enabled }: { enabled: boolean }): void => {
        useEventListener(eventName, handler, undefined, { enabled });
      },
      { initialProps: { enabled: false } }
    );

    expect(windowAddEventListenerSpy).not.toHaveBeenCalled();

    rerender({ enabled: true });

    expect(windowAddEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      { enabled: true }
    );
  });
});
