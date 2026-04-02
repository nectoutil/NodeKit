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

import type { ArrowProps } from './Arrow.types';
import type { Ref, ReactElement, CSSProperties } from 'react';
import type { Side } from '@necto/popper';

const ROTATION_TRANSFORMS: Record<Side, string> = {
  top: 'translateY(100%)',
  right: 'translateY(50%) rotate(90deg) translateX(-50%)',
  bottom: 'rotate(180deg)',
  left: 'translateY(50%) rotate(-90deg) translateX(50%)'
};

/**
 * @internal
 * Internal render function for the Arrow component. Handles positioning,
 * centering, and rotation of the arrow element based on the parent popper's placement.
 * Renders a default SVG triangle when no children are provided.
 *
 * @param {ArrowProps} props - The props for the Arrow component.
 * @param {Ref<HTMLDivElement>} ref - Forwarded ref for the arrow element.
 * @returns {ReactElement} The rendered arrow element.
 */
const ArrowFn = (props: ArrowProps, ref: Ref<HTMLDivElement>): ReactElement => {
  const {
    children,
    placement,
    className,
    ref: propRef,
    style: userStyle,
    width = 10,
    height = 5,
    ...rest
  } = props;

  const arrowStyles: CSSProperties = {
    position: 'absolute'
  };

  if (placement === 'top' || placement === 'bottom') {
    arrowStyles.left = '50%';
    arrowStyles.transform = 'translateX(-50%)';
  } else if (placement === 'left' || placement === 'right') {
    arrowStyles.top = '50%';
    arrowStyles.transform = 'translateY(-50%)';
  }

  if (placement != null) {
    arrowStyles[placement] = '100%';
  }

  if (userStyle?.transform) {
    arrowStyles.transform =
      `${arrowStyles.transform ?? ''} ${userStyle.transform}`.trim();
  }

  return (
    <Primitive.Div
      ref={propRef ?? ref}
      className={className}
      data-placement={placement ?? undefined}
      style={{ ...arrowStyles, ...userStyle, transform: arrowStyles.transform }}
      {...rest}
    >
      {children != null ? (
        typeof children === 'function' ? (
          children({ placement })
        ) : (
          children
        )
      ) : (
        <span
          style={{
            display: 'inline-block',
            transform:
              placement != null ? ROTATION_TRANSFORMS[placement] : undefined,
            fontSize: 0,
            lineHeight: 0
          }}
        >
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
        </span>
      )}
    </Primitive.Div>
  );
};

/**
 * The public PopperArrow component for Necto.
 * Renders a positioned arrow element that centers itself based on the
 * parent popper's resolved placement. Includes a default SVG triangle
 * that rotates based on placement. Custom content via children is supported.
 *
 * @param {ArrowProps} props - The props for the PopperArrow component.
 * @param {Ref<HTMLDivElement>} ref - Forwarded ref for the arrow element.
 * @returns {ReactElement} The rendered arrow element.
 */
export const Arrow = forwardRef<HTMLDivElement, ArrowProps>(ArrowFn);

Arrow.displayName = ARROW_NAME;
