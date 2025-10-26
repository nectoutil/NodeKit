/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { Button } from '../Button/Button';
import { MicrosoftIcon } from './Microsoft.icon';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { MicrosoftButtonProps } from './Microsoft.types';

const MICROSOFT_BUTTON_NAME = 'MicrosoftButton';

const StyledMicrosoftButton = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 18px;
  min-height: 41px;
  background-color: #2f2f2f;
  color: #ffffff;
  border: 1px solid #8c8c8c;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  transition: background-color 0.2s, box-shadow 0.2s, border-color 0.2s, color 0.2s;

  &:hover {
    background-color: #3d3d3d;
  }

  &:active {
    background-color: #4a4a4a;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(47, 47, 47, 0.3);
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: #2f2f2f;
    }
  `}
`;

export const MicrosoftButton: ForwardRefExoticComponent<Omit<MicrosoftButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  MicrosoftButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Sign in with Microsoft',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 18,
      disabled,
      className,
      ...props
    }: MicrosoftButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledMicrosoftButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={className}
      iconPosition={iconPosition}
      icon={<MicrosoftIcon size={iconSize} />}
      {...props}
    >
      {children}
    </StyledMicrosoftButton>
  )
);

MicrosoftButton.displayName = MICROSOFT_BUTTON_NAME;
