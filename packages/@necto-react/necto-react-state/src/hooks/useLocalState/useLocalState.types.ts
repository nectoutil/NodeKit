/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Store } from '@necto/state';
import type { StateResult } from '../useState';

export type UseLocalStateOptions = {
  store?: Store;
};

export type LocalStateResult<Value> = StateResult<Value> & {
  reset: () => void;
};
