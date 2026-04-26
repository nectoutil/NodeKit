/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ResponsePromise } from '../types/response';
import type { ClientConfig, RequestOptions } from '../types/request';
import type { ResourceClient, ResourceMap } from '../resource/types';

type CallOptions<TSchema = unknown> = Omit<
  RequestOptions<TSchema>,
  'method' | 'url'
>;

export interface Client {
  readonly config: Readonly<ClientConfig>;
  request<T = unknown>(options: RequestOptions): ResponsePromise<T>;
  get<T = unknown>(url: string, options?: CallOptions): ResponsePromise<T>;
  post<T = unknown>(url: string, options?: CallOptions): ResponsePromise<T>;
  put<T = unknown>(url: string, options?: CallOptions): ResponsePromise<T>;
  patch<T = unknown>(url: string, options?: CallOptions): ResponsePromise<T>;
  delete<T = unknown>(url: string, options?: CallOptions): ResponsePromise<T>;
  head(url: string, options?: CallOptions): ResponsePromise<void>;
  options<T = unknown>(url: string, options?: CallOptions): ResponsePromise<T>;
  extend(config: ClientConfig): Client;
  with(config: ClientConfig): Client;
  resources<TResources extends ResourceMap>(
    map: TResources
  ): Client & ResourceClient<TResources>;
}

export function create(_config?: ClientConfig): Client {
  throw new Error('NOT_IMPLEMENTED');
}
