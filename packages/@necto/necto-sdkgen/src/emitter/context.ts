/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { snakeCase } from '@necto/strings';

import type { ApiSpec } from '../ir';
import type { EmitterContext } from './types';

export function buildEmitterContext(
  spec: ApiSpec,
  options: {
    namespace: string;
    outputDir?: string;
    emitterOptions?: Record<string, unknown>;
  }
): EmitterContext {
  return {
    spec,
    outputDir: options.outputDir,
    namespacePascal: options.namespace,
    emitterOptions: options.emitterOptions,
    namespace: snakeCase(options.namespace)
  };
}
