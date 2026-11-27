/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Dispatch, SetStateAction } from 'react';

declare global {
  interface WindowEventMap {
    'necto:local-storage': StorageEvent;
  }
}

export interface UseLocalStorageOptions<T> {
  // Serializer function that runs before storing value.
  serializer?: (value: T) => string;

  // Deserialize function that runs on retrieval.
  deserializer?: (value: string) => T;

  initializeWithValue?: boolean;
}

export type UseLocalStorageReturn<T> = [T, Dispatch<SetStateAction<T>>, () => void];
