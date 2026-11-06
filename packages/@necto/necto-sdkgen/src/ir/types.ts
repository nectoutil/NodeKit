/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export interface Model {
  name: string;
}

export interface Enum {
  name: string;
  values: string[];
}

export interface Service {
  name: string;
}

export interface ApiSpec {
  name: string;
  version: string;
  document: Record<string, unknown>;
  sourceUrl: string;
  dependencies: string[];

  models: Model[];
  enums: Enum[];
  services: Service[];
}
