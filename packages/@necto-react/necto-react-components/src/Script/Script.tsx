/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { forwardRef, useId } from 'react';
import { useScript } from '@necto-react/hooks';

import { Primitive } from '../Primitive';
import { SCRIPT_NAME } from './constants';

import type { ScriptProps } from './Script.types';
import type { ForwardedRef, ReactElement, Ref } from 'react';

function ScriptFn<Args extends unknown[]>(
  props: ScriptProps<Args>,
  forwardedRef: ForwardedRef<HTMLScriptElement>
): ReactElement | null {
  const {
    id,
    src,
    type,
    nonce,
    script,
    integrity,
    scriptArgs,
    scriptProps,
    crossOrigin,
    referrerPolicy,
    async = true,
    enabled = true,
    window: targetWindow
  } = props;

  const generatedId = useId();
  const scriptId = id ?? generatedId;
  const inlineScript: string | undefined = script
    ? serializeInlineScript(script, scriptArgs)
    : undefined;

  useScript(src, {
    type,
    nonce,
    async,
    enabled,
    integrity,
    crossOrigin,
    referrerPolicy,
    id: scriptId,
    window: targetWindow,
    inlineContent: src ? undefined : inlineScript
  });

  if (src || !enabled || !inlineScript) {
    return null;
  }

  return (
    <Primitive.Script
      {...scriptProps}
      ref={forwardedRef}
      type={type}
      id={scriptId}
      suppressHydrationWarning
      data-necto-script-status="loading"
      data-necto-script={`inline:${scriptId}`}
      nonce={typeof window === 'undefined' ? nonce : ''}
      dangerouslySetInnerHTML={{ __html: inlineScript }}
    />
  );
}

export const Script = forwardRef(ScriptFn) as (<Args extends unknown[]>(
  props: ScriptProps<Args> & { ref?: Ref<HTMLScriptElement> }
) => ReactElement | null) & { displayName?: string };

Script.displayName = SCRIPT_NAME;

// Serializes an inline script and its args into a self-reporting IIFE for SSR injection.
function serializeInlineScript<Args extends unknown[]>(
  script: (...args: Args) => unknown,
  scriptArgs?: Args
): string {
  function runInlineScript(fn: (...args: unknown[]) => unknown, args: unknown[]): void {
    const element: HTMLOrSVGScriptElement | null = document.currentScript;

    try {
      fn.apply(null, args);

      if (element) {
        element.setAttribute('data-necto-script-status', 'ready');
      }
    } catch (error) {
      if (element) {
        element.setAttribute('data-necto-script-status', 'error');
      }

      throw error;
    }
  }

  const source: string = script.toString().replace(/<\/script/gi, '<\\/script');
  const args: string = (JSON.stringify(scriptArgs) ?? '[]').replace(/</g, '\\u003c');

  return `(${runInlineScript})(${source}, ${args})`;
}
