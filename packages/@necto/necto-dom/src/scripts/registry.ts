/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ScriptRecord } from '../types';

const registry: WeakMap<Document, Map<string, ScriptRecord>> = new WeakMap();

export function getRecords(targetDocument: Document): Map<string, ScriptRecord> {
  let records: Map<string, ScriptRecord> | undefined = registry.get(targetDocument);

  if (!records) {
    records = new Map();
    registry.set(targetDocument, records);
  }

  return records;
}

export function cache(
  records: Map<string, ScriptRecord>,
  key: string,
  record: ScriptRecord
): ScriptRecord {
  records.set(key, record);

  return record;
}

export function peekRecord(targetDocument: Document, key: string): ScriptRecord | undefined {
  return registry.get(targetDocument)?.get(key);
}
