/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useContext } from 'react';
import { getDefaultStore } from '@necto/state';

import { StoreContext } from '../../contexts/storeContext';

import type { Store } from '@necto/state';
import type { UseStoreOptions } from './useStore.types';

export function useStore(options?: UseStoreOptions): Store {
  const contextStore = useContext(StoreContext);
  return options?.store ?? contextStore ?? getDefaultStore();
}
