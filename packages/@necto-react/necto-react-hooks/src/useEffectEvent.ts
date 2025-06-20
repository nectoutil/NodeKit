// biome-ignore-all lint/suspicious/noExplicitAny: Explicit any okay for this function context.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useRef, useLayoutEffect, useEffect } from 'react';

/**
 * Returns a stable event callback that always invokes the latest version of the provided function.
 *
 * @param {T} fn - The event handler function to stabilize.
 * @returns {T} A memoized callback that always calls the latest version of `fn`.
 */
export function useEffectEvent<T extends (...args: any[]) => any>(fn: T): T {
  const fnRef = useRef(fn);

  (typeof window !== 'undefined' ? useLayoutEffect : useEffect)(() => {
    fnRef.current = fn;
  }, [fn]);

  return useCallback(
    ((...args: Parameters<T>): ReturnType<T> => {
      return fnRef.current(...args);
    }) as T,
    []
  );
}
