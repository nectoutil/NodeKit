/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { HTTPMethod, ProgressHandler } from '../types/request';
import type { Hooks } from '../types/hooks';
import type { Schema } from '../types/schema';
import type { IsParameterized, PathParams } from '../types/pathParams';

export type BodyMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type FileBodyMarker = 'file';

export interface RouteDefinition<
  M extends HTTPMethod = HTTPMethod,
  P extends string = string,
  B extends Schema | FileBodyMarker | undefined = undefined,
  Q extends Schema | undefined = undefined,
  R extends Schema | undefined = undefined
> {
  method: M;
  path?: P;
  body?: M extends BodyMethod ? B : never;
  query?: Q;
  response?: R;
  hooks?: Hooks;
  tags?:
    | ReadonlyArray<string>
    | ((params: PathParams<P>) => ReadonlyArray<string>);
  invalidates?:
    | ReadonlyArray<string>
    | ((params: PathParams<P>) => ReadonlyArray<string>);
}

export interface ResourceDefinition<
  TBase extends string = string,
  TRoutes extends Record<string, RouteDefinition> = Record<
    string,
    RouteDefinition
  >
> {
  base: TBase;
  routes: TRoutes;
  hooks?: Hooks;
}

export type Resource<
  TBase extends string = string,
  TRoutes extends Record<string, RouteDefinition> = Record<
    string,
    RouteDefinition
  >
> = ResourceDefinition<TBase, TRoutes>;

export type ResourceMap = Record<string, Resource>;

export type RouteCallArgs<TRoute extends RouteDefinition> = (IsParameterized<
  NonNullable<TRoute['path']>
> extends true
  ? { params: PathParams<NonNullable<TRoute['path']>> }
  : { params?: Record<string, never> }) &
  (TRoute['query'] extends Schema ? { query: unknown } : { query?: never }) &
  (TRoute['body'] extends FileBodyMarker
    ? {
        body: File | FormData | Blob | ArrayBuffer | ReadableStream<Uint8Array>;
      }
    : TRoute['body'] extends Schema
      ? { body: unknown }
      : { body?: never }) & {
    headers?: HeadersInit;
    signal?: AbortSignal;
    onUploadProgress?: ProgressHandler;
    onDownloadProgress?: ProgressHandler;
  };

export type RouteCallReturn<TRoute extends RouteDefinition> =
  TRoute['response'] extends Schema ? Promise<unknown> : Promise<unknown>;

export type CallableResource<TResource extends Resource> = {
  [K in keyof TResource['routes']]: (
    args: RouteCallArgs<TResource['routes'][K]>
  ) => RouteCallReturn<TResource['routes'][K]>;
};

export type ResourceClient<TResources extends ResourceMap> = {
  [K in keyof TResources]: CallableResource<TResources[K]>;
};
