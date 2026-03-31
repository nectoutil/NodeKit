/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, createElement, useContext, useRef } from 'react';

import type { ReactElement, ReactNode } from 'react';
import type { Store } from '@necto/state';

import { createStore, getDefaultStore } from '@necto/state';

const StoreContext = createContext<Store | undefined>(undefined);

type UseStoreOptions = {
  store?: Store;
};

export function useStore(options?: UseStoreOptions): Store {
  const store = useContext(StoreContext);
  return options?.store || store || getDefaultStore();
}

export function Provider({
  children,
  store
}: {
  children?: ReactNode;
  store?: Store;
}): ReactElement {
  const storeRef = useRef<Store>(null);
  if (store) {
    return createElement(StoreContext.Provider, { value: store }, children);
  }
  if (storeRef.current === null) {
    storeRef.current = createStore();
  }
  return createElement(
    StoreContext.Provider,
    { value: storeRef.current },
    children
  );
}
