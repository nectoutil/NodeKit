/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { SetStateAction, Store } from '@necto/state';
import type { StateResult } from '../useState';

export type UseLocalStateOptions = {
  store?: Store;
};

/**
 * Result of {@link useLocalState}. Supports two access styles on the same
 * object:
 *
 * - **Tuple destructure** (React-classic): `const [value, setValue] = useLocalState(0)`.
 * - **Signal-style** (named accessors): `const result = useLocalState(0); result.value; result.set(1); result.update(v => v+1); result.reset();`.
 *
 * Both styles read/write the same underlying state — pick whichever reads
 * better at the call site, or mix them in the same component.
 */
export type LocalStateResult<Value> = StateResult<Value> & {
  /** Current value. Equivalent to `result[0]`. */
  value: Value;
  /** Set a new value. Equivalent to `result[1]`. */
  set: (value: Value) => void;
  /** Update via a function of the previous value. */
  update: (updater: (previous: Value) => Value) => void;
  /** Restore the value captured on the hook's first render. */
  reset: () => void;
};
