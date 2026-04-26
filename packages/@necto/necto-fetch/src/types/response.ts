/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  HTTPError,
  NetworkError,
  SchemaError,
  TimeoutError
} from '../errors';

export type FetchError = HTTPError | SchemaError | TimeoutError | NetworkError;

export type FetchTuple<T> =
  | [error: FetchError, data: null]
  | [error: null, data: T];

export interface ResponsePromise<T> extends Promise<T> {
  text(): Promise<string>;
  json<U = T>(): Promise<U>;
  blob(): Promise<Blob>;
  arrayBuffer(): Promise<ArrayBuffer>;
  formData(): Promise<FormData>;
  response: Promise<Response>;
  stream: Promise<ReadableStream<Uint8Array>>;
}
