/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getOwnerWindow } from '@necto/dom';
import { useCallback, useState, useEffect } from 'react';

import { useLatestRef } from '../useLatestRef';
import { useEffectEvent } from '../useEffectEvent';
import { useEventListener } from '../useEventListener';

import type { SetStateAction } from 'react';
import type { UseLocalStorageOptions, UseLocalStorageReturn } from './useLocalStorage.types';

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseLocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> {
  const {
    initializeWithValue = true,
    serializer: userSerializer,
    deserializer: userDeserializer
  } = options;

  const initialValueRef = useLatestRef(initialValue);
  const deserializerRef = useLatestRef(userDeserializer);

  const getInitialValue = useCallback(
    (): T => resolveInitialValue(initialValueRef.current),
    [initialValueRef]
  );

  const serializer = useCallback<(value: T) => string>(
    (value) => {
      if (userSerializer) {
        return userSerializer(value);
      }

      return JSON.stringify(value);
    },
    [userSerializer]
  );

  const deserializer = useCallback<(value: string) => T>(
    (value) => {
      const deserialize = deserializerRef.current;

      if (deserialize) {
        return deserialize(value);
      }

      if (value === 'undefined') {
        return undefined as unknown as T;
      }

      try {
        return JSON.parse(value) as T;
      } catch (error) {
        if (__DEV__) {
          throw new TypeError(
            `[necto-react.hooks] NT0201: Error parsing JSON for localStorage key "${key}": ${error}`
          );
        }

        console.warn('[necto-react.hooks] NT0201: https://necto.dev/errors/NT0201');

        return getInitialValue();
      }
    },
    [deserializerRef, key, getInitialValue]
  );

  const readValue = useCallback((): T => {
    const ownerWindow: Window = getOwnerWindow(null);

    if (!ownerWindow) {
      return getInitialValue();
    }

    try {
      const raw: string | null = ownerWindow.localStorage.getItem(key);

      return raw === null ? getInitialValue() : deserializer(raw);
    } catch (error) {
      if (__DEV__) {
        throw new TypeError(
          `[necto-react.hooks] NT0202: Error reading localStorage key "${key}": ${error}`
        );
      }

      console.warn('[necto-react.hooks] NT0202: https://necto.dev/errors/NT0202');

      return getInitialValue();
    }
  }, [key, deserializer, getInitialValue]);

  const [storedValue, setStoredValue] = useState<T>(() =>
    initializeWithValue ? readValue() : getInitialValue()
  );

  const setValue = useEffectEvent((value: SetStateAction<T>): void => {
    const ownerWindow: Window = getOwnerWindow(null);

    if (!ownerWindow) {
      if (__DEV__) {
        throw new TypeError(
          `[necto-react.hooks] NT0203: Attempted to set key "${key}" in a non-client environment.`
        );
      }

      console.warn('[necto-react.hooks] NT0203: https://necto.dev/errors/NT0203');

      return;
    }

    try {
      const newValue: T = value instanceof Function ? value(readValue()) : value;

      ownerWindow.localStorage.setItem(key, serializer(newValue));
      setStoredValue(newValue);

      ownerWindow.dispatchEvent(
        new StorageEvent('necto:local-storage', {
          key
        })
      );
    } catch (error) {
      if (__DEV__) {
        throw new TypeError(
          `[necto-react.hooks] NT0203: Error setting localStorage key "${key}": ${error}`
        );
      }

      console.warn('[necto-react.hooks] NT0203: https://necto.dev/errors/NT0203');
    }
  });

  const removeValue = useEffectEvent((): void => {
    const ownerWindow: Window = getOwnerWindow(null);

    if (!ownerWindow) {
      if (__DEV__) {
        throw new TypeError(
          `[necto-react.hooks] NT0203: Attempted to remove key "${key}" in a non-client environment.`
        );
      }

      console.warn('[necto-react.hooks] NT0203: https://necto.dev/errors/NT0203');

      return;
    }

    try {
      ownerWindow.localStorage.removeItem(key);
    } catch (error) {
      console.warn(
        __DEV__
          ? `[necto-react.hooks] NT0203: Error removing localStorage key "${key}": ${error}`
          : '[necto-react.hooks] NT0203: https://necto.dev/errors/NT0203'
      );
      return;
    }

    setStoredValue(getInitialValue());

    ownerWindow.dispatchEvent(
      new StorageEvent('necto:local-storage', {
        key
      })
    );
  });

  useEffect(() => {
    setStoredValue(readValue());
  }, [key, readValue]);

  const handleStorageChange = useCallback(
    (event: StorageEvent): void => {
      if (event.key && event.key !== key) {
        return;
      }

      setStoredValue(readValue());
    },
    [key, readValue]
  );

  useEventListener('storage', handleStorageChange);
  useEventListener('necto:local-storage', handleStorageChange);

  return [storedValue, setValue, removeValue];
}

// Resolves a value or lazily evaluates its initializer.
function resolveInitialValue<T>(initialValue: T | (() => T)): T {
  return initialValue instanceof Function ? initialValue() : initialValue;
}
