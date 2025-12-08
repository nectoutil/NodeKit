/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';

import type { ReactRef } from './types';

/**
 * Sets a ref value, handling both callback refs and ref objects.
 * @param ref - The ref to set.
 * @param value - The value to assign.
 */
function setRef<T>(ref: ReactRef<T>, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

/**
 * Merges multiple refs into a single callback ref.
 * @param refs - Array of refs to merge.
 * @returns A single callback ref that updates all provided refs.
 */
export function useMergeRefs<T>(
  ...refs: ReactRef<T>[]
): React.RefCallback<T> | null {
  return useMemo(() => {
    const filteredRefs = refs.filter(Boolean);

    if (filteredRefs.length === 0) {
      return null;
    }

    if (filteredRefs.length === 1) {
      const ref = filteredRefs[0];
      return (value: T | null) => setRef(ref, value);
    }

    return (value: T | null) => {
      for (const ref of filteredRefs) {
        setRef(ref, value);
      }
    };
  }, refs);
}
