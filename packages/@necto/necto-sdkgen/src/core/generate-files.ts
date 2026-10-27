/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { defaultFileHeader } from '../constants';
import { buildEmitterContext } from '../emitter';

import type { ApiSpec } from '../ir';
import type { Emitter, EmitterContext } from '../emitter';

export function generateFiles(
  spec: ApiSpec,
  emitter: Emitter,
  options: {
    namespace: string;
  }
) {
  const ctx: EmitterContext = buildEmitterContext(spec, options);

  const files = [
    ...emitter.generateModels(spec.models, ctx),
    ...emitter.generateEnums(spec.enums, ctx),
    ...emitter.generateResources(spec.services, ctx),
    ...emitter.generateClient(spec, ctx),
    ...emitter.generateErrors(ctx),
    ...emitter.generateTests(spec, ctx)
  ];

  return files.map((file) =>
    file.placeHeader
      ? {
          ...file,
          content: `${emitter.fileHeader?.() ?? defaultFileHeader}\n\n${file.content}`
        }
      : file
  );
}
