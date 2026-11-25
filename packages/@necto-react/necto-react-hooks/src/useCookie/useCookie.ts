/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { cookies } from '@necto/cookie/browser';
import { useCallback, useMemo, useSyncExternalStore } from 'react';

import { useEffectEvent } from '../useEffectEvent';

import type {
  UseCookieOptions,
  UseCookieReturn,
  UseCookieSetter,
  UseCookieRemover
} from './useCookie.types';

/**
 * React hook that reads, writes and deletes a cookie, and re-renders when it changes
 * in this component, another component or another tab.
 *
 * @template T The type of the parsed cookie value.
 * @template D The type of the default value; when given, the value is never `undefined`.
 * @param {string} name - The cookie name.
 * @param {UseCookieOptions<T, D>} [options] - Default value, attributes, parsing and client options.
 * @returns {UseCookieReturn<T, D>} A `[value, set, remove]` tuple.
 */
export function useCookie<T = string, D extends T | undefined = undefined>(
  name: string,
  options: UseCookieOptions<T, D> = {}
): UseCookieReturn<T, D> {
  const {
    parse,
    serverValue,
    defaultValue,
    client = cookies,
    serialize = String,
    attributes: defaults
  } = options;

  const subscribe = useCallback(
    (onChange: () => void) => client.subscribe(name, onChange),
    [client, name]
  );

  const raw: string | undefined = useSyncExternalStore(
    subscribe,
    (): string | undefined => client.get(name),
    (): string | undefined => serverValue
  );
  const value: D | NonNullable<T> | undefined =
    useMemo(() => {
      return parseValue(raw, parse);
    }, [raw]) ?? defaultValue;

  const set: UseCookieSetter<T> = useEffectEvent((next, attributes) => {
    const resolved =
      typeof next === 'function'
        ? (next as (prev: T | undefined) => T)(parseValue(client.get(name), parse) ?? defaultValue)
        : next;

    client.set(name, serialize(resolved), { ...defaults, ...attributes });
  });

  const remove: UseCookieRemover = useEffectEvent((attributes) => {
    client.delete(name, {
      ...defaults,
      ...attributes
    });
  });

  const update: UseCookieReturn<T, D>['update'] = useEffectEvent((updater, attributes) => {
    set(updater as (prev: T | undefined) => T, attributes);
  });

  return useMemo(
    (): UseCookieReturn<T, D> =>
      Object.assign([value, set, remove], {
        value,
        set,
        update,
        remove
      }) as UseCookieReturn<T, D>,
    [value, set, update, remove]
  );
}

/** Reads a cookie value without letting parse errors throw into the hook. */
function parseValue<T>(raw: string | undefined, parse?: (raw: string) => T): T | undefined {
  if (raw === undefined || !parse) {
    return raw as T | undefined;
  }

  try {
    return parse(raw);
  } catch {
    return undefined;
  }
}
