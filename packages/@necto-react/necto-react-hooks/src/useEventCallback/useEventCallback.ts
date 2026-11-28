/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useCallback, useRef } from 'react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect';

import type { EventCallback } from './useEventCallback.types';

export function useEventCallback<Args extends unknown[], R>(
  callback: EventCallback<Args, R>
): EventCallback<Args, R>;

export function useEventCallback<Args extends unknown[], R>(
  callback: EventCallback<Args, R> | undefined
): EventCallback<Args, R> | undefined;

export function useEventCallback<Args extends unknown[], R>(
  callback: EventCallback<Args, R> | undefined
): EventCallback<Args, R> | undefined {
  const callbackRef = useRef<EventCallback<Args, R> | undefined>(() => {
    throw new TypeError(
      __DEV__
        ? `[necto-react.hooks] NT0204: Cannot call an event handler while rendering.`
        : '[necto-react.hooks] NT0204: https://necto.dev/errors/NT0204'
    );
  });

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: Args) => callbackRef.current?.(...args),
    [callbackRef]
  ) as EventCallback<Args, R>;
}
