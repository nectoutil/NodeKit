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

/**
 * @internal
 * Internal render function for the Arrow component. Handles positioning
 * and centering of the arrow element based on the parent popper's placement.
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

  // Merge user's transform with positioning transform so both apply
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
      {typeof children === 'function' ? children({ placement }) : children}
    </Primitive.Div>
  );
};

/**
 * The public PopperArrow component for Necto.
 * Renders a positioned arrow element that centers itself based on the
 * parent popper's resolved placement.
 *
 * @param {ArrowProps} props - The props for the PopperArrow component.
 * @param {Ref<HTMLDivElement>} ref - Forwarded ref for the arrow element.
 * @returns {ReactElement} The rendered arrow element.
 */
export const Arrow = forwardRef<HTMLDivElement, ArrowProps>(ArrowFn);

Arrow.displayName = ARROW_NAME;
