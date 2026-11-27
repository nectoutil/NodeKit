/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ScriptHTMLAttributes } from 'react';
import type { UseScriptOptions } from '@necto-react/hooks';

export type ScriptAttributes = Omit<
  ScriptHTMLAttributes<HTMLScriptElement>,
  | 'id'
  | 'as'
  | 'src'
  | 'type'
  | 'nonce'
  | 'async'
  | 'children'
  | 'integrity'
  | 'crossOrigin'
  | 'referrerPolicy'
  | 'dangerouslySetInnerHTML'
  | 'suppressHydrationWarning'
> & {
  as?: never;
};

export interface ScriptProps<Args extends unknown[] = unknown[]> extends Omit<
  UseScriptOptions,
  'inlineContent'
> {
  /** URL of an external script to load. */
  src?: string;

  /** Self-contained function to serialize and execute as an inline script. */
  script?: (...args: Args) => unknown;

  /** JSON-serializable arguments passed to the inline script function. */
  scriptArgs?: Args;

  /** Additional allowed HTML attributes for the inline script element. */
  scriptProps?: ScriptAttributes;
}
