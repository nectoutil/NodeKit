/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// biome-ignore-all lint/style/useTemplate: String concatenation is intentional here.

import type {
  Getter,
  PrimitiveState,
  Read,
  SetStateAction,
  Setter,
  State,
  WithInitialValue,
  Write,
  WritableState
} from './types';

let keyCount: number = 0;

/** state(initialValue) — primitive state holding a value */
export function state<Value>(
  initialValue: Value
): PrimitiveState<Value> & WithInitialValue<Value>;

/** state() — primitive state initialized as undefined */
export function state<Value>(): PrimitiveState<Value | undefined> &
  WithInitialValue<Value | undefined>;

/** state(read) — derived read-only state */
export function state<Value>(read: Read<Value>): State<Value>;

/** state(read, write) — derived state with custom read and write */
export function state<Value, Args extends unknown[], Result>(
  read: Read<Value, (...args: Args) => unknown>,
  write: Write<Args, Result>
): WritableState<Value, Args, Result>;

/** state(initialValue, write) — writable state with initial value and custom write */
export function state<Value, Args extends unknown[], Result>(
  initialValue: Value,
  write: Write<Args, Result>
): WritableState<Value, Args, Result> & WithInitialValue<Value>;

export function state<Value, Args extends unknown[], Result>(
  read?: Value | Read<Value, (...args: Args) => unknown>,
  write?: Write<Args, Result>
) {
  const key: string = `necto-state${keyCount++}`;

  const config = {
    toString() {
      return this.debugLabel ? key + ':' + this.debugLabel : key;
    }
  } as WritableState<Value, Args, Result> & { init?: Value | undefined };

  if (typeof read === 'function') {
    config.read = read as Read<Value, (...args: Args) => unknown>;
  } else {
    config.init = read;
    config.read = defaultRead;
    config.write = defaultWrite as unknown as Write<Args, Result>;
  }

  if (write) {
    config.write = write;
  }

  return config;
}

function defaultRead<Value>(this: State<Value>, get: Getter) {
  return get(this);
}

function defaultWrite<Value>(
  this: PrimitiveState<Value>,
  get: Getter,
  set: Setter,
  arg: SetStateAction<Value>
) {
  return set(
    this,
    typeof arg === 'function' ? (arg as (prev: Value) => Value)(get(this)) : arg
  );
}
