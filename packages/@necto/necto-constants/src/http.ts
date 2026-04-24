/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { StatusCodes, ReasonPhrases } from 'http-status-codes';

/**
 * Numeric HTTP status codes keyed by their well-known name.
 * e.g. `STATUS_CODES.OK === 200`, `STATUS_CODES.NOT_FOUND === 404`.
 *
 * Sourced from `http-status-codes` and bundled at build time.
 */
export const STATUS_CODES = StatusCodes;

/**
 * Human-readable reason phrases keyed by the status name.
 * e.g. `REASON_PHRASES.OK === 'OK'`, `REASON_PHRASES.NOT_FOUND === 'Not Found'`.
 *
 * Sourced from `http-status-codes` and bundled at build time.
 */
export const REASON_PHRASES = ReasonPhrases;
