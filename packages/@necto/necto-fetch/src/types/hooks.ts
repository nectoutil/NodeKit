/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { FetchError } from './response';

export interface RequestContext {
  url: string;
  method: string;
  headers: Headers;
  body?: BodyInit | null;
  signal?: AbortSignal;
  meta: Record<string, unknown>;
}

export interface RetryContext {
  attempt: number;
  error: FetchError;
  willRetryAfter: number;
  request: RequestContext;
}

export interface Hooks {
  beforeRequest?: Array<
    (
      req: RequestContext
    ) => RequestContext | void | Promise<RequestContext | void>
  >;
  afterResponse?: Array<
    (
      res: Response,
      req: RequestContext
    ) => Response | void | Promise<Response | void>
  >;
  onError?: Array<
    (
      err: FetchError,
      req: RequestContext
    ) => FetchError | void | Promise<FetchError | void>
  >;
  onRetry?: Array<(ctx: RetryContext) => void | Promise<void>>;
}
