/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { CookieClient, CookieAttributes, CookieDeleteAttributes } from '@necto/cookie/browser';

export type UseCookieSetter<T> = (
  value: T | ((prev: T | undefined) => T),
  attributes?: CookieAttributes
) => void;

export type UseCookieRemover = (attributes?: CookieDeleteAttributes) => void;

export type UseCookieValue<T, D extends T | undefined = undefined> = undefined extends D
  ? T | undefined
  : T;

export interface UseCookieOptions<T = string, D extends T | undefined = T | undefined> {
  defaultValue?: D;

  attributes?: CookieAttributes;

  serverValue?: string;

  client?: CookieClient;

  parse?: (raw: string) => T;

  serialize?: (value: T) => string;
}

export type UseCookieReturn<T, D extends T | undefined = undefined> = [
  value: UseCookieValue<T, D>,
  set: UseCookieSetter<T>,
  remove: UseCookieRemover
] & {
  value: UseCookieValue<T, D>;

  set: UseCookieSetter<T>;

  remove: UseCookieRemover;

  update: (updater: (prev: UseCookieValue<T, D>) => T, attributes?: CookieAttributes) => void;
};
