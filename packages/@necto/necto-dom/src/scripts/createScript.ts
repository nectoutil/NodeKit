/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { cache, getRecords } from './registry';
import { attachLoadListeners } from './attachLoadListeners';
import { adoptExistingScript } from './adoptExistingScript';
import { getScriptKey, normalizeStatus, resolveScriptUrl, setStatus } from './helpers';

import type { ScriptRecord, ScriptDescriptor, ScriptStatus } from '../types';

export function createScript(targetDocument: Document, descriptor: ScriptDescriptor): ScriptRecord {
  const key: string = getScriptKey(targetDocument, descriptor);
  const records: Map<string, ScriptRecord> = getRecords(targetDocument);
  const cached: ScriptRecord | undefined = records.get(key);

  if (cached) {
    return cached;
  }

  const resolvedSrc: string | null = descriptor.src
    ? resolveScriptUrl(targetDocument, descriptor.src)
    : null;

  if (descriptor.src && !resolvedSrc) {
    return cache(records, key, {
      element: targetDocument.createElement('script'),
      status: 'error',
      createdHere: false,
      listeners: new Set()
    });
  }

  const adopted: ScriptRecord | null = adoptExistingScript(targetDocument, key, resolvedSrc);

  if (adopted) {
    cache(records, key, adopted);

    if (adopted.status === 'loading') {
      attachLoadListeners(adopted);
    }

    return adopted;
  }

  const element: HTMLScriptElement = targetDocument.createElement('script');
  element.dataset.nectoScript = key;

  if (resolvedSrc) {
    element.src = resolvedSrc;
    element.async = descriptor.async ?? true;
  } else {
    element.textContent = descriptor.inlineContent ?? '';
  }

  if (descriptor.id) {
    element.id = descriptor.id;
  }

  if (descriptor.type) {
    element.type = descriptor.type;
  }

  if (descriptor.nonce) {
    element.nonce = descriptor.nonce;
  }

  if (descriptor.integrity) {
    element.integrity = descriptor.integrity;
  }

  if (descriptor.crossOrigin) {
    element.crossOrigin = descriptor.crossOrigin;
  }

  if (descriptor.referrerPolicy) {
    element.referrerPolicy = descriptor.referrerPolicy;
  }

  const record: ScriptRecord = cache(records, key, {
    element,
    status: 'loading',
    createdHere: true,
    listeners: new Set()
  });
  const parent: Element | null =
    targetDocument.head ?? targetDocument.body ?? targetDocument.documentElement;

  if (!parent) {
    setStatus(record, 'error');
    return record;
  }

  if (resolvedSrc) {
    attachLoadListeners(record);
    parent.append(element);
    return record;
  }

  parent.append(element);

  const reported: ScriptStatus | null = normalizeStatus(element.dataset.nectoScriptStatus);

  if (reported) {
    setStatus(record, reported);
  } else if (descriptor.type === 'module') {
    attachLoadListeners(record);
  } else {
    setStatus(record, 'ready');
  }

  return record;
}
