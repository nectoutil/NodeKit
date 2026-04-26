/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export class NetworkError extends Error {
  readonly name = 'NetworkError' as const;
  readonly request!: Request;
  override readonly cause!: unknown;

  constructor(_request: Request, _cause: unknown, _message?: string) {
    super(_message ?? 'Network request failed', { cause: _cause });
    throw new Error('NOT_IMPLEMENTED');
  }
}
