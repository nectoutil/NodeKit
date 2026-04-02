/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface IndexDBIndex {
  readonly name: string | null;
  readonly isPrimaryKey?: boolean;
}

export interface IndexDBTableSchema {
  readonly name: string;
  readonly primaryKey: IndexDBIndex;
}

export interface IndexDBTable {
  readonly name: string;
  readonly schema: IndexDBTableSchema;
}
