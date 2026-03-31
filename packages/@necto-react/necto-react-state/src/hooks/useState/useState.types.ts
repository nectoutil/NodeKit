/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { SetStateAction, Store } from '@necto/state';

export type UseStateOptions = {
  store?: Store;
};

export type StateResult<Value> = [
  Awaited<Value>,
  (value: SetStateAction<Value>) => void
] & {
  value: Awaited<Value>;
  set: (value: Value) => void;
  update: (fn: (prev: Value) => Value) => void;
};
