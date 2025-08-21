// biome-ignore-all assist/source/organizeImports: No import sorting needed.
// biome-ignore-all lint/suspicious/noExplicitAny: No need to enforce any rule here.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DOM } from '@necto/constants';
import { forwardRef, isValidElement, cloneElement, Children } from 'react';

import type { ElementType, Ref, ReactElement } from 'react';
import type { PrimitiveProps, Primitives } from './Primitive.types';

const PrimitiveFn = <E extends ElementType = 'div'>(
  { as, asChild, children, ...props }: PrimitiveProps<E>,
  ref: Ref<any>
): ReactElement | null => {
  const Tag = (as ?? 'div') as ElementType;

  if (asChild) {
    const child = Children.only(children);
    if (!isValidElement(child)) return null;

    return cloneElement(child as ReactElement<any>, {
      ...props,
      ref: (child as any).ref ?? ref
    });
  }

  return (
    <Tag ref={ref} {...(props as any)}>
      {children}
    </Tag>
  );
};

export const Primitive = Object.assign(
  forwardRef(PrimitiveFn) as <E extends ElementType = 'div'>(
    props: PrimitiveProps<E> & { ref?: Ref<any> }
  ) => ReactElement | null,
  DOM.HTML_TAGS.reduce((acc, tag) => {
    acc[tag as keyof Primitives] = forwardRef<any, any>((props, ref) =>
      PrimitiveFn({ ...(props as any), as: tag } as PrimitiveProps<any>, ref)
    ) as Primitives[keyof Primitives];
    return acc;
  }, {} as Primitives)
);
