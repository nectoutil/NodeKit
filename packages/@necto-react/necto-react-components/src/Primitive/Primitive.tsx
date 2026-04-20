/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// biome-ignore-all lint/suspicious/noExplicitAny: Polymorphic component requires any for dynamic element types.

import {
  Children,
  forwardRef,
  cloneElement,
  createElement,
  isValidElement
} from 'react';
import { DOM } from '@necto/constants';
import { capitalize } from '@necto/strings';

import { DEFAULT_PRIMITIVE_TAG, PRIMITIVE_NAME } from './constants';

import type {
  Ref,
  ElementType,
  ForwardedRef,
  ReactElement,
  RefAttributes,
  FunctionComponent,
  ForwardRefExoticComponent
} from 'react';
import type { HTMLElements } from '@necto/dom';
import type { PrimitiveProps, Primitives } from './Primitive.types';

let tagComponents: Record<string, any> | undefined;

/**
 * @internal
 * Internal render function for the Primitive component. Handles polymorphic rendering, child cloning, and ref forwarding.
 * Not for public use; use the exported Primitive component instead.
 *
 * @param {PrimitiveProps<any>} props - Props for the Primitive component.
 * @param {Ref<any>} ref - Forwarded ref for the rendered element or cloned child.
 * @returns {ReactElement | null} The rendered element, or null when cloning fails.
 */
const PrimitiveFn = <E extends ElementType = (typeof HTMLElements)['Div']>(
  props: PrimitiveProps<E>,
  ref: Ref<any>
): ReactElement | null => {
  const { as, asChild, children, ...rest } = props;

  if (asChild) {
    const child: Element = Children.only(children);

    if (!isValidElement(child)) return null;

    return cloneElement(child as ReactElement<any>, {
      ...props,
      ref: (child as any).ref ?? ref
    });
  }

  return createElement(
    as ?? DEFAULT_PRIMITIVE_TAG,
    { ref, ...rest } as any,
    children
  );
};

/**
 * The public Primitive component for Necto.
 *
 * @param {PrimitiveProps<any>} props - Props for the polymorphic Primitive component.
 * @param {Ref<any>} ref - Forwarded ref for the rendered element or cloned child.
 * @returns {ReactElement | null} The rendered element or null.
 */
export const Primitive: (<E extends ElementType = (typeof HTMLElements)['Div']>(
  props: PrimitiveProps<E> & { ref?: Ref<any> }
) => ReactElement | null) &
  FunctionComponent<PrimitiveProps<ElementType>> &
  Primitives & { [k: string]: any } = new Proxy(forwardRef(PrimitiveFn), {
  get(
    target: ForwardRefExoticComponent<Omit<any, 'ref'> & RefAttributes<any>>,
    prop: string | symbol,
    receiver: any
  ): any {
    if (!tagComponents) {
      tagComponents = {};

      for (const tag of DOM.HTML_TAGS) {
        const Component: ForwardRefExoticComponent<
          Omit<any, 'ref'> & RefAttributes<any>
        > = forwardRef<any, any>(
          (props: Omit<any, 'ref'>, ref: ForwardedRef<any>) =>
            PrimitiveFn(
              { ...(props as any), as: tag } as PrimitiveProps<any>,
              ref
            )
        );

        tagComponents[tag] = Component;
        tagComponents[capitalize(tag)] = Component;
      }
    }

    if (typeof prop === 'string' && prop in tagComponents) {
      return tagComponents[prop];
    }

    return Reflect.get(target, prop, receiver);
  }
}) as any;

Primitive.displayName = PRIMITIVE_NAME;
