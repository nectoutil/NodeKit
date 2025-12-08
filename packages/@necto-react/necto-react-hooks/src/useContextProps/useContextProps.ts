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

import { useRef, useCallback } from 'react';
import { mergeProps } from '@necto/mergers';
import { useSlottedContext } from '@necto-react/hooks';

import type {
  UseContextPropsOptions,
  UseContextPropsReturn
} from './useContextProps.types';
import type { RefObject } from 'react';

/**
 * React hook that merges props and refs from both component and context, including styles.
 *
 * @template T The props type.
 * @template E The element type.
 * @param {UseContextPropsOptions<T, E>} options - Component props, ref, and context.
 * @returns {UseContextPropsReturn<T, E>} A tuple of merged props and merged ref.
 */
export function useContextProps<T, E extends Element>({
  props,
  ref,
  context
}: UseContextPropsOptions<T, E>): UseContextPropsReturn<T, E> {
  const ctx = useSlottedContext({ context, slot: props.slot }) || {};

  const { ref: contextRef = null, ...contextProps } = ctx as {
    ref?: unknown;
    [key: string]: unknown;
  };

  const localRef: RefObject<E | null> = useRef<E | null>(null);

  const mergedRef = useCallback(
    (value: E | null) => {
      localRef.current = value;

      if (typeof ref === 'function') {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }

      if (typeof contextRef === 'function') {
        (contextRef as (value: E | null) => void)(value);
      } else if (contextRef && typeof contextRef === 'object') {
        (contextRef as RefObject<E | null>).current = value;
      }
    },
    [ref, contextRef]
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
