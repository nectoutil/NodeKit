/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Portions of this code are based on the React Aria Spectrum library by Adobe,
 * licensed under the Apache License, Version 2.0.
 * See: https://github.com/adobe/react-spectrum
 *
 * Modifications have been made to adapt the code for use in this project.
 */

'use strict';

import { useMemo } from 'react';

import type { RenderProps } from '@necto-react/types';
import type { ReactNode, CSSProperties } from 'react';

// Props for the `useRenderProps` hook
interface RenderPropsHookProps<T> extends RenderProps<T> {
  // Optional ID for the component.
  id?: string;

  // Values passed to the render props.
  values: T;

  // Default children to render if no custom children are provided.
  defaultChildren?: ReactNode;

  // Default class name for the component.
  defaultClassName?: string;

  // Default inline styles for the component.
  defaultStyle?: CSSProperties;

  // Custom data attributes for the component.
  [dataAttr: `data-${string}`]: string | undefined;
}

// Results returned by the `useRenderProps` hook
interface RenderPropsHookResults {
  // The resolved class name for the component.
  className?: string;

  // The resolved inline styles for the component.
  style?: CSSProperties;

  // The resolved children for the component.
  children?: ReactNode;
}

// Hook to compute render props
function useRenderProps<T>(props: RenderPropsHookProps<T>): RenderPropsHookResults {
  const {
    className,
    style,
    children,
     // Default class name
    defaultClassName = 'necto',
    defaultChildren,
    defaultStyle,
    values
  } = props;

  return useMemo(() => {
    // Compute className
    const computedClassName =
      typeof className === 'function'
        ? className({ ...values, defaultClassName })
        : `${defaultClassName} ${className}`;

    // Compute style
    const computedStyle =
      typeof style === 'function'
        ? style({ ...values, defaultStyle: defaultStyle || {} })
        : { ...defaultStyle, ...style };

    // Compute children
    const computedChildren =
      typeof children === 'function'
        ? children({ ...values, defaultChildren })
        : children ?? defaultChildren;

    return {
      className: computedClassName,
      style: computedStyle,
      children: computedChildren,
    };
  }, [className, style, children, defaultClassName, defaultChildren, defaultStyle, values]);
}

export {
  useRenderProps
};