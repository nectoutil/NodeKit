/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { CSSProperties } from 'react';
import type { Side } from '@necto/popper';
import type { ArrowProps } from './Arrow.types';

export interface ArrowContextValue extends ArrowProps {
  placement: Side | null;
}

export { PopperArrow as Arrow };

export function PopperArrow(props: ArrowContextValue) {
  const {
    ref,
    placement,
    children,
    style: userStyle,
    className,
    ...rest
  } = props;

  const isVertical = placement === 'top' || placement === 'bottom';

  const style: CSSProperties = {
    position: 'absolute',
    transform: isVertical ? 'translateX(-50%)' : 'translateY(-50%)'
  };

  if (placement != null) {
    style[placement] = '100%';
  }

  const renderedChildren =
    typeof children === 'function' ? children({ placement }) : children;

  return (
    <div
      ref={ref}
      className={className}
      {...rest}
      style={{
        ...style,
        ...userStyle
      }}
      data-placement={placement ?? undefined}
    >
      {renderedChildren}
    </div>
  );
}
