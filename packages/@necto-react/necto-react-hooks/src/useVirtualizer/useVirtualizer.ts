/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useRef, useReducer } from 'react';

import type { RefObject } from 'react';

export function useVirtualizer() {
  const dispatch = useReducer((x: number) => x + 1, 0)[1];

  const render = useRef(dispatch).current;

  const directRef = useRef({});
}
