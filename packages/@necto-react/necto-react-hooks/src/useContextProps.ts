import { useContext, useMemo } from 'react';
import { useObjectRef } from './useObjectRef';
import { mergeRefs, mergeProps } from '@necto/mergers';

import type { ForwardedRef, Context, RefObject } from 'react';

export const DEFAULT_SLOT = Symbol('default');

export interface SlotProps {
  slot?: string | null;
}

interface SlottedValue<T> {
  slots?: Record<string | symbol, T>;
}

export type WithRef<T, E> = T & { ref?: ForwardedRef<E> };
export type SlottedContextValue<T> = SlottedValue<T> | T | null | undefined;
export type ContextValue<T, E> = SlottedContextValue<WithRef<T, E>>;

export function useSlottedContext<T>(
  context: Context<SlottedContextValue<T>>,
  slot?: string | null
): T | null | undefined {
  const ctx = useContext(context);
  if (slot === null) {
    // An explicit `null` slot means don't use context.
    return null;
  }
  if (ctx && typeof ctx === 'object' && 'slots' in ctx && ctx.slots) {
    const slotKey = slot || DEFAULT_SLOT;
    if (!ctx.slots[slotKey]) {
      const availableSlots = new Intl.ListFormat().format(
        Object.keys(ctx.slots).map((p) => `"${p}"`)
      );
      const errorMessage = slot
        ? `Invalid slot "${slot}".`
        : 'A slot prop is required.';

      throw new Error(
        `${errorMessage} Valid slot names are ${availableSlots}.`
      );
    }
    return ctx.slots[slotKey];
  }
  // @ts-ignore
  return ctx;
}

export function useContextProps<T, U extends SlotProps, E extends Element>(
  props: T & SlotProps,
  ref: ForwardedRef<E>,
  context: Context<ContextValue<U, E>>
): [T, RefObject<E | null>] {
  const ctx = useSlottedContext(context, props.slot) || {};
  const { ref: contextRef, ...contextProps } = ctx as any;
  const mergedRef = useObjectRef(
    useMemo(() => mergeRefs(ref, contextRef), [ref, contextRef])
  );
  const mergedProps = mergeProps(contextProps, props) as unknown as T;

  if (
    'style' in contextProps &&
    contextProps.style &&
    'style' in props &&
    props.style
  ) {
    if (
      typeof contextProps.style === 'function' ||
      typeof props.style === 'function'
    ) {
      // @ts-ignore
      mergedProps.style = (renderProps) => {
        const contextStyle =
          typeof contextProps.style === 'function'
            ? contextProps.style(renderProps)
            : contextProps.style;
        const defaultStyle = { ...renderProps.defaultStyle, ...contextStyle };
        const style =
          typeof props.style === 'function'
            ? props.style({ ...renderProps, defaultStyle })
            : props.style;
        return { ...defaultStyle, ...style };
      };
    } else {
      // @ts-ignore
      mergedProps.style = { ...contextProps.style, ...props.style };
    }
  }

  return [mergedProps, mergedRef];
}
