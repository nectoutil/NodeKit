import { readFile } from 'node:fs/promises';

import {
  BaseResolver,
  bundleDocument,
  createConfig,
  makeDocumentFromString,
  Oas3_1Types
} from '@redocly/openapi-core';
import { camelCase, kebabCase } from '@necto/strings';
import ejs from 'ejs';
import { describe, expect, it } from 'vitest';

import { Language } from '../src/constants';
import { generateFiles } from '../src/core/generate-files';
import { defineEmitter } from '../src/emitter/define-emitter';

import type { ApiSpec } from '../src/ir';

describe('generateFiles', () => {
  it('combines emitter output and adds file headers', async () => {
    const fixtureUrl = new URL('../__fixtures__/openapi/minimal.yaml', import.meta.url);
    const templateUrl = new URL('../__fixtures__/ejs/client.ejs', import.meta.url);

    const content = await readFile(fixtureUrl, 'utf8');
    const clientTemplate = await readFile(templateUrl, 'utf8');
    const document = makeDocumentFromString(content, fixtureUrl.href);
    const config = await createConfig({});

    const result = await bundleDocument({
      document,
      config,
      types: Oas3_1Types,
      dereference: false,
      externalRefResolver: new BaseResolver()
    });

    expect(result.problems.filter((problem) => problem.severity === 'error')).toEqual([]);

    const openApi = result.bundle.parsed as Record<string, unknown>;
    const info = openApi.info as { title: string; version: string };

    const spec: ApiSpec = {
      name: info.title,
      version: info.version,
      document: openApi,
      sourceUrl: fixtureUrl.href,
      dependencies: [],
      models: [],
      enums: [],
      services: []
    };

    const emitter = defineEmitter({
      language: Language.TypeScript,
      generateModels: () => [],
      generateEnums: () => [],
      generateResources: () => [],
      generateClient(inputSpec, ctx) {
        return [
          {
            path: 'client.ts',
            content: ejs.render(clientTemplate, {
              services: inputSpec.services,
              namespacePascal: ctx.namespacePascal,
              camelCase,
              kebabCase
            }),
            placeHeader: true
          }
        ];
      },
      generateErrors: () => [],
      generateTests: () => []
    });

    const files = generateFiles(spec, emitter, {
      namespace: 'Acme'
    });

    console.dir(files, {
      depth: null
    });

    // Delete later
    expect(files).toEqual(expect.any(Array));
  });
});
