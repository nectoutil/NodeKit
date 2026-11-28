/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { peekRecord } from './registry';

import type { ScriptRecord, ScriptDescriptor, ScriptStatus } from '../types';

export function resolveScriptUrl(targetDocument: Document, src: string): string | null {
  try {
    return new URL(src, targetDocument.baseURI).href;
  } catch {
    return null;
  }
}

export function getScriptKey(targetDocument: Document, descriptor: ScriptDescriptor): string {
  if (descriptor.src) {
    return `src:${resolveScriptUrl(targetDocument, descriptor.src) ?? descriptor.src}`;
  }

  return `inline:${descriptor.id ?? descriptor.inlineContent ?? ''}`;
}

export function getScriptStatus(targetDocument: Document, key: string): ScriptStatus {
  return peekRecord(targetDocument, key)?.status ?? 'loading';
}

export function normalizeStatus(value: string | undefined): ScriptStatus | null {
  return value === 'ready' || value === 'error' ? value : null;
}

export function setStatus(record: ScriptRecord, status: ScriptStatus): void {
  record.status = status;

  if (record.element.isConnected) {
    record.element.dataset.nectoScriptStatus = status;
  }

  for (const listener of record.listeners) {
    listener();
  }
}
