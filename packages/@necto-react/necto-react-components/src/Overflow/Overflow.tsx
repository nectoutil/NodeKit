/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// biome-ignore-all lint/suspicious/noExplicitAny: Polymorphic + generic component requires any for forwardRef typing.

import { forwardRef } from 'react';
import { useOverflow } from '@necto-react/hooks';

import { Primitive } from '../Primitive';
import { OVERFLOW_NAME } from './constants';

import type { Ref, ForwardedRef, ReactElement } from 'react';
import type { OverflowProps } from './Overflow.types';

function OverflowFn<T>(
  props: OverflowProps<T>,
  ref: ForwardedRef<HTMLElement>
): ReactElement | null {
  const {
    as,
    items,
    style,
    className,
    minVisible = 1,
    collapseFrom = 'end',

    // Slot renderers
    renderItem,
    renderOverflow,
    ...rest
  } = props;

  const {
    isReady,
    spacerRef,
    containerRef,
    visibleItems,
    hiddenItems,
    hiddenCount
  } = useOverflow({ items, collapseFrom, minVisible });

  const overflowSlot: ReactElement | null =
    hiddenCount > 0 && renderOverflow
      ? (renderOverflow({
          hidden: hiddenItems,
          count: hiddenCount
        }) as ReactElement)
      : null;

  const setContainerRef = (node: HTMLElement | null): void => {
    containerRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return (
    <Primitive
      {...rest}
      as={as ?? 'div'}
      ref={setContainerRef}
      className={className}
      style={{
        minWidth: 0,
        display: 'flex',
        flexWrap: 'nowrap',
        visibility: isReady ? 'visible' : 'hidden',
        ...style
      }}
    >
      {collapseFrom === 'start' ? overflowSlot : null}
      {visibleItems.map(renderItem)}
      {collapseFrom === 'end' ? overflowSlot : null}

      <div
        aria-hidden="true"
        style={{ flexShrink: 1, width: 1, alignSelf: 'stretch' }}
        ref={(node: HTMLDivElement | null): void => {
          spacerRef.current = node;
        }}
      />
    </Primitive>
  );
}

/**
 * `forwardRef` doesn't preserve generic parameters. Cast the result so
 * consumers keep type inference on `T` (item type) at the call site.
 */
export const Overflow: (<T>(
  props: OverflowProps<T> & { ref?: Ref<HTMLElement> }
) => ReactElement | null) & {
  displayName?: string;
} = forwardRef(OverflowFn) as any;

(Overflow as any).displayName = OVERFLOW_NAME;
