/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type ExtractPathParams<P extends string> =
  P extends `${string}{${infer Param}}${infer Rest}`
    ? Param | ExtractPathParams<Rest>
    : never;

export type PathParams<P extends string> =
  ExtractPathParams<P> extends never
    ? Record<string, never>
    : { [K in ExtractPathParams<P>]: string | number };

export type IsParameterized<P extends string> =
  ExtractPathParams<P> extends never ? false : true;
