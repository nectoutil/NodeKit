/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

import { isTest } from 'std-env';
import React, { useRef, useState, useEffect, useId as useReactId } from 'react';

const defaultContext = {
  prefix: String(Math.round(Math.random() * 1e10)),
  current: 0,
};

const idsUpdaterMap = new Map<string, { current: string | null }[]>();

// FinalizationRegistry for cleaning up unused IDs
const registry =
  typeof FinalizationRegistry !== "undefined"
    ? new FinalizationRegistry<string>((id) => {
        idsUpdaterMap.delete(id);
      })
    : null;

/**
 * Generates a unique, stable ID for React components, optionally with a custom prefix.
 *
 * @param {string} [prefix="necto"] - Custom prefix for the generated ID.
 * @param {string} [defaultId] - Optional default ID to use instead of generating one.
 * @returns {string} The generated or provided unique ID.
 */
function useId(prefix: string = "necto", defaultId?: string): string {
  // Initialize state only once with a function to avoid unnecessary calculations
  const [value, setValue] = useState<string | undefined>(() => defaultId);
  const nextIdRef = useRef<string | null>(null);
  const cleanupRef = useRef<object>({});

  const id = (() => {
    if (defaultId) return defaultId;
    const reactId = typeof React['useId'] === "function" ? useReactId() : String(++defaultContext.current);
    const computedPrefix = isTest ? prefix : `${prefix}${defaultContext.prefix}`;
    return `${computedPrefix}-${reactId}`;
  })();

  useEffect(() => {
    if (typeof window !== "undefined" && !!window.document?.createElement) {
      const cachedRefs = idsUpdaterMap.get(id) || [];
      const nextIdWrapper = { current: nextIdRef.current };

      if (!cachedRefs.some(ref => ref === nextIdWrapper)) {
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

export { useId };