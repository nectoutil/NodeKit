/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

import { isTest } from 'std-env';
import React, { useRef, useState, useEffect, useId as useReactId } from "react";

const defaultContext = {
  prefix: String(Math.round(Math.random() * 1e10)),
  current: 0,
};
export const idsUpdaterMap = new Map<string, { current: string | null }[]>();

// FinalizationRegistry for cleaning up unused IDs
const registry =
  typeof FinalizationRegistry !== "undefined"
    ? new FinalizationRegistry<string>((id) => {
        idsUpdaterMap.delete(id);
      })
    : null;

// Helper function to generate IDs
function useNectoSafeId(defaultId?: string, customPrefix: string = "necto"): string {
  const id = typeof React.useId === "function" ? useReactId() : String(++defaultContext.current);
  const prefix = isTest ? customPrefix : `${customPrefix}${defaultContext.prefix}`;
  return defaultId || `${prefix}-${id}`;
}

/**
 * Generates a unique ID, optionally with a custom prefix.
 * @param prefix - Custom prefix for the ID (defaults to "necto").
 * @param defaultId - Default component ID.
 */
export function useId(prefix: string = "necto", defaultId?: string): string {
  // Initialize state only once with a function to avoid unnecessary calculations
  const [value, setValue] = useState<string | undefined>(() => defaultId);
  const nextIdRef = useRef<string | null>(null);
  const cleanupRef = useRef<object>({});

  // Generate the ID - memoize this if it's expensive
  const id = useNectoSafeId(value, prefix);

  // Update the idsUpdaterMap for tracking - this can be combined with the cleanup effect
  useEffect(() => {
    if (typeof window !== "undefined" && !!window.document?.createElement) {
      const cachedRefs = idsUpdaterMap.get(id) || [];
      const nextIdWrapper = { current: nextIdRef.current };

      if (!cachedRefs.some(ref => ref === nextIdWrapper)) {
        idsUpdaterMap.set(id, [...cachedRefs, nextIdWrapper]);
      }
    }

    // Register with FinalizationRegistry
    if (registry) {
      registry.register(cleanupRef.current, id);
    }

    // Cleanup function
    return () => {
      if (registry) {
        registry.unregister(cleanupRef.current);
      }
      idsUpdaterMap.delete(id);
    };
  }, [id]);

  // Handle updates to the ID - this can be simplified
  useEffect(() => {
    const newId = nextIdRef.current;
    if (newId) {
      setValue(newId);
      nextIdRef.current = null;
    }
  }, []);

  return id;
}

/**
 * Merges two IDs. Different IDs will trigger a side-effect and re-render components hooked up with `useId`.
 * @param idA - First ID.
 * @param idB - Second ID.
 * @returns The merged ID.
 */
export function mergeIds(idA: string, idB: string): string {
  if (idA === idB) {
    return idA;
  }

  const setIdsA = idsUpdaterMap.get(idA);
  if (setIdsA?.length) {
    setIdsA.forEach((ref) => (ref.current = idB));
    return idB;
  }

  const setIdsB = idsUpdaterMap.get(idB);
  if (setIdsB?.length) {
    setIdsB.forEach((ref) => (ref.current = idA));
    return idA;
  }

  return idB;
}