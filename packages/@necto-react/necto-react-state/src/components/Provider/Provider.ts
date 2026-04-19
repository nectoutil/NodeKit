/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createStore } from '@necto/state';
import { createElement, useRef } from 'react';

import type { ReactNode, RefObject, ReactElement } from 'react';
import type { Store } from '@necto/state';

import { StoreContext } from '../../contexts/storeContext';

export function Provider({
  children,
  store
}: {
  children?: ReactNode;
  store?: Store;
}): ReactElement {
  const storeRef: RefObject<Store | null> = useRef<Store>(null);

  if (store)
    return createElement(StoreContext.Provider, { value: store }, children);

  if (storeRef.current === null) storeRef.current = createStore();

  return createElement(
    StoreContext.Provider,
    { value: storeRef.current },
    children
  );
}
