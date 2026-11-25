/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/** Minimal shape of the Cookie Store API (`window.cookieStore`), which is not in every TS DOM lib yet. */
export interface CookieStoreLike {
  addEventListener(type: 'change', listener: (event: CookieChangeEventLike) => void): void;
  removeEventListener(type: 'change', listener: (event: CookieChangeEventLike) => void): void;
}

export interface CookieChangeEventLike {
  changed: ReadonlyArray<{ name?: string }>;
  deleted: ReadonlyArray<{ name?: string }>;
}

/** `globalThis` with the optional Cookie Store API. */
export interface CookieStoreGlobal {
  cookieStore?: CookieStoreLike;
}
