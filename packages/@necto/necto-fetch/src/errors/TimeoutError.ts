/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export class TimeoutError extends Error {
  readonly name = 'TimeoutError' as const;
  readonly timeout!: number;
  readonly request!: Request;

  constructor(_request: Request, _timeout: number, _message?: string) {
    super(_message ?? `Request timed out after ${_timeout}ms`);
    throw new Error('NOT_IMPLEMENTED');
  }
}
