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
    width = 10,
    height = 5,
    ref: propRef,
    style: userStyle,
    ...rest
  } = props;

  const arrowStyles: CSSProperties = {
    position: 'absolute'
  };

  // Extract the side from compound placements (e.g., 'top-start' → 'top')
  const [side, alignment] = (placement?.split('-') ?? []) as [
    'top' | 'bottom' | 'left' | 'right' | undefined,
    'start' | 'end' | undefined
  ];

  // SVG default points down. Rotation transforms flip it per placement.
  // translateY/X pushes the arrow outside the tooltip content edge.
  let svgTransform: string | undefined;

  switch (side) {
    case 'top':
    case 'bottom': {
      // Horizontal centering or alignment
      switch (alignment) {
        case 'start':
          arrowStyles.left = width;
          break;
        case 'end':
          arrowStyles.right = width;
          break;
        default:
          arrowStyles.left = '50%';
          arrowStyles.transform = 'translateX(-50%)';
          break;
      }

      if (side === 'top') {
        arrowStyles.bottom = 0;
        svgTransform = 'translateY(100%)';
      } else {
        arrowStyles.top = 0;
        svgTransform = 'translateY(-100%) rotate(180deg)';
      }

      break;
    }

    case 'left':
    case 'right': {
      // Vertical centering or alignment
      switch (alignment) {
        case 'start':
          arrowStyles.top = height;
          break;
        case 'end':
          arrowStyles.bottom = height;
          break;
        default:
          arrowStyles.top = '50%';
          arrowStyles.transform = 'translateY(-50%)';
          break;
      }

      if (side === 'left') {
        arrowStyles.right = 0;
        svgTransform = 'translateX(100%) rotate(90deg)';
      } else {
        arrowStyles.left = 0;
        svgTransform = 'translateX(-100%) rotate(-90deg)';
      }

      break;
    }
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
            transform: svgTransform,
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
