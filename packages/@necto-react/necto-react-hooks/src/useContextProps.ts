/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

import { useContext, useMemo } from "react";
import { useObjectRef } from "./useObjectRef";
import { mergeRefs, mergeReactProps } from "@necto/mergers";

import type { ForwardedRef, Context, RefObject } from "react";

export const DEFAULT_SLOT = Symbol('default');

export interface SlotProps {
  slot?: string | null;
}

interface SlottedValue<T> {
  slots?: Record<string | symbol, T>
}

export type WithRef<T, E> = T & {ref?: ForwardedRef<E>};
export type SlottedContextValue<T> = SlottedValue<T> | T | null | undefined;
export type ContextValue<T, E> = SlottedContextValue<WithRef<T, E>>;

export function useSlottedContext<T>(context: Context<SlottedContextValue<T>>, slot?: string | null): T | null | undefined {
  let ctx = useContext(context);
  if (slot === null) {
    // An explicit `null` slot means don't use context.
    return null;
  }
  if (ctx && typeof ctx === 'object' && 'slots' in ctx && ctx.slots) {
    let slotKey = slot || DEFAULT_SLOT;
    if (!ctx.slots[slotKey]) {
      let availableSlots = new Intl.ListFormat().format(Object.keys(ctx.slots).map(p => `"${p}"`));
      let errorMessage = slot ? `Invalid slot "${slot}".` : 'A slot prop is required.';

      throw new Error(`${errorMessage} Valid slot names are ${availableSlots}.`);
    }
    return ctx.slots[slotKey];
  }
  // @ts-ignore
  return ctx;
}

export function useContextProps<T, U extends SlotProps, E extends Element>(props: T & SlotProps, ref: ForwardedRef<E>, context: Context<ContextValue<U, E>>): [T, RefObject<E | null>] {
  let ctx = useSlottedContext(context, props.slot) || {};
  let {ref: contextRef, ...contextProps} = ctx as any;
  let mergedRef = useObjectRef(useMemo(() => mergeRefs(ref, contextRef), [ref, contextRef]));
  let mergedProps = mergeReactProps(contextProps, props) as unknown as T;

  if (
    'style' in contextProps &&
    contextProps.style &&
    'style' in props &&
    props.style
  ) {
    if (typeof contextProps.style === 'function' || typeof props.style === 'function') {
      // @ts-ignore
      mergedProps.style = (renderProps) => {
        let contextStyle = typeof contextProps.style === 'function' ? contextProps.style(renderProps) : contextProps.style;
        let defaultStyle = {...renderProps.defaultStyle, ...contextStyle};
        let style = typeof props.style === 'function'
          ? props.style({...renderProps, defaultStyle})
          : props.style;
        return {...defaultStyle, ...style};
      };
    } else {
      // @ts-ignore
      mergedProps.style = {...contextProps.style, ...props.style};
    }
  }

  return [mergedProps, mergedRef];
}