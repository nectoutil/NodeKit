// biome-ignore-all assist/source/organizeImports: No need to organize exports here.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Ref, RefObject } from 'react';

/**
 * Assigns a value to a React ref, supporting both callback refs and ref objects.
 *
 * If the ref is a function, it calls the function with the value.
 * If the ref is an object, it sets the `current` property to the value.
 *
 * @template T The type of the ref value.
 * @param {Ref<T> | RefObject<T> | null | undefined} ref - The ref to assign the value to.
 * @param {T} value - The value to assign to the ref.
 * @returns {any} The result of the callback ref, if applicable.
 */
function setRef<T>(ref: Ref<T> | RefObject<T> | null | undefined, value: T) {
  if (typeof ref === 'function') return ref(value);
  if (ref != null) ref.current = value;
}

/**
 * Merges multiple React refs into a single ref callback.
 *
 * Useful when you need to assign a value to multiple refs (e.g., both a forwarded ref and a local ref).
 * If any of the refs return a cleanup function, the merged ref will return a cleanup function that calls all cleanups.
 *
 * @template T The type of the ref value.
 * @param {...Array<Ref<T> | RefObject<T> | null | undefined>} refs - The refs to merge.
 * @returns {Ref<T>} A single ref callback that updates all provided refs and handles cleanup if necessary.
 */
export function mergeRefs<T>(
  ...refs: Array<Ref<T> | RefObject<T> | null | undefined>
): Ref<T> {
  if (refs.length === 1 && refs[0]) {
    return refs[0];
  }

  return (value: T | null) => {
    let hasCleanup = false;

    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, value);
      hasCleanup ||= typeof cleanup === 'function';
      return cleanup;
    });

    if (hasCleanup) {
      return () => {
        cleanups.forEach((cleanup, i) => {
          if (typeof cleanup === 'function') {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        });
      };
    }
  };
}
