/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { generateFiles } from './generate-files';

import type { ApiSpec } from '../ir';
import type { Emitter } from '../emitter';
import type { GeneratedFile } from './types';

export async function generate(
  spec: ApiSpec,
  emitter: Emitter,
  options: {
    namespace: string;
    outDir?: string;
    dryRun?: boolean;
  }
): Promise<GeneratedFile[]> {
  const { dryRun, outDir, namespace } = options;

  const files = generateFiles(spec, emitter, {
    namespace
  });

  return [];
}
