/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, expect, test } from 'vitest';

// Placeholder while @necto/fetch is in scaffold-only state. The factory and
// classes throw `NOT_IMPLEMENTED` and aren't exercised yet. Remove this file
// (and replace with real tests) once implementation lands.
describe('@necto/fetch (scaffold)', () => {
  test('package boots without runtime errors at import time', async () => {
    const fetchModule = await import('../src');
    expect(fetchModule).toBeDefined();
    expect(typeof fetchModule.create).toBe('function');
    expect(typeof fetchModule.resource).toBe('function');
    expect(typeof fetchModule.HTTPError).toBe('function');
  });
});
