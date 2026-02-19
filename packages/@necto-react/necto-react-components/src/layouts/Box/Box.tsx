/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cn from 'clsx';
import { forwardRef } from 'react';

import { Primitive } from '../../Primitive';
import styles from './Box.module.scss';

import type { BoxProps } from './Box.types';
import type { ElementType, Ref, ReactElement } from 'react';

const BOX_NAME: string = 'Box' as const;

const px = (value: number | undefined): string | undefined =>
  value != null ? `${value}px` : undefined;

const BoxFn = <T extends ElementType = 'div'>(
  props: BoxProps<T>,
  ref: Ref<any>
): ReactElement => {
  const {
    as,
    asChild,
    children,
    background,
    borderColor,
    borderStyle,
    borderWidth,
    borderBlockStartWidth,
    borderBlockEndWidth,
    borderInlineStartWidth,
    borderInlineEndWidth,
    borderRadius,
    borderEndStartRadius,
    borderEndEndRadius,
    borderStartStartRadius,
    borderStartEndRadius,
    color,
    minHeight,
    minWidth,
    maxWidth,
    width,
    overflowX,
    overflowY,
    padding,
    paddingBlock,
    paddingBlockStart,
    paddingBlockEnd,
    paddingInline,
    paddingInlineStart,
    paddingInlineEnd,
    shadow,
    outlineColor,
    outlineStyle,
    outlineWidth,
    opacity,
    zIndex,
    className,
    ...others
  } = props;

  const borderStyleValue = borderStyle
    ? borderStyle
    : borderColor || borderWidth || borderBlockStartWidth || borderBlockEndWidth || borderInlineStartWidth || borderInlineEndWidth
      ? 'solid'
      : undefined;

  const outlineStyleValue = outlineStyle
    ? outlineStyle
    : outlineColor || outlineWidth
      ? 'solid'
      : undefined;

  return (
    <Primitive
      as={as}
      ref={ref}
      {...others}
      className={cn(
        styles.Box,
        `_necto:${BOX_NAME}`,
        className
      )}
      style={{
        '--necto-box-background': background,
        '--necto-box-border-color': borderColor,
        '--necto-box-border-style': borderStyleValue,
        '--necto-box-border-width': borderWidth,
        '--necto-box-border-block-start-width': borderBlockStartWidth,
        '--necto-box-border-block-end-width': borderBlockEndWidth,
        '--necto-box-border-inline-start-width': borderInlineStartWidth,
        '--necto-box-border-inline-end-width': borderInlineEndWidth,
        '--necto-box-border-radius': borderRadius,
        '--necto-box-border-end-start-radius': borderEndStartRadius,
        '--necto-box-border-end-end-radius': borderEndEndRadius,
        '--necto-box-border-start-start-radius': borderStartStartRadius,
        '--necto-box-border-start-end-radius': borderStartEndRadius,
        '--necto-box-color': color,
        '--necto-box-min-height': minHeight,
        '--necto-box-min-width': minWidth,
        '--necto-box-max-width': maxWidth,
        '--necto-box-width': width,
        '--necto-box-overflow-x': overflowX,
        '--necto-box-overflow-y': overflowY,
        '--necto-box-padding-block-start': px(paddingBlockStart ?? paddingBlock ?? padding),
        '--necto-box-padding-block-end': px(paddingBlockEnd ?? paddingBlock ?? padding),
        '--necto-box-padding-inline-start': px(paddingInlineStart ?? paddingInline ?? padding),
        '--necto-box-padding-inline-end': px(paddingInlineEnd ?? paddingInline ?? padding),
        '--necto-box-shadow': shadow,
        '--necto-box-outline-color': outlineColor,
        '--necto-box-outline-style': outlineStyleValue,
        '--necto-box-outline-width': outlineWidth,
        '--necto-box-opacity': opacity,
        '--necto-box-z-index': zIndex,
      }}
    >
      {children}
    </Primitive>
  );
};

export const Box: (<T extends ElementType = 'div'>(
  props: BoxProps<T> & { ref?: Ref<any> }
) => ReactElement) & { Root: any } = Object.assign(
  forwardRef(BoxFn),
  { Root: forwardRef(BoxFn) }
) as (<T extends ElementType = 'div'>(
  props: BoxProps<T> & { ref?: Ref<any> }
) => ReactElement) & { Root: any };
