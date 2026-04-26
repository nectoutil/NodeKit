/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type Backoff =
  | 'constant'
  | 'linear'
  | 'exponential'
  | ((attempt: number) => number);

export interface RetryConfig {
  attempts?: number;
  on?: Array<number>;
  methods?: Array<string>;
  backoff?: Backoff;
  baseDelay?: number;
  maxDelay?: number;
  respectRetryAfter?: boolean;
}
