/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// biome-ignore-all lint/correctness/noUnusedVariables: Polymorphic props destructuring.
// biome-ignore-all lint/suspicious/noExplicitAny: Polymorphic component requires any for dynamic element types.
/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cn from 'clsx';
import styled from '@emotion/styled';
import { forwardRef } from 'react';

import { Primitive } from '../../Primitive';

import type { BoxProps } from './Box.types';
import type { ElementType, Ref, ReactElement } from 'react';

const BOX_NAME: string = 'Box' as const;

const px = (value: number | undefined): string | undefined =>
  value != null ? `${value}px` : undefined;

const StyledBox = styled(Primitive)`
  --necto-box-border-width: 0;
  --necto-box-border-block-start-width: var(--necto-box-border-width);
  --necto-box-border-block-end-width: var(--necto-box-border-width);
  --necto-box-border-inline-start-width: var(--necto-box-border-width);
  --necto-box-border-inline-end-width: var(--necto-box-border-width);
  --necto-box-border-end-start-radius: var(--necto-box-border-radius, 0);
  --necto-box-border-end-end-radius: var(--necto-box-border-radius, 0);
  --necto-box-border-start-start-radius: var(--necto-box-border-radius, 0);
  --necto-box-border-start-end-radius: var(--necto-box-border-radius, 0);

  border-block-start-width: var(--necto-box-border-block-start-width);
  border-block-end-width: var(--necto-box-border-block-end-width);
  border-inline-start-width: var(--necto-box-border-inline-start-width);
  border-inline-end-width: var(--necto-box-border-inline-end-width);
  border-end-start-radius: var(--necto-box-border-end-start-radius);
  border-end-end-radius: var(--necto-box-border-end-end-radius);
  border-start-start-radius: var(--necto-box-border-start-start-radius);
  border-start-end-radius: var(--necto-box-border-start-end-radius);
  min-height: var(--necto-box-min-height);
  min-width: var(--necto-box-min-width);
  max-width: var(--necto-box-max-width);
  width: var(--necto-box-width);
  overflow-x: var(--necto-box-overflow-x);
  overflow-y: var(--necto-box-overflow-y);
  padding-block-start: var(--necto-box-padding-block-start);
  padding-block-end: var(--necto-box-padding-block-end);
  padding-inline-start: var(--necto-box-padding-inline-start);
  padding-inline-end: var(--necto-box-padding-inline-end);
  opacity: var(--necto-box-opacity);
  z-index: var(--necto-box-z-index);
`;

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
    : borderColor ||
        borderWidth ||
        borderBlockStartWidth ||
        borderBlockEndWidth ||
        borderInlineStartWidth ||
        borderInlineEndWidth
      ? 'solid'
      : undefined;

  const outlineStyleValue = outlineStyle
    ? outlineStyle
    : outlineColor || outlineWidth
      ? 'solid'
      : undefined;

  return (
    <StyledBox
      as={as}
      ref={ref}
      {...others}
      className={cn(`_necto:${BOX_NAME}`, className)}
      style={{
        ...(background && { backgroundColor: background }),
        ...(borderColor && { borderColor }),
        ...(borderStyleValue && { borderStyle: borderStyleValue }),
        ...(color && { color }),
        ...(shadow && { boxShadow: shadow }),
        ...(outlineColor && { outlineColor }),
        ...(outlineStyleValue && { outlineStyle: outlineStyleValue }),
        ...(outlineWidth && { outlineWidth }),
        ...(borderWidth && { '--necto-box-border-width': borderWidth }),
        ...(borderBlockStartWidth && {
          '--necto-box-border-block-start-width': borderBlockStartWidth
        }),
        ...(borderBlockEndWidth && {
          '--necto-box-border-block-end-width': borderBlockEndWidth
        }),
        ...(borderInlineStartWidth && {
          '--necto-box-border-inline-start-width': borderInlineStartWidth
        }),
        ...(borderInlineEndWidth && {
          '--necto-box-border-inline-end-width': borderInlineEndWidth
        }),
        ...(borderRadius && { '--necto-box-border-radius': borderRadius }),
        ...(borderEndStartRadius && {
          '--necto-box-border-end-start-radius': borderEndStartRadius
        }),
        ...(borderEndEndRadius && {
          '--necto-box-border-end-end-radius': borderEndEndRadius
        }),
        ...(borderStartStartRadius && {
          '--necto-box-border-start-start-radius': borderStartStartRadius
        }),
        ...(borderStartEndRadius && {
          '--necto-box-border-start-end-radius': borderStartEndRadius
        }),
        '--necto-box-min-height': minHeight,
        '--necto-box-min-width': minWidth,
        '--necto-box-max-width': maxWidth,
        '--necto-box-width': width,
        '--necto-box-overflow-x': overflowX,
        '--necto-box-overflow-y': overflowY,
        '--necto-box-padding-block-start': px(
          paddingBlockStart ?? paddingBlock ?? padding
        ),
        '--necto-box-padding-block-end': px(
          paddingBlockEnd ?? paddingBlock ?? padding
        ),
        '--necto-box-padding-inline-start': px(
          paddingInlineStart ?? paddingInline ?? padding
        ),
        '--necto-box-padding-inline-end': px(
          paddingInlineEnd ?? paddingInline ?? padding
        ),
        '--necto-box-opacity': opacity,
        '--necto-box-z-index': zIndex
      }}
    >
      {children}
    </StyledBox>
  );
};

export const Box: (<T extends ElementType = 'div'>(
  props: BoxProps<T> & { ref?: Ref<any> }
) => ReactElement) & { Root: any } = Object.assign(forwardRef(BoxFn), {
  Root: forwardRef(BoxFn)
}) as (<T extends ElementType = 'div'>(
  props: BoxProps<T> & { ref?: Ref<any> }
) => ReactElement) & { Root: any };
