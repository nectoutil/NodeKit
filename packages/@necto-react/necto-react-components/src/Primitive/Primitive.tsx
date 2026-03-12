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
import { Children, forwardRef, isValidElement, cloneElement } from 'react';

import { DEFAULT_PRIMITIVE_TAG, PRIMITIVE_NAME } from './constants';

import type { PrimitiveProps, Primitives } from './Primitive.types';
import type {
  ElementType,
  Ref,
  ReactElement,
  FC,
  ForwardRefExoticComponent
} from 'react';

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
  { as, asChild, children, ...props }: PrimitiveProps<E>,
  ref: Ref<any>
): ReactElement | null => {
  const Tag = (as ?? DEFAULT_PRIMITIVE_TAG) as ElementType;

  if (asChild) {
    const child: Element = Children.only(children);
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
/**
 * Build the tag→component map lazily so that the module-level
 * `DOM.HTML_TAGS` import from `@necto/constants` is guaranteed to be
 * initialised, even when bundlers split these packages into separate chunks.
 */
const buildTagComponents = (): Record<string, any> =>
  DOM.HTML_TAGS.reduce(
    (acc: Record<string, any>, tag: string): Record<string, any> => {
      const lower: string = tag;
      const upper: string = tag[0].toUpperCase() + tag.slice(1);

      const Comp: ForwardRefExoticComponent<
        Omit<any, 'ref'> & React.RefAttributes<any>
      > = forwardRef<any, any>((props, ref) =>
        PrimitiveFn({ ...(props as any), as: tag } as PrimitiveProps<any>, ref)
      );

      acc[lower] = Comp;
      acc[upper] = Comp;

      return acc;
    },
    {} as Record<string, any>
  );

let _tagComponents: Record<string, any> | undefined;

const basePrimitive = forwardRef(PrimitiveFn);

export const Primitive: (<E extends ElementType = (typeof HTMLElements)['Div']>(
  props: PrimitiveProps<E> & { ref?: Ref<any> }
) => ReactElement | null) &
  FC<PrimitiveProps<ElementType>> &
  Primitives & { [k: string]: any } = new Proxy(basePrimitive, {
  get(target, prop, receiver) {
    if (!_tagComponents) _tagComponents = buildTagComponents();
    if (typeof prop === 'string' && prop in _tagComponents) return _tagComponents[prop];
    return Reflect.get(target, prop, receiver);
  },
}) as any;

Primitive.displayName = PRIMITIVE_NAME;
