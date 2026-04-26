/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export {
  fetch,
  get,
  post,
  put,
  patch,
  del,
  delete as deleteFn,
  head,
  options
} from './inline';

export { create } from './client';
export type { Client } from './client';

export { resource } from './resource';

export { HTTPError, SchemaError, TimeoutError, NetworkError } from './errors';

export type {
  HTTPMethod,
  ErrorMode,
  AuthBuilder,
  RequestBody,
  ProgressEvent,
  ProgressHandler,
  ResponseParser,
  RequestOptions,
  ClientConfig,
  ResponsePromise,
  FetchError,
  FetchTuple,
  Hooks,
  RequestContext,
  RetryContext,
  Backoff,
  RetryConfig,
  Schema,
  SchemaAdapter,
  SchemaParseResult,
  ExtractPathParams,
  PathParams,
  IsParameterized
} from './types';

export type {
  BodyMethod,
  FileBodyMarker,
  RouteDefinition,
  ResourceDefinition,
  Resource,
  ResourceMap,
  RouteCallArgs,
  RouteCallReturn,
  CallableResource,
  ResourceClient
} from './resource';
