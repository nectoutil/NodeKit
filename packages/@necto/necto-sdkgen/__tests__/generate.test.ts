import { readFile } from 'node:fs/promises';

import {
  BaseResolver,
  bundleDocument,
  createConfig,
  makeDocumentFromString,
  Oas3_1Types
} from '@redocly/openapi-core';
import { describe, expect, it } from 'vitest';

import { generate } from '../src/core/generate';

describe('generateClient', () => {
  it('accepts a minimal OpenAPI document', async () => {
    const fixtureUrl = new URL('../__fixtures__/openapi/minimal.yaml', import.meta.url);
    const content = await readFile(fixtureUrl, 'utf8');
    const document = makeDocumentFromString(content, fixtureUrl.href);
    const config = await createConfig({});

    const result = await bundleDocument({
      document,
      config,
      types: Oas3_1Types,
      dereference: false,
      externalRefResolver: new BaseResolver(),
    });

    expect(result.problems.filter((problem) => problem.severity === 'error')).toEqual([]);

    await expect(
      generate({
        spec: result.bundle.parsed,
        options: {
          dryRun: false
        }
      })
    ).resolves.toEqual([]);
  });
});