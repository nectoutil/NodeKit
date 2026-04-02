/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useLayoutEffect } from 'react';

import type { RefObject } from 'react';

export function useLatestRef<T>(value: T): React.RefObject<T> {
  const ref: RefObject<T> = useRef(value);
  useLayoutEffect((): void => {
    ref.current = value;
  });
  return ref;
}
