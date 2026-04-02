/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// biome-ignore-all lint/suspicious/noConfusingVoidType: void is intentional in callback return types.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Store } from './store';

export type Getter = <Value>(state: State<Value>) => Value;

export type Setter = <Value, Args extends unknown[], Result>(
  state: WritableState<Value, Args, Result>,
  ...args: Args
) => Result;

type SetState<Args extends unknown[], Result> = <A extends Args>(
  ...args: A
) => Result;

export type Read<Value, SetSelf = never> = (
  get: Getter,
  options: { readonly signal: AbortSignal; readonly setSelf: SetSelf }
) => Value;

export type Write<Args extends unknown[], Result> = (
  get: Getter,
  set: Setter,
  ...args: Args
) => Result;

export type WithInitialValue<Value> = {
  init: Value;
};

type OnUnmount = () => void;

type OnMount<Args extends unknown[], Result> = <
  S extends SetState<Args, Result>
>(
  setState: S
) => OnUnmount | void;

/** A read-only state unit. */
export interface State<Value> {
  toString: () => string;
  read: Read<Value>;
  debugLabel?: string;
  INTERNAL_onInit?: (store: Store) => void;
}

/** A state unit that can be both read and written to. */
export interface WritableState<Value, Args extends unknown[], Result>
  extends State<Value> {
  read: Read<Value, SetState<Args, unknown>>;
  write: Write<Args, Result>;
  onMount?: OnMount<Args, Result>;
}

export type SetStateAction<Value> = Value | ((prev: Value) => Value);

/** A simple state unit holding a value that can be directly updated. */
export type PrimitiveState<Value> = WritableState<
  Value,
  [SetStateAction<Value>],
  void
>;

export type ExtractStateValue<S> = S extends State<infer Value> ? Value : never;

export type ExtractStateArgs<S> = S extends WritableState<
  unknown,
  infer Args,
  infer _Result
>
  ? Args
  : never;

export type ExtractStateResult<S> = S extends WritableState<
  unknown,
  infer _Args,
  infer Result
>
  ? Result
  : never;
