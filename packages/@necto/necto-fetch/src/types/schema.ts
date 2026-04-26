/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type SchemaParseResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      issues: ReadonlyArray<{
        path?: ReadonlyArray<string | number>;
        message: string;
      }>;
    };

export interface SchemaAdapter {
  parse<T>(
    schema: unknown,
    value: unknown
  ): SchemaParseResult<T> | Promise<SchemaParseResult<T>>;
}

export type Schema = unknown;
