/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Resource, ResourceDefinition, RouteDefinition } from './types';

export function resource<
  TBase extends string,
  TRoutes extends Record<string, RouteDefinition>
>(_definition: ResourceDefinition<TBase, TRoutes>): Resource<TBase, TRoutes> {
  throw new Error('NOT_IMPLEMENTED');
}
