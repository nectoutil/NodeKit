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
import { Button } from '../Button/Button';
import { FaXTwitter } from 'react-icons/fa6';

import type {
  ReactElement,
  ForwardedRef,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react';
import type { XButtonProps } from './X.types';

const X_BUTTON_NAME = 'XButton';

const X_BG_COLOR: string = '#000000';
const X_BG_HOVER_COLOR: string = '#1a1a1a';
const X_BG_ACTIVE_COLOR: string = '#333333';
const X_TEXT_COLOR: string = '#ffffff';
const X_FOCUS_SHADOW_COLOR: string = 'rgba(0, 0, 0, 0.3)';

const StyledXButton = styled(Button)<{
  $disabled?: boolean;
}>`
  padding: 0 12px 0 12px;
  background-color: var(--necto-x-bg, ${X_BG_COLOR});
  color: var(--necto-x-text, ${X_TEXT_COLOR});
  border: none;
  font-weight: 500;
  font-family: 'Roboto', system-ui, -apple-system, sans-serif;

  &:hover {
    background-color: var(--necto-x-bg-hover, ${X_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-x-bg-active, ${X_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px var(--necto-x-focus-shadow, ${X_FOCUS_SHADOW_COLOR});
  }

  ${(props) =>
    props.$disabled &&
    `
    &:hover,
    &:active {
      background-color: var(--necto-x-bg, ${X_BG_COLOR});
    }
  `}
`;

export const XButton: ForwardRefExoticComponent<
  Omit<XButtonProps, 'ref'> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, XButtonProps>(
  (
    {
      as,
      asChild,
      children = 'Continue with X',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: XButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledXButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={cn(`_necto:${X_BUTTON_NAME}`, className)}
      iconPosition={iconPosition}
      icon={<FaXTwitter size={iconSize} />}
      {...props}
    >
      {children}
    </StyledXButton>
  )
);

XButton.displayName = X_BUTTON_NAME;
