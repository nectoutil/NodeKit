/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface ScriptDescriptor {
  /** External URL to load. When omitted, an inline script is created. */
  src?: string | null;

  /** Inline source used when no external URL is provided. */
  inlineContent?: string | null;

  /** ID assigned to the script element. */
  id?: string;

  /** Script MIME type, such as `module`. */
  type?: string;

  /** Whether an external script loads asynchronously. */
  async?: boolean;

  /** Content Security Policy nonce for the script. */
  nonce?: string;

  /** Subresource Integrity hash for an external script. */
  integrity?: string;

  /** CORS mode for an external script. */
  crossOrigin?: string | null;

  /** Referrer policy for an external script request. */
  referrerPolicy?: string;
}

export interface ScriptRecord {
  element: HTMLScriptElement;
  status: ScriptStatus;
  createdHere: boolean;
  listeners: Set<() => void>;
}
