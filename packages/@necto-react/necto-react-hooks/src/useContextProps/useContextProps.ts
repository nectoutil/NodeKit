// biome-ignore-all lint/suspicious/noExplicitAny: Explicit any is okay here.

/**
 * Portions of this file are based on code from the React Aria Spectrum library by Adobe,
 * licensed under the Apache License, Version 2.0.
 * Copyright (c) Adobe. All rights reserved.
 * See: https://github.com/adobe/react-spectrum
 *
 * Modifications copyright (c) Corinvo, LLC. and affiliates. All rights reserved.
 *
 * This file contains code licensed under:
 * - The MIT License (see LICENSE in the root directory) for Corinvo modifications.
 * - The Apache License, Version 2.0 for portions from Adobe.
 *
 * Modifications have been made to adapt the code for use in this project.
 */

import { useMemo } from 'react';
import { useObjectRef } from '../useObjectRef';
import { mergeRefs, mergeProps } from '@necto/mergers';
import { useSlottedContext } from '@necto-react/hooks';

import type { ForwardedRef } from 'react';
import type {
  UseContextPropsProps,
  UseContextPropsReturn
} from './useContextProps.types';

export function useContextProps<T, E extends Element>({
  props,
  ref,
  context
}: UseContextPropsProps<T, E>): UseContextPropsReturn<T, E> {
  const ctx = useSlottedContext({ context, slot: props.slot }) || new Object();
  const { ref: contextRef, ...contextProps } = ctx as {
    ref?: unknown;
    [key: string]: unknown;
  };
  const mergedRef = useObjectRef(
    useMemo(
      () => mergeRefs(ref, contextRef as ForwardedRef<E>),
      [ref, contextRef]
    )
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
      (mergedProps as any).style = (renderProps: any) => {
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
      (mergedProps as any).style = { ...contextProps.style, ...props.style };
    }
  }

  return [mergedProps, mergedRef];
}
