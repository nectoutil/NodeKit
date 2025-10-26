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
import { BitbucketIcon } from './Bitbucket.icon';

import type { IStyledComponent } from 'styled-components';
import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { BitbucketButtonProps } from './Bitbucket.types';

const BITBUCKET_BUTTON_NAME: string = 'BitbucketButton' as const;

const StyledBitbucketButton: IStyledComponent<'web', any> = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 18px;
  min-height: 40px;
  background-color: #0052cc;
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
    background-color: #0747a6;
  }

  &:active {
    background-color: #003d99;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.3);
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: #0052cc;
    }
  `}
`;

export const BitbucketButton: ForwardRefExoticComponent<Omit<BitbucketButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  BitbucketButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Bitbucket',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 22,
      disabled,
      className,
      ...props
    }: BitbucketButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledBitbucketButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      iconSize={iconSize}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      icon={<BitbucketIcon size={iconSize} />}
      className={cn(className, `_necto:${BITBUCKET_BUTTON_NAME}`)}
      {...props}
    >
      {children}
    </StyledBitbucketButton>
  )
);

BitbucketButton.displayName = BITBUCKET_BUTTON_NAME;
