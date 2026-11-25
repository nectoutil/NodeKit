/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type KeyValListener<T> = (value: T | undefined) => void;

export interface KeyValStoreOptions {
  /** Database name, defaults to `keyval`. */
  database?: string;

  /** Object store name, defaults to `keyval`. */
  store?: string;

  prefix?: string | false;
}
