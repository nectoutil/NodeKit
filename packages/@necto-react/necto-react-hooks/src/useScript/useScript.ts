/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { getOwnerWindow, getScriptKey, getScriptStatus, observeScript } from '@necto/dom';

import { UseScriptStatusEnum } from './useScript.types';

import type { ScriptDescriptor } from '@necto/dom';
import type { UseScriptOptions, UseScriptStatus } from './useScript.types';

export function useScript(
  src: string | null | undefined,
  options: UseScriptOptions = {}
): UseScriptStatus {
  const {
    id,
    type,
    nonce,
    integrity,
    crossOrigin,
    inlineContent,
    referrerPolicy,
    async = true,
    enabled = true,
    window: targetWindow = getOwnerWindow(null)
  } = options;

  const targetDocument: Document | null = targetWindow?.document ?? null;
  const active: boolean = enabled && Boolean(src || inlineContent) && Boolean(targetDocument);

  const descriptor: ScriptDescriptor = useMemo(
    () => ({
      src,
      id,
      type,
      async,
      nonce,
      integrity,
      crossOrigin,
      inlineContent,
      referrerPolicy
    }),
    [src, inlineContent, id, type, async, nonce, integrity, crossOrigin, referrerPolicy]
  );

  const subscribe = useCallback(
    (onStoreChange: () => void): (() => void) => {
      if (!active || !targetDocument) {
        return (): void => {};
      }

      return observeScript(targetDocument, descriptor, onStoreChange);
    },
    [active, targetDocument, descriptor]
  );

  const getSnapshot = useCallback((): UseScriptStatus => {
    if (!active || !targetDocument) {
      return UseScriptStatusEnum.Idle;
    }

    return getScriptStatus(targetDocument, getScriptKey(targetDocument, descriptor));
  }, [active, targetDocument, descriptor]);

  const getServerSnapshot = useCallback((): UseScriptStatus => UseScriptStatusEnum.Idle, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
