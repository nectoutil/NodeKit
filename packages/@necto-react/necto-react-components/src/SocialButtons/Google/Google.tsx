/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from 'react';
import styled from 'styled-components';
import { Button } from '../Button/Button';
import { FcGoogle } from 'react-icons/fc';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { GoogleButtonProps } from './Google.types';
import type { IStyledComponent } from 'styled-components';

const GOOGLE_BUTTON_NAME = 'GoogleButton';

const StyledGoogleButton: IStyledComponent<'web', any> = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 12px 0 12px;
  min-height: 40px;
  background-color: #ffffff;
  color: #1f1f1f;
  border: 1px solid #747775;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Roboto Medium', system-ui, -apple-system, sans-serif;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  transition: background-color 0.2s, box-shadow 0.2s, border-color 0.2s, color 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }

  &:active {
    background-color: #eceff1;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.3);
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: #ffffff;
    }
  `}
`;

export const GoogleButton: ForwardRefExoticComponent<Omit<GoogleButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  GoogleButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Google',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: GoogleButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledGoogleButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={className}
      iconPosition={iconPosition}
      icon={<FcGoogle size={iconSize} />}
      {...props}
    >
      {children}
    </StyledGoogleButton>
  )
);

GoogleButton.displayName = GOOGLE_BUTTON_NAME;
