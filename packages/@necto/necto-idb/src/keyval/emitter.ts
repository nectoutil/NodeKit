/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BROADCAST_CHANNEL_NAME } from '../constants';

import type { Notify, Watcher, IdbChangeMessage } from '../types';

const watchers: Set<Watcher> = new Set();

let channel: BroadcastChannel | null = null;

function listen(): BroadcastChannel | null {
  if (!channel && typeof BroadcastChannel !== 'undefined') {
    channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    channel.onmessage = ({ data }: MessageEvent<IdbChangeMessage>): void =>
      deliver(data.scope, data.key);
  }

  return channel;
}

function same(left: IDBValidKey, right: IDBValidKey): boolean {
  try {
    return indexedDB.cmp(left, right) === 0;
  } catch {
    return false;
  }
}

function deliver(scope: string, key?: IDBValidKey): void {
  for (const watcher of watchers) {
    if (watcher.scope !== scope) {
      continue;
    }

    if (key === undefined || watcher.key === null || same(watcher.key, key)) {
      watcher.listener(key);
    }
  }
}

export function notify(scope: string, key?: IDBValidKey): void {
  deliver(scope, key);

  listen()?.postMessage(key === undefined ? { scope } : { scope, key });
}

export function subscribe(scope: string, key: IDBValidKey | null, listener: Notify): () => void {
  const watcher: Watcher = { scope, key, listener };

  watchers.add(watcher);

  listen();

  return (): void => void watchers.delete(watcher);
}
