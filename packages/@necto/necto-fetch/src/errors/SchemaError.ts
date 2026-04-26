/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { SchemaParseResult } from '../types/schema';

type Issues = Extract<SchemaParseResult<unknown>, { success: false }>['issues'];

export class SchemaError extends Error {
  readonly name = 'SchemaError' as const;
  readonly issues!: Issues;
  readonly received!: unknown;
  readonly request!: Request;

  constructor(
    _issues: Issues,
    _received: unknown,
    _request: Request,
    _message?: string
  ) {
    super(_message ?? 'Response failed schema validation');
    throw new Error('NOT_IMPLEMENTED');
  }
}
