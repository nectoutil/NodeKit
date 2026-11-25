/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface IdbIndex {
  readonly name: string | null;
  readonly isPrimaryKey?: boolean;
}

export interface IdbTableSchema {
  readonly name: string;
  readonly primaryKey: IdbIndex;
}

export interface IdbTable {
  readonly name: string;
  readonly schema: IdbTableSchema;
}
