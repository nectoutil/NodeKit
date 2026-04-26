/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { RequestOptions } from './types/request';
import type { ResponsePromise } from './types/response';

type InlineOptions<TSchema = unknown> = Omit<
  RequestOptions<TSchema>,
  'method' | 'url'
>;

export function fetch<T = unknown>(
  _url: string,
  _options?: RequestOptions
): ResponsePromise<T> {
  throw new Error('NOT_IMPLEMENTED');
}

export function get<T = unknown>(
  _url: string,
  _options?: InlineOptions
): ResponsePromise<T> {
  throw new Error('NOT_IMPLEMENTED');
}

export function post<T = unknown>(
  _url: string,
  _options?: InlineOptions
): ResponsePromise<T> {
  throw new Error('NOT_IMPLEMENTED');
}

export function put<T = unknown>(
  _url: string,
  _options?: InlineOptions
): ResponsePromise<T> {
  throw new Error('NOT_IMPLEMENTED');
}

export function patch<T = unknown>(
  _url: string,
  _options?: InlineOptions
): ResponsePromise<T> {
  throw new Error('NOT_IMPLEMENTED');
}

export function del<T = unknown>(
  _url: string,
  _options?: InlineOptions
): ResponsePromise<T> {
  throw new Error('NOT_IMPLEMENTED');
}

export { del as delete };

export function head(
  _url: string,
  _options?: InlineOptions
): ResponsePromise<void> {
  throw new Error('NOT_IMPLEMENTED');
}

export function options<T = unknown>(
  _url: string,
  _options?: InlineOptions
): ResponsePromise<T> {
  throw new Error('NOT_IMPLEMENTED');
}
