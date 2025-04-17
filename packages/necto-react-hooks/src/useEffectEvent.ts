/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

import { useCallback, useRef, useLayoutEffect} from "react";

export function useEffectEvent<T extends (...args: any[]) => any>(fn: T): T {
  const fnRef = useRef(fn);

  // Inline SSR-safe useLayoutEffect
  (typeof document !== "undefined" ? useLayoutEffect : () => {})(
    () => {
      fnRef.current = fn;
    },
    [fn]
  );

  return useCallback(((...args: Parameters<T>): ReturnType<T> => {
    return fnRef.current(...args);
  }) as T, []);
}