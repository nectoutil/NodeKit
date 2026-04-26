/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {
  OpenApiClient,
  OpenApiClientConfig,
  OpenApiPathsBase
} from './types';

export function createOpenApiClient<TPaths extends OpenApiPathsBase>(
  _config?: OpenApiClientConfig
): OpenApiClient<TPaths> {
  throw new Error('NOT_IMPLEMENTED');
}
