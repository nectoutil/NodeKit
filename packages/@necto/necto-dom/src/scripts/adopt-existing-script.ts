/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { normalizeStatus } from './helpers';

import type { ScriptRecord, ScriptStatus } from '../types';

export function adoptExistingScript(
  targetDocument: Document,
  key: string,
  resolvedSrc: string | null
): ScriptRecord | null {
  const existing: HTMLScriptElement | undefined = Array.from(targetDocument.scripts).find(
    (script: HTMLScriptElement): boolean =>
      script.dataset.nectoScript === key || (resolvedSrc !== null && script.src === resolvedSrc)
  );

  if (!existing) {
    return null;
  }

  const reported: ScriptStatus | null = normalizeStatus(existing.dataset.nectoScriptStatus);

  // Modern scripts can report completion with the status marker. Older browsers
  // may expose a readyState even if the load event fired before adoption.
  const readyState = (existing as HTMLScriptElement & { readyState?: string }).readyState;
  const loading = existing.dataset.nectoScriptStatus === 'loading';
  const status =
    reported ??
    (readyState === 'loaded' || readyState === 'complete' || (!resolvedSrc && !loading)
      ? 'ready'
      : 'loading');

  return {
    element: existing,
    createdHere: false,
    listeners: new Set(),
    status
  };
}
