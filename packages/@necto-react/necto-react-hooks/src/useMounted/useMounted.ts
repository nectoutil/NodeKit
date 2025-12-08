/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef, useState, useCallback, useEffect } from 'react';

import type {
  UseMountedOptions,
  UseMountedReturn,
  MountedAccessType
} from './useMounted.types';

/**
 * React hook that tracks whether a component is mounted.
 *
 * @template T The type of access to the mounted state (function, ref, or boolean).
 * @param {UseMountedOptions & { type: T }} [options] - Options to configure the hook behavior.
 * @returns {UseMountedReturn<T>} The mounted state in the requested format.
 */
export function useMounted<T extends MountedAccessType = 'function'>(
  options: UseMountedOptions & { type: T } = {} as UseMountedOptions & {
    type: T;
  }
): UseMountedReturn<T> {
  const { type = 'function' } = options;

  const mountedRef = useRef<boolean>(false);
  const [mountedState, setMountedState] = useState(false);
  const get = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;
    setMountedState(true);

    return () => {
      mountedRef.current = false;
      setMountedState(false);
    };
  }, []);

  if (type === 'ref') return mountedRef as UseMountedReturn<T>;
  if (type === 'boolean') return mountedState as UseMountedReturn<T>;

  return get as UseMountedReturn<T>;
}
