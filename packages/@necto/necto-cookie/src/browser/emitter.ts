/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getOwnerWindow } from '@necto/dom';

import { BROADCAST_CHANNEL_NAME } from '../constants';

import type { Notify, CookieStoreLike, CookieStoreGlobal, CookieChangeEventLike } from '../types';

const listeners: Map<string, Set<Notify>> = new Map();

let channel: BroadcastChannel | null = null;
let stopWatching: (() => void) | null = null;

function getCookieStore(): CookieStoreLike | undefined {
  return (globalThis as CookieStoreGlobal).cookieStore;
}

function getChannel(): BroadcastChannel | null {
  if (channel === null && typeof BroadcastChannel !== 'undefined') {
    channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  }

  return channel;
}

function emit(name: string): void {
  listeners.get(name)?.forEach((notify: Notify): void => notify());
}

function emitAll(): void {
  listeners.forEach((_, name: string): void => emit(name));
}

function startWatching(): () => void {
  const store: CookieStoreLike | undefined = getCookieStore();

  if (store) {
    const onChange = (event: CookieChangeEventLike): void => {
      for (const cookie of [...event.changed, ...event.deleted]) {
        if (cookie.name) {
          emit(cookie.name);
        }
      }
    };

    store.addEventListener('change', onChange);

    return (): void => store.removeEventListener('change', onChange);
  }

  const broadcast: BroadcastChannel | null = getChannel();

  if (broadcast) {
    broadcast.onmessage = (event: MessageEvent): void => emit(String(event.data));
  }

  const win: Window | null = getOwnerWindow(null);

  win?.addEventListener('focus', emitAll);

  return (): void => {
    win?.removeEventListener('focus', emitAll);

    if (channel) {
      channel.close();
      channel = null;
    }
  };
}

export function notify(name: string): void {
  emit(name);

  if (!getCookieStore()) {
    getChannel()?.postMessage(name);
  }
}

export function subscribe(name: string, callback: Notify): () => void {
  let callbacks: Set<Notify> | undefined = listeners.get(name);

  if (!callbacks) {
    callbacks = new Set();
    listeners.set(name, callbacks);
  }

  callbacks.add(callback);

  if (stopWatching === null) {
    stopWatching = startWatching();
  }

  return (): void => {
    callbacks.delete(callback);

    if (callbacks.size === 0) {
      listeners.delete(name);
    }

    if (listeners.size === 0 && stopWatching) {
      stopWatching();
      stopWatching = null;
    }
  };
}
