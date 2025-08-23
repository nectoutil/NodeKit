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
import { HTMLElements } from '@necto/dom';
import { forwardRef, isValidElement, cloneElement, Children } from 'react';

import type { ElementType, Ref, ReactElement } from 'react';
import type { PrimitiveProps, Primitives } from './Primitive.types';

const DEFAULT_PRIMITIVE_TAG: keyof HTMLElementTagNameMap = HTMLElements.Div;

/**
 /**
 * @internal
 * Internal render function for the Primitive component. Handles polymorphic rendering, child cloning, and ref forwarding.
 * Not for public use; use the exported Primitive component instead.
 *
 * @param {PrimitiveProps<any>} props - Props for the Primitive component.
 * @param {Ref<any>} ref - Forwarded ref for the rendered element or cloned child.
 * @returns {ReactElement | null} The rendered element, or null when cloning fails.
 */
const PrimitiveFn = <E extends ElementType = (typeof HTMLElements)["Div"]>(
  { as, asChild, children, ...props }: PrimitiveProps<E>,
  ref: Ref<any>
): ReactElement | null => {
  const Tag = (as ?? DEFAULT_PRIMITIVE_TAG) as ElementType;

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

/**
 * The public Primitive component for Necto.
 *
 * @param {PrimitiveProps<any>} props - Props for the polymorphic Primitive component.
 * @param {Ref<any>} ref - Forwarded ref for the rendered element or cloned child.
 * @returns {ReactElement | null} The rendered element or null.
 */
export const Primitive = Object.assign(
  forwardRef(PrimitiveFn) as <E extends ElementType = (typeof HTMLElements)["Div"]>(
    props: PrimitiveProps<E> & { ref?: Ref<any> }
  ) => ReactElement | null,
  DOM.HTML_TAGS.reduce((acc, tag) => {
    acc[tag as keyof Primitives] = forwardRef<any, any>((props, ref) =>
      PrimitiveFn({ ...(props as any), as: tag } as PrimitiveProps<any>, ref)
    ) as Primitives[keyof Primitives];
    return acc;
  }, {} as Primitives)
);

