/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useState, useCallback, useEffect } from 'react';

import type { RefObject } from 'react';
import type { UseMountedOptions, UseMountedReturn, MountedAccessType } from './useMounted.types';

/**
 * React hook that tracks whether a component is mounted.
 *
 * @template T The type of access to the mounted state (function, ref, or boolean).
 * @param {UseMountedOptions & { type: T }} [options] - Options to configure the hook behavior.
 * @returns {UseMountedReturn<T>} The mounted state in the requested format.
 */
export function useMounted<T extends MountedAccessType = 'boolean'>(
  options: UseMountedOptions & { type?: T } = {}
): UseMountedReturn<T> {
  const { defer = false, type = 'boolean' } = options;

  const [mountedState, setMountedState] = useState(false);
  const mountedRef: RefObject<boolean> = useRef<boolean>(false);

  const get = useCallback((): boolean => mountedRef.current, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const mount = (): void => {
      mountedRef.current = true;
      setMountedState(true);
    };

    if (defer) {
      timeout = setTimeout(mount);
    } else {
      mount();
    }

    return (): void => {
      clearTimeout(timeout);

      mountedRef.current = false;
      setMountedState(false);
    };
  }, [defer]);

  if (type === 'ref') {
    return mountedRef as UseMountedReturn<T>;
  }

  if (type === 'function') {
    return get as UseMountedReturn<T>;
  }

  return mountedState as UseMountedReturn<T>;
}
