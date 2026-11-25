/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BROADCAST_CHANNEL_NAME } from '../constants';

import type { Notify, IdbChangeMessage } from '../types';

const ALL_KEYS: string = '*';

const scopes: Map<string, Map<string, Set<Notify>>> = new Map();

let channel: BroadcastChannel | null = null;

function toKeyId(key: IDBValidKey): string {
  if (typeof key === 'string') {
    return `s${key}`;
  }

  if (typeof key === 'number') {
    return `n${key}`;
  }

  if (key instanceof Date) {
    return `d${key.getTime()}`;
  }

  if (Array.isArray(key)) {
    return `[${key.map(toKeyId).join(',')}]`;
  }

  const bytes: Uint8Array = ArrayBuffer.isView(key)
    ? new Uint8Array(key.buffer, key.byteOffset, key.byteLength)
    : new Uint8Array(key);

  return `b${bytes.join(',')}`;
}

function getChannel(): BroadcastChannel | null {
  if (channel === null && typeof BroadcastChannel !== 'undefined') {
    channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    channel.onmessage = ({ data }: MessageEvent<IdbChangeMessage>): void =>
      emit(data.scope, data.key);
  }

  return channel;
}

function emit(scope: string, key?: IDBValidKey): void {
  const keys = scopes.get(scope);

  // No key means the store was cleared, which affects every subscriber.
  if (key === undefined) {
    keys?.forEach((callbacks) => callbacks.forEach((callback) => callback()));
    return;
  }

  keys?.get(toKeyId(key))?.forEach((callback) => callback());
  keys?.get(ALL_KEYS)?.forEach((callback) => callback());
}

export function notify(scope: string, key?: IDBValidKey): void {
  emit(scope, key);
  getChannel()?.postMessage(key === undefined ? { scope } : { scope, key });
}

export function subscribe(scope: string, key: IDBValidKey | null, callback: Notify): () => void {
  const id: string = key === null ? ALL_KEYS : toKeyId(key);

  const keys = scopes.get(scope) ?? new Map<string, Set<Notify>>();
  const callbacks = keys.get(id) ?? new Set<Notify>();

  callbacks.add(callback);
  keys.set(id, callbacks);
  scopes.set(scope, keys);

  // Opening the channel starts listening for writes from other tabs.
  getChannel();

  return (): void => {
    callbacks.delete(callback);

    if (callbacks.size === 0) {
      keys.delete(id);
    }

    if (keys.size === 0) {
      scopes.delete(scope);
    }

    if (scopes.size === 0 && channel) {
      channel.close();
      channel = null;
    }
  };
}
