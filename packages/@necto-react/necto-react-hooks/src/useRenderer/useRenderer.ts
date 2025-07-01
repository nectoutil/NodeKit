/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';

import type { ReactNode, CSSProperties } from 'react';
import { UseRendererProps, UseRendererReturn } from './useRenderer.types';

export function useRenderer<T>(props: UseRendererProps<T>): UseRendererReturn {
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
    // Compute classnames
    const computedClassName: string =
      typeof className === 'function'
        ? className({ ...values, defaultClassName })
        : `${defaultClassName} ${className}`;

    // Compute style
    const computedStyle: CSSProperties | undefined =
      typeof style === 'function'
        ? style({ ...values, defaultStyle: defaultStyle || {} })
        : { ...defaultStyle, ...style };

    // Compute children
    const computedChildren: ReactNode =
      typeof children === 'function'
        ? children({ ...values, defaultChildren })
        : (children ?? defaultChildren);

    return {
      className: computedClassName,
      style: computedStyle,
      children: computedChildren
    }
  }, [
    className,
    style,
    children,
    defaultClassName,
    defaultChildren,
    defaultStyle,
    values
  ]);
}