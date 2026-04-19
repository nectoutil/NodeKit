/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Crypto } from '@peculiar/webcrypto';

Object.defineProperty(globalThis, 'crypto', {
  value: new Crypto(),
  writable: true,
  configurable: true
});
