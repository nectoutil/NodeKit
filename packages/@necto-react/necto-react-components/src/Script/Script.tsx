/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useScript, useId } from '@necto-react/hooks';
import { useLocalState } from '@necto-react/state';
import { forwardRef, useEffect, useSyncExternalStore } from 'react';

import { Primitive } from '../Primitive';
import { SCRIPT_METHOD_SHORTHAND_PATTERN, SCRIPT_NAME } from './constants';

import type { ScriptProps } from './Script.types';
import type { ForwardedRef, ReactElement, Ref } from 'react';

const getClientSnapshot = (): boolean => false;
const getServerSnapshot = (): boolean => true;
const subscribeToHydration = (): (() => void) => () => {};

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

  const serverSnapshot: boolean = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot
  );

  const renderServerScript: boolean = useLocalState(
    serverSnapshot && !src && enabled && Boolean(script)
  ).value;

  const generatedId: string = useId();
  const scriptId: string = id ?? generatedId;

  const inlineScript: string | undefined = script
    ? serializeInlineScript(script, scriptArgs, scriptId)
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

  useEffect(() => {
    if (renderServerScript || !forwardedRef || src || !enabled || !inlineScript) {
      return;
    }

    const ownerWindow: Window | null = targetWindow === undefined ? window : targetWindow;
    const element: HTMLElement | null | undefined = ownerWindow?.document.getElementById(scriptId);

    if (element?.tagName !== 'SCRIPT' || element.dataset.nectoScript !== `inline:${scriptId}`) {
      return;
    }

    const scriptElement = element as HTMLScriptElement;

    if (typeof forwardedRef === 'function') {
      const cleanup = forwardedRef(scriptElement);
      return typeof cleanup === 'function'
        ? cleanup
        : () => {
            forwardedRef(null);
          };
    }

    forwardedRef.current = scriptElement;
    return () => {
      forwardedRef.current = null;
    };
  }, [renderServerScript, forwardedRef, src, enabled, inlineScript, targetWindow, scriptId]);

  if (!renderServerScript || src || !enabled || !inlineScript) {
    return null;
  }

  return (
    <Primitive.Script
      {...scriptProps}
      type={type}
      id={scriptId}
      nonce={nonce}
      ref={forwardedRef}
      suppressHydrationWarning
      data-necto-script-status="loading"
      data-necto-script={`inline:${scriptId}`}
    >
      {inlineScript}
    </Primitive.Script>
  );
}

export const Script = forwardRef(ScriptFn) as (<Args extends unknown[]>(
  props: ScriptProps<Args> & { ref?: Ref<HTMLScriptElement> }
) => ReactElement | null) & { displayName?: string };

Script.displayName = SCRIPT_NAME;

// Serializes an inline script and its args into a self-reporting IIFE for SSR injection.
function serializeInlineScript<Args extends unknown[]>(
  script: (...args: Args) => unknown,
  scriptArgs: Args | undefined,
  scriptId: string
): string {
  function runInlineScript(fn: (...args: unknown[]) => unknown, args: unknown[], id: string): void {
    const element: HTMLElement | SVGScriptElement | null =
      document.currentScript ?? document.getElementById(id);

    const report = (status: 'ready' | 'error'): void => {
      element?.setAttribute('data-necto-script-status', status);
      if (element && !document.currentScript) {
        element.dispatchEvent(new Event(`necto:script-${status}`));
      }
    };

    try {
      fn.apply(null, args);
      report('ready');
    } catch (error) {
      report('error');
      throw error;
    }
  }

  const expression: string = Function.prototype.toString
    .call(script)
    .replace(
      SCRIPT_METHOD_SHORTHAND_PATTERN,
      (_match, asyncKeyword, generator) =>
        `${asyncKeyword ? 'async ' : ''}function${generator ?? ''}`
    );

  const args = (JSON.stringify(scriptArgs) ?? '[]').replace(/</g, '\\u003c');
  const id = JSON.stringify(scriptId).replace(/</g, '\\u003c');

  return `(${runInlineScript})((${expression}), ${args}, ${id})`;
}
