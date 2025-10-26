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
import { Button } from '../Button/Button';
import { FaFacebook } from 'react-icons/fa6';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { FacebookButtonProps } from './Facebook.types';
import type { IStyledComponent } from 'styled-components';

const FACEBOOK_BUTTON_NAME: string = 'FacebookButton' as const;

const StyledFacebookButton: IStyledComponent<'web', any> = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 18px;
  min-height: 40px;
  background-color: #1877f2;
  color: #ffffff;
  border: 1px solid #1877f2;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  transition: background-color 0.2s, box-shadow 0.2s, border-color 0.2s, color 0.2s;

  &:hover {
    background-color: #166fe5;
  }

  &:active {
    background-color: #1467d6;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(24, 119, 242, 0.3);
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: #1877f2;
    }
  `}
`;

export const FacebookButton: ForwardRefExoticComponent<Omit<FacebookButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  FacebookButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Facebook',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: FacebookButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledFacebookButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      iconSize={iconSize}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      icon={<FaFacebook size={iconSize} />}
      className={cn(className, `_necto:${FACEBOOK_BUTTON_NAME}`)}
      {...props}
    >
      {children}
    </StyledFacebookButton>
  )
);

FacebookButton.displayName = FACEBOOK_BUTTON_NAME;
