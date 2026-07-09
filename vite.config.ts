/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['lcov', 'text']
    },
    projects: ['packages/**/vite.config.*']
  },
  lint: {
    ignorePatterns: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/__tests__/**',
      'packages/@necto/necto-color/**'
    ],
    rules: {
      'react-hooks/rules-of-hooks': ['off']
    }
  },
  fmt: {
    semi: true,
    singleQuote: true,
    trailingComma: 'none',
    jsxSingleQuote: false,
    arrowParens: 'always',
    ignorePatterns: [
      '**/*.yml',
      '**/*.json',
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',

      // Will be removed once stable
      'packages/@necto/necto-color/**'
    ]
  },
  staged: {
    '**/package.json': 'pnpm install --frozen-lockfile --ignore-scripts',
    '*.{js,ts,tsx,vue}': 'vp check --fix',
    '**/*.md': 'pnpm exec markdownlint --ignore .changeset',
    '**/*.{yml,yaml}': 'pnpm exec yamllint'
  }
});
