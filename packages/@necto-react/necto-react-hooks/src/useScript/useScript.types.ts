/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export enum UseScriptStatusEnum {
  Idle = 'idle',
  Error = 'error',
  Ready = 'ready',
  Loading = 'loading'
}

export type UseScriptStatus = `${UseScriptStatusEnum}`;

export interface UseScriptOptions {
  /** Whether script injection is enabled. */
  enabled?: boolean;

  /** Whether an external script loads asynchronously. */
  async?: boolean;

  /** ID assigned to the script element. */
  id?: string;

  /** Script MIME type, such as `module`. */
  type?: string;

  /** Content Security Policy nonce for the script. */
  nonce?: string;

  /** Subresource Integrity hash for an external script. */
  integrity?: string;

  /** Window whose document receives the script. */
  window?: Window | null;

  /** Inline script source used when no external URL is provided. */
  inlineContent?: string;

  /** CORS mode for an external script. */
  crossOrigin?: HTMLScriptElement['crossOrigin'];

  /** Referrer policy for an external script request. */
  referrerPolicy?: HTMLScriptElement['referrerPolicy'];
}
