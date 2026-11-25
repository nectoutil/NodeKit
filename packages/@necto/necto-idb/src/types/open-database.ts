/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export interface OpenDatabaseOptions {
  version?: number;

  /** Runs when the database is created or version increases. */
  upgrade?: (
    database: IDBDatabase,
    oldVersion: number,
    newVersion: number | null,
    transaction: IDBTransaction
  ) => void;

  /** Runs when another connection blocks the upgrade. */
  blocked?: () => void;

  /** Runs when another connection wants to upgrade. */
  blocking?: (database: IDBDatabase) => void;
}
