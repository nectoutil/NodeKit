/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { SetStateAction, Store } from '@necto/state';

export type UseLocalStateOptions = {
  store?: Store;
};

export type LocalStateResult<Value> = [
  Value,
  (value: SetStateAction<Value>) => void
] & {
  value: Value;
  set: (value: Value) => void;
  update: (fn: (prev: Value) => Value) => void;
  reset: () => void;
};
