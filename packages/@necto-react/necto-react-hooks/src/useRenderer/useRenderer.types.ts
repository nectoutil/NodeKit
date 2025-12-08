/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { RenderProps } from '@necto-react/types';
import type { ReactNode, CSSProperties } from 'react';

/**
 * Options for the useRenderer hook.
 */
export interface UseRendererOptions<T> extends RenderProps<T> {
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

/**
 * Return type for the useRenderer hook.
 */
export interface UseRendererReturn {
  // The resolved class name for the component.
  className?: string;

  // The resolved inline styles for the component.
  style?: CSSProperties;

  // The resolved children for the component.
  children?: ReactNode;
}
