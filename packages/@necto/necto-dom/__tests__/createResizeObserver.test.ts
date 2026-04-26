/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi
} from 'vitest';
import { configMocks, mockResizeObserver } from 'jsdom-testing-mocks';

import { createResizeObserver } from '../src';

configMocks({ afterAll, afterEach, beforeAll, beforeEach });

let resizeObserverMock: ReturnType<typeof mockResizeObserver>;

function flushAnimationFrame(): Promise<void> {
  return new Promise((resolve) => {
    globalThis.requestAnimationFrame(() => resolve());
  });
}

function createSizedTarget(width: number = 100, height: number = 100): HTMLElement {
  const target = document.createElement('div');
  resizeObserverMock.mockElementSize(target, {
    contentBoxSize: { inlineSize: width, blockSize: height }
  });
  return target;
}

beforeEach(() => {
  resizeObserverMock = mockResizeObserver();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('createResizeObserver', () => {
  test('observes the target on the underlying ResizeObserver when a handler subscribes', () => {
    const sharedObserver = createResizeObserver();
    const target = createSizedTarget();

    sharedObserver.subscribe(target, vi.fn());

    expect(resizeObserverMock.getObservedElements()).toContain(target);
  });

  test('only observes the underlying target once per element regardless of handler count', () => {
    const sharedObserver = createResizeObserver();
    const target = createSizedTarget();

    sharedObserver.subscribe(target, vi.fn());
    sharedObserver.subscribe(target, vi.fn());
    sharedObserver.subscribe(target, vi.fn());

    expect(resizeObserverMock.getObservers(target).length).toBe(1);
  });

  test('dispatches the entry to a single subscribed handler', async () => {
    const sharedObserver = createResizeObserver();
    const target = createSizedTarget(200, 100);
    const handler = vi.fn();

    sharedObserver.subscribe(target, handler);
    resizeObserverMock.resize(target);
    await flushAnimationFrame();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]![0].target).toBe(target);
  });

  test('dispatches to every handler subscribed to the same target', async () => {
    const sharedObserver = createResizeObserver();
    const target = createSizedTarget();
    const firstHandler = vi.fn();
    const secondHandler = vi.fn();

    sharedObserver.subscribe(target, firstHandler);
    sharedObserver.subscribe(target, secondHandler);
    resizeObserverMock.resize(target);
    await flushAnimationFrame();

    expect(firstHandler).toHaveBeenCalledTimes(1);
    expect(secondHandler).toHaveBeenCalledTimes(1);
  });

  test('dispatches to handlers on different targets independently', async () => {
    const sharedObserver = createResizeObserver();
    const firstTarget = createSizedTarget(50, 50);
    const secondTarget = createSizedTarget(60, 60);
    const firstHandler = vi.fn();
    const secondHandler = vi.fn();

    sharedObserver.subscribe(firstTarget, firstHandler);
    sharedObserver.subscribe(secondTarget, secondHandler);
    resizeObserverMock.resize([firstTarget, secondTarget]);
    await flushAnimationFrame();

    expect(firstHandler).toHaveBeenCalledTimes(1);
    expect(secondHandler).toHaveBeenCalledTimes(1);
    expect(firstHandler.mock.calls[0]![0].target).toBe(firstTarget);
    expect(secondHandler.mock.calls[0]![0].target).toBe(secondTarget);
  });

  test('stops dispatching to a handler after it unsubscribes', async () => {
    const sharedObserver = createResizeObserver();
    const target = createSizedTarget();
    const handler = vi.fn();

    sharedObserver.subscribe(target, handler);
    sharedObserver.unsubscribe(target, handler);
    resizeObserverMock.resize(target);
    await flushAnimationFrame();

    expect(handler).not.toHaveBeenCalled();
  });

  test('keeps observing while at least one handler remains', async () => {
    const sharedObserver = createResizeObserver();
    const target = createSizedTarget();
    const firstHandler = vi.fn();
    const secondHandler = vi.fn();

    sharedObserver.subscribe(target, firstHandler);
    sharedObserver.subscribe(target, secondHandler);
    sharedObserver.unsubscribe(target, firstHandler);

    resizeObserverMock.resize(target);
    await flushAnimationFrame();

    expect(firstHandler).not.toHaveBeenCalled();
    expect(secondHandler).toHaveBeenCalledTimes(1);
  });

  test('unobserves the target when the last handler unsubscribes', () => {
    const sharedObserver = createResizeObserver();
    const target = createSizedTarget();
    const handler = vi.fn();

    sharedObserver.subscribe(target, handler);
    expect(resizeObserverMock.getObservedElements()).toContain(target);

    sharedObserver.unsubscribe(target, handler);
    expect(resizeObserverMock.getObservedElements()).not.toContain(target);
  });

  test('unsubscribing a handler that was never registered is a no-op', async () => {
    // Regression: original implementation unobserved the target whenever the
    // handler list had length 1, regardless of whether the unsubscribed
    // handler was actually in the list.
    const sharedObserver = createResizeObserver();
    const target = createSizedTarget();
    const registeredHandler = vi.fn();
    const strangerHandler = vi.fn();

    sharedObserver.subscribe(target, registeredHandler);
    sharedObserver.unsubscribe(target, strangerHandler);

    expect(resizeObserverMock.getObservedElements()).toContain(target);

    resizeObserverMock.resize(target);
    await flushAnimationFrame();

    expect(registeredHandler).toHaveBeenCalledTimes(1);
    expect(strangerHandler).not.toHaveBeenCalled();
  });

  test('unsubscribing on an unknown target is a no-op', () => {
    const sharedObserver = createResizeObserver();
    const unknownTarget = document.createElement('div');

    expect(() => sharedObserver.unsubscribe(unknownTarget, vi.fn())).not.toThrow();
  });

  test('disconnect tears down subscriptions and stops dispatching', async () => {
    const sharedObserver = createResizeObserver();
    const target = createSizedTarget();
    const handler = vi.fn();

    sharedObserver.subscribe(target, handler);
    sharedObserver.disconnect();
    resizeObserverMock.resize(target);
    await flushAnimationFrame();

    expect(handler).not.toHaveBeenCalled();
  });

  test('uses the provided polyfill instead of the global ResizeObserver', () => {
    const observeSpy = vi.fn();
    const disconnectSpy = vi.fn();

    class CustomResizeObserver {
      constructor(_callback: ResizeObserverCallback) {}
      observe = observeSpy;
      unobserve = vi.fn();
      disconnect = disconnectSpy;
    }

    const sharedObserver = createResizeObserver(
      CustomResizeObserver as unknown as typeof ResizeObserver
    );
    const target = document.createElement('div');

    sharedObserver.subscribe(target, vi.fn());
    expect(observeSpy).toHaveBeenCalledWith(target);

    sharedObserver.disconnect();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  test('exposes the underlying observer instance on the controller', () => {
    const sharedObserver = createResizeObserver();
    expect(sharedObserver.observer).toBeInstanceOf(globalThis.ResizeObserver);
  });
});
