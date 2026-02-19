/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cn from 'clsx';
import { forwardRef } from 'react';

import { Primitive } from '../Primitive';
import styles from './ShadowBevel.module.scss';
import { SHADOW_BEVEL_NAME } from './constants';

import type { ShadowBevelProps } from './ShadowBevel.types';
import type { ElementType, Ref, ReactElement } from 'react';

const ShadowBevelFn = <T extends ElementType = 'div'>(
 props: ShadowBevelProps<T>,
  ref: Ref<any>
): ReactElement => {
  const {
    as,
    asChild,
    children,
    boxShadow,
    borderRadius,
    zIndex = 0,
    bevel = true,
    className,
    style,
    ...others
  } = props;

  return (
    <Primitive
      as={as}
      ref={ref}
      {...others}
      className={cn(
        className,
        styles.ShadowBevel,
        `_necto:${SHADOW_BEVEL_NAME}`
      )}
      style={{
        ...style,
        '--necto-shadow-bevel-z-index': zIndex,
        '--necto-shadow-bevel-content': bevel ? '""' : 'none',
        '--necto-shadow-bevel-box-shadow': typeof boxShadow === 'number' ? `var(--necto-shadow-${boxShadow})` : (boxShadow ?? 'none'),
        '--necto-shadow-bevel-border-radius': typeof borderRadius === 'number' ? `${borderRadius}px` : (borderRadius ?? '0')
      }}
    >
      {children}
    </Primitive>
  );
};

export const ShadowBevel: (<T extends ElementType = 'div'>(
  props: ShadowBevelProps<T> & { ref?: Ref<any> }
) => ReactElement) & { Root: any } = Object.assign(
  forwardRef(ShadowBevelFn),
  {
    Root: forwardRef(ShadowBevelFn)
  }
) as (<T extends ElementType = 'div'>(
  props: ShadowBevelProps<T> & { ref?: Ref<any> }
) => ReactElement) & { Root: any };
