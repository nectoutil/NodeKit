/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cn from 'clsx';
import { forwardRef } from 'react';
import styled from 'styled-components';
import { FaApple } from 'react-icons/fa';
import { Button } from '../Button/Button';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { AppleButtonProps } from './Apple.types';
import type { IStyledComponent } from 'styled-components';

const APPLE_BUTTON_NAME: string = 'AppleButton' as const;

const StyledAppleButton: IStyledComponent<'web', any> = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 18px;
  min-height: 40px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  font-family: 'Roboto', system-ui, -apple-system, sans-serif;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  transition: background-color 0.2s, box-shadow 0.2s, border-color 0.2s, color 0.2s;

  &:hover {
    background-color: #1a1a1a;
  }

  &:active {
    background-color: #333333;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.3);
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: #000000;
    }
  `}
`;

export const AppleButton: ForwardRefExoticComponent<Omit<AppleButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  AppleButtonProps
>(
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
      iconSize={iconSize}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      className={cn(className, `_necto:${APPLE_BUTTON_NAME}`)}
      {...props}
    >
      {children}
    </StyledAppleButton>
  )
);

AppleButton.displayName = APPLE_BUTTON_NAME;
