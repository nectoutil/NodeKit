/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Hooks } from './hooks';
import type { RetryConfig } from './retry';
import type { SchemaAdapter } from './schema';

export type HTTPMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

export type ErrorMode = 'throw' | 'tuple';

export type AuthBuilder = () =>
  | string
  | null
  | undefined
  | Promise<string | null | undefined>;

export type RequestBody =
  | Record<string, unknown>
  | Array<unknown>
  | string
  | number
  | boolean
  | null
  | FormData
  | URLSearchParams
  | Blob
  | File
  | ArrayBuffer
  | ReadableStream<Uint8Array>;

export interface ProgressEvent {
  loaded: number;
  total: number;
  ratio: number;
}

export type ProgressHandler = (event: ProgressEvent) => void;

export type ResponseParser =
  | 'json'
  | 'text'
  | 'blob'
  | 'arrayBuffer'
  | 'formData'
  | 'response'
  | 'stream';

export interface RequestOptions<TSchema = unknown> {
  method?: HTTPMethod;
  url?: string;
  body?: RequestBody;
  query?: Record<
    string,
    | string
    | number
    | boolean
    | null
    | undefined
    | Array<string | number | boolean>
  >;
  headers?: HeadersInit;
  timeout?: number;
  retry?: RetryConfig | false;
  schema?: TSchema;
  schemaAdapter?: SchemaAdapter;
  errorMode?: ErrorMode;
  hooks?: Hooks;
  signal?: AbortSignal;
  onUploadProgress?: ProgressHandler;
  onDownloadProgress?: ProgressHandler;
  parser?: ResponseParser;
}

export interface ClientConfig {
  baseUrl?: string;
  headers?: HeadersInit;
  auth?: AuthBuilder;
  retry?: RetryConfig | false;
  timeout?: number;
  hooks?: Hooks;
  errorMode?: ErrorMode;
  parser?: ResponseParser;
  schemaAdapter?: SchemaAdapter;
  fetch?: typeof globalThis.fetch;
}
