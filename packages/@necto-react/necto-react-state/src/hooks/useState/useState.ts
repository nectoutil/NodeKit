/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  State,
  WritableState,
  PrimitiveState,
  SetStateAction,
  ExtractStateValue,
  ExtractStateArgs,
  ExtractStateResult
} from '@necto/state';

import { useStateValue } from '../useStateValue';
import { useSetState } from '../useSetState';

import type { UseStateOptions } from './useState.types';

type SetState<Args extends unknown[], Result> = (...args: Args) => Result;

/** useState(writableState) — returns [value, setter] */
export function useState<Value, Args extends unknown[], Result>(
  s: WritableState<Value, Args, Result>,
  options?: UseStateOptions
): [Awaited<Value>, SetState<Args, Result>];

/** useState(primitiveState) — returns [value, setter] for a primitive state */
export function useState<Value>(
  s: PrimitiveState<Value>,
  options?: UseStateOptions
): [Awaited<Value>, SetState<[SetStateAction<Value>], void>];

/** useState(readOnlyState) — returns [value, never] for a read-only state */
export function useState<Value>(
  s: State<Value>,
  options?: UseStateOptions
): [Awaited<Value>, never];

/** useState(state) — generic overload */
export function useState<S extends WritableState<unknown, never[], unknown>>(
  s: S,
  options?: UseStateOptions
): [
  Awaited<ExtractStateValue<S>>,
  SetState<ExtractStateArgs<S>, ExtractStateResult<S>>
];

export function useState<Value, Args extends unknown[], Result>(
  s: State<Value> | WritableState<Value, Args, Result>,
  options?: UseStateOptions
) {
  return [
    useStateValue(s, options),
    useSetState(s as WritableState<Value, Args, Result>, options)
  ];
}
