/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { env } from 'node:process';
import { defineConfig, devices } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: './__tests__',
  testMatch: '**/*.visual.spec.tsx',
  snapshotDir: './__snapshots__',
  timeout: 10 * 1000,
  fullyParallel: true,
  forbidOnly: !!env.CI,
  retries: env.CI ? 2 : 0,
  workers: env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    ctPort: 3100
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
