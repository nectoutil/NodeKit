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
import { FaApple } from 'react-icons/fa';
import { Button } from '../Button/Button';

import type { AppleButtonProps } from './Apple.types';
import type {
  ReactElement,
  ForwardedRef,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react';

const APPLE_BUTTON_NAME: string = 'AppleButton' as const;

const APPLE_BG_COLOR: string = '#000000';
const APPLE_BG_HOVER_COLOR: string = '#1a1a1a';
const APPLE_BG_ACTIVE_COLOR: string = '#333333';
const APPLE_TEXT_COLOR: string = '#ffffff';
const APPLE_FOCUS_SHADOW_COLOR: string = 'rgba(0, 0, 0, 0.3)';

const StyledAppleButton = styled(Button)<{
  $disabled?: boolean;
}>`
  padding: 0 18px;
  background-color: var(--necto-apple-bg, ${APPLE_BG_COLOR});
  color: var(--necto-apple-text, ${APPLE_TEXT_COLOR});
  border: none;
  font-weight: 400;
  font-family: 'Roboto', system-ui, -apple-system, sans-serif;

  &:hover {
    background-color: var(--necto-apple-bg-hover, ${APPLE_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-apple-bg-active, ${APPLE_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px var(--necto-apple-focus-shadow, ${APPLE_FOCUS_SHADOW_COLOR});
  }

  ${(props) =>
    props.$disabled &&
    `
    &:hover,
    &:active {
      background-color: var(--necto-apple-bg, ${APPLE_BG_COLOR});
    }
  `}
`;

export const AppleButton: ForwardRefExoticComponent<
  Omit<AppleButtonProps, 'ref'> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, AppleButtonProps>(
  (
    {
      as,
      asChild,
      children = 'Continue with Apple',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: AppleButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledAppleButton
      as={as}
      ref={ref}
      asChild={asChild}
      icon={<FaApple size={iconSize} />}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      className={cn(`_necto:${APPLE_BUTTON_NAME}`, className)}
      {...props}
    >
      {children}
    </StyledAppleButton>
  )
);

AppleButton.displayName = APPLE_BUTTON_NAME;
