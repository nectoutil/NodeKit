/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApiSpec } from '../ir';
import { Language } from '../constants';

export interface Emitter {
  language: Language;

  generateModels(models: Model[], ctx: EmitterContext): GeneratedFile[];
  generateEnums(enums: Enum[], ctx: EmitterContext): GeneratedFile[];
  generateResources(services: Service[], ctx: EmitterContext): GeneratedFile[];
  generateClient(spec: ApiSpec, ctx: EmitterContext): GeneratedFile[];
  generateErrors(ctx: EmitterContext): GeneratedFile[];
  generateTests(spec: ApiSpec, ctx: EmitterContext): GeneratedFile[];

  fileHeader?(): string;
}

export interface EmitterContext {
  namespace: string;
  namespacePascal: string;
  spec: ApiSpec;
  outputDir?: string;
  emitterOptions?: Record<string, unknown>;
}

export type Language = (typeof Language)[keyof typeof Language];
