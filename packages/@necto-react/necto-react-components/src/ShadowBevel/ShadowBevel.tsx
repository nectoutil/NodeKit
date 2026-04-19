/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cn from 'clsx';
import { forwardRef } from 'react';
import styled from '@emotion/styled';

import { Primitive } from '../Primitive';
import { SHADOW_BEVEL_NAME } from './constants';

import type {
  Ref,
  ReactElement,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react';
import type { ShadowBevelProps } from './ShadowBevel.types';

const StyledShadowBevel = styled(Primitive)`
  --necto-shadow-bevel-content: '';
  --necto-shadow-bevel-z-index: 0;
  --necto-shadow-bevel-border-radius: 0;
  --necto-shadow-bevel-box-shadow: none;

  overflow: clip;
  z-index: 0;
  position: relative;
  box-shadow: var(--necto-shadow-bevel-box-shadow);
  border-radius: var(--necto-shadow-bevel-border-radius);

  &::before {
    content: var(--necto-shadow-bevel-content);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: var(--necto-shadow-bevel-z-index);
    pointer-events: none;
    mix-blend-mode: luminosity;
    border-radius: inherit;
    box-shadow:
      1px 0 0 0 rgba(0, 0, 0, 0.13) inset,
      -1px 0 0 0 rgba(0, 0, 0, 0.13) inset,
      0 -1px 0 0 rgba(0, 0, 0, 0.17) inset,
      0 1px 0 0 rgba(204, 204, 204, 0.5) inset;
  }
`;

const ShadowBevelFn = (
  props: ShadowBevelProps,
  ref: Ref<HTMLElement>
): ReactElement => {
  const {
    style,
    children,
    boxShadow,
    borderRadius,
    className,
    zIndex = 0,
    bevel = true,
    ...others
  } = props;

  return (
    <StyledShadowBevel
      ref={ref}
      {...others}
      className={cn(className, `_necto:${SHADOW_BEVEL_NAME}`)}
      style={{
        ...style,
        '--necto-shadow-bevel-z-index': zIndex,
        '--necto-shadow-bevel-content': bevel ? '""' : 'none',
        '--necto-shadow-bevel-box-shadow':
          typeof boxShadow === 'number'
            ? `var(--necto-shadow-${boxShadow})`
            : (boxShadow ?? 'none'),
        '--necto-shadow-bevel-border-radius':
          typeof borderRadius === 'number'
            ? `${borderRadius}px`
            : (borderRadius ?? '0')
      }}
    >
      {children}
    </StyledShadowBevel>
  );
};

export const ShadowBevel: ((
  props: ShadowBevelProps & { ref?: Ref<HTMLElement> }
) => ReactElement) & {
  Root: ForwardRefExoticComponent<
    ShadowBevelProps & RefAttributes<HTMLElement>
  >;
  displayName?: string;
} = Object.assign(forwardRef(ShadowBevelFn), {
  Root: forwardRef(ShadowBevelFn)
}) as unknown as ((
  props: ShadowBevelProps & { ref?: Ref<HTMLElement> }
) => ReactElement) & {
  Root: ForwardRefExoticComponent<
    ShadowBevelProps & RefAttributes<HTMLElement>
  >;
  displayName?: string;
};

ShadowBevel.displayName = SHADOW_BEVEL_NAME;
