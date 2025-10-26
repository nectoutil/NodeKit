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
import { FaLinkedin } from 'react-icons/fa';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { LinkedInButtonProps } from './LinkedIn.types';
import type { IStyledComponent } from 'styled-components';

const LINKEDIN_BUTTON_NAME = 'LinkedInButton';

const StyledLinkedInButton: IStyledComponent<'web', any> = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 12px;
  min-height: 40px;
  background-color: #0a66c2;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  transition: background-color 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: #004182;
  }

  &:active {
    background-color: #003366;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.3);
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: #0a66c2;
    }
  `}
`;

export const LinkedInButton: ForwardRefExoticComponent<Omit<LinkedInButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  LinkedInButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with LinkedIn',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: LinkedInButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledLinkedInButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={className}
      iconPosition={iconPosition}
      icon={<FaLinkedin size={iconSize} />}
      {...props}
    >
      {children}
    </StyledLinkedInButton>
  )
);

LinkedInButton.displayName = LINKEDIN_BUTTON_NAME;
