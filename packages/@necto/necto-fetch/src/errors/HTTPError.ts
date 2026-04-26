/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export class HTTPError<TBody = unknown> extends Error {
  readonly name = 'HTTPError' as const;
  readonly status!: number;
  readonly response!: Response;
  readonly request!: Request;
  readonly body!: TBody;

  constructor(
    _response: Response,
    _request: Request,
    _body: TBody,
    _message?: string
  ) {
    super(_message ?? `Request failed with status ${_response.status}`);
    throw new Error('NOT_IMPLEMENTED');
  }
}
