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
import { FaDropbox } from 'react-icons/fa';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { DropboxButtonProps } from './Dropbox.types';
import type { IStyledComponent } from 'styled-components';

const DROPBOX_BUTTON_NAME: string = 'DropboxButton' as const;

const StyledDropboxButton: IStyledComponent<'web', any> = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 18px;
  min-height: 40px;
  background-color: #0061ff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Roboto', system-ui, -apple-system, sans-serif;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  transition: background-color 0.2s, box-shadow 0.2s, border-color 0.2s, color 0.2s;

  &:hover {
    background-color: #0056e0;
  }

  &:active {
    background-color: #004bc5;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 97, 255, 0.3);
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: #0061ff;
    }
  `}
`;

export const DropboxButton: ForwardRefExoticComponent<Omit<DropboxButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  DropboxButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Dropbox',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: DropboxButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledDropboxButton
      as={as}
      ref={ref}
      asChild={asChild}
      icon={<FaDropbox size={iconSize} />}
      showIcon={showIcon}
      iconSize={iconSize}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      className={cn(className, `_necto:${DROPBOX_BUTTON_NAME}`)}
      {...props}
    >
      {children}
    </StyledDropboxButton>
  )
);

DropboxButton.displayName = DROPBOX_BUTTON_NAME;
