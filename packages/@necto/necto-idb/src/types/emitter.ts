/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type Notify = (key?: IDBValidKey) => void;

/** One subscription. `key` is null when the listener wants every key in its scope. */
export interface Watcher {
  scope: string;
  key: IDBValidKey | null;
  listener: Notify;
}

/** Message sent to other tabs after a write. `key` is omitted when the whole store was cleared. */
export interface IdbChangeMessage {
  scope: string;
  key?: IDBValidKey;
}
