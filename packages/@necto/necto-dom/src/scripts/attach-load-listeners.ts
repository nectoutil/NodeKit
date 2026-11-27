/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { setStatus } from './helpers';

import type { ScriptRecord } from '../types';

export function attachLoadListeners(record: ScriptRecord): void {
  record.element.addEventListener('load', () => setStatus(record, 'ready'), {
    once: true
  });

  record.element.addEventListener(
    'error',
    () => {
      if (record.createdHere) {
        record.element.remove();
      }

      setStatus(record, 'error');
    },
    {
      once: true
    }
  );
}
