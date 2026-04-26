/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ClientConfig } from '../types/request';
import type { FetchTuple } from '../types/response';

export interface OpenApiPathsBase {
  [path: string]: {
    [method in
      | 'get'
      | 'put'
      | 'post'
      | 'delete'
      | 'options'
      | 'head'
      | 'patch'
      | 'trace']?: {
      parameters?: {
        path?: Record<string, unknown>;
        query?: Record<string, unknown>;
      };
      requestBody?: { content?: { 'application/json'?: unknown } };
      responses?: Record<
        string,
        { content?: { 'application/json'?: unknown } }
      >;
    };
  };
}

export type OpenApiOperation<
  TPaths,
  P extends keyof TPaths,
  M extends keyof TPaths[P]
> = TPaths[P][M];

export interface OpenApiClient<TPaths extends OpenApiPathsBase> {
  GET: <P extends keyof TPaths & string>(
    path: P,
    init?: unknown
  ) => Promise<FetchTuple<unknown>>;
  POST: <P extends keyof TPaths & string>(
    path: P,
    init?: unknown
  ) => Promise<FetchTuple<unknown>>;
  PUT: <P extends keyof TPaths & string>(
    path: P,
    init?: unknown
  ) => Promise<FetchTuple<unknown>>;
  PATCH: <P extends keyof TPaths & string>(
    path: P,
    init?: unknown
  ) => Promise<FetchTuple<unknown>>;
  DELETE: <P extends keyof TPaths & string>(
    path: P,
    init?: unknown
  ) => Promise<FetchTuple<unknown>>;
  HEAD: <P extends keyof TPaths & string>(
    path: P,
    init?: unknown
  ) => Promise<FetchTuple<unknown>>;
  OPTIONS: <P extends keyof TPaths & string>(
    path: P,
    init?: unknown
  ) => Promise<FetchTuple<unknown>>;
  TRACE: <P extends keyof TPaths & string>(
    path: P,
    init?: unknown
  ) => Promise<FetchTuple<unknown>>;
}

export type OpenApiClientConfig = ClientConfig;
