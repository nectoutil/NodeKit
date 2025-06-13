// biome-ignore-all lint/complexity/useLiteralKeys: Key literals are okay here for React backwards compatibility.
// biome-ignore-all lint/correctness/useHookAtTopLevel: Conditional hook calls OK since it is for backwards compatibility.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isTest } from 'std-env';
import { registry, defaultContext, idsUpdaterMap } from './hookContext';
import React, { useRef, useState, useEffect, useId as useReactId } from 'react';

import type { UseIdProps } from './useId.types';

/**
 * Generates a unique, stable ID for React components, optionally with a custom prefix.
 *
 * @param {UseIdProps} [props] - Optional props object. You can provide a custom prefix and/or a defaultId.
 * @returns {UseIdReturns} The generated or provided unique ID.
 */
export function useId(props?: UseIdProps): string {
  const { prefix = 'necto', defaultId } = props || {};

  // Initialize state only once with a function to avoid unnecessary calculations
  const [_, setValue] = useState<string | undefined>(() => defaultId);
  const nextIdRef = useRef<string | null>(null);
  const cleanupRef = useRef<object>({});

  const id = (() => {
    if (defaultId) return defaultId;
    const reactId =
      typeof React['useId'] === 'function'
        ? useReactId()
        : String(++defaultContext.current);
    const computedPrefix = isTest
      ? prefix
      : `${prefix}${defaultContext.prefix}`;
    return `${computedPrefix}-${reactId}`;
  })();

  useEffect(() => {
    if (typeof window !== 'undefined' && !!window.document?.createElement) {
      const cachedRefs = idsUpdaterMap.get(id) || [];
      const nextIdWrapper = { current: nextIdRef.current };

      if (!cachedRefs.some((ref) => ref === nextIdWrapper)) {
        idsUpdaterMap.set(id, [...cachedRefs, nextIdWrapper]);
      }
    }

    if (registry) {
      registry.register(cleanupRef.current, id);
    }

    return () => {
      if (registry) {
        registry.unregister(cleanupRef.current);
      }
      idsUpdaterMap.delete(id);
    };
  }, [id]);

  useEffect(() => {
    const newId = nextIdRef.current;
    if (newId) {
      setValue(newId);
      nextIdRef.current = null;
    }
  }, []);

  return id;
}
