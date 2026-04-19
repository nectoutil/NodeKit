/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ViteUserConfig } from 'vitest/config';

export default  {
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['lcov', 'text'],
    },
    projects: ['packages/**/vitest.config.*'],
  },
} satisfies ViteUserConfig;
