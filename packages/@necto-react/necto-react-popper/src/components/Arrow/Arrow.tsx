/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from 'react';
import { Primitive } from '@necto-react/components';

import { ARROW_NAME } from './constants';

import type { Side } from '@necto/popper';
import type { Ref, ReactElement } from 'react';
import type { ArrowProps } from './Arrow.types';

/**
 * @internal
 * Internal render function for the Arrow component. Uses arrowX/arrowY from
 * the arrow middleware for pixel-perfect positioning.
 */
const ArrowFn = (props: ArrowProps, ref: Ref<HTMLDivElement>): ReactElement => {
  const {
    children,
    placement,
    className,
    arrowX,
    arrowY,
    width = 10,
    height = 5,
    ref: propRef,
    style: userStyle,
    ...rest
  } = props;

  const side = (placement?.split('-')[0] ?? 'top') as Side;
  const isVertical = side === 'top' || side === 'bottom';

  return (
    <span
      ref={propRef ?? ref}
      style={{
        position: 'absolute',
        left: arrowX != null ? arrowX : undefined,
        top:
          arrowY != null
            ? arrowY + (isVertical ? 0 : (width - height) / 2)
            : undefined,
        [{ top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[side]]:
          0,
        transformOrigin: {
          top: '',
          right: '0 0',
          bottom: 'center 0',
          left: '100% 0'
        }[side],
        transform: {
          top: 'translateY(100%)',
          right: 'translateY(50%) rotate(90deg) translateX(-50%)',
          bottom: 'rotate(180deg)',
          left: 'translateY(50%) rotate(-90deg) translateX(50%)'
        }[side]
      }}
    >
      <Primitive.Div
        className={className}
        data-placement={placement ?? undefined}
        style={{ display: 'block', ...userStyle }}
        {...rest}
      >
        {children != null ? (
          typeof children === 'function' ? (
            children({ placement })
          ) : (
            children
          )
        ) : (
          <svg
            width={width}
            height={height}
            aria-hidden="true"
            viewBox="0 0 30 10"
            preserveAspectRatio="none"
            style={{ display: 'block' }}
          >
            <polygon points="0,0 30,0 15,10" fill="currentColor" />
          </svg>
        )}
      </Primitive.Div>
    </span>
  );
};

/**
 * The public PopperArrow component for Necto.
 * Renders a positioned arrow element using coordinates from the arrow middleware.
 */
export const Arrow = forwardRef<HTMLDivElement, ArrowProps>(ArrowFn);

Arrow.displayName = ARROW_NAME;
