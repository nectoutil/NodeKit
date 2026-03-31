/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { State, WritableState } from './state';

type AnyValue = unknown;
type AnyState = State<AnyValue>;

export type Store = {
  get: <Value>(state: State<Value>) => Value;
  set: <Value, Args extends unknown[], Result>(
    state: WritableState<Value, Args, Result>,
    ...args: Args
  ) => Result;
  sub: (state: AnyState, listener: () => void) => () => void;
};

export type EpochNumber = number;

export type StateRecord<Value = AnyValue> = {
  /** Map of dependencies to their epoch numbers. */
  readonly dependencies: Map<AnyState, EpochNumber>;
  /** Set of states with pending promises that depend on this state. */
  readonly pendingPromises: Set<AnyState>;
  /** The epoch number — incremented each time the value changes. */
  epoch: EpochNumber;
  /** The store epoch number that last validated this state. */
  validatedEpoch?: EpochNumber;
  /** The current value. */
  value?: Value;
  /** The current error, if the state errored. */
  error?: unknown;
};

export type Mounted = {
  /** Set of listener callbacks invoked when the value changes. */
  readonly listeners: Set<() => void>;
  /** Set of mounted states that this state depends on. */
  readonly dependencies: Set<AnyState>;
  /** Set of mounted states that depend on this state. */
  readonly dependents: Set<AnyState>;
  /** Cleanup function to run when the state is unmounted. */
  unmount?: () => void;
};
