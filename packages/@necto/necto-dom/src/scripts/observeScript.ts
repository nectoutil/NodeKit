/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createScript } from './createScript';

import type { ScriptRecord, ScriptDescriptor } from '../types';

// Injects a script into the document once and subscribes to its status changes.
export function observeScript(
  targetDocument: Document,
  descriptor: ScriptDescriptor,
  listener: () => void
): () => void {
  const record: ScriptRecord = createScript(targetDocument, descriptor);

  record.listeners.add(listener);

  return (): void => {
    record.listeners.delete(listener);
  };
}
