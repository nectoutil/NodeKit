/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/** @jsxImportSource @emotion/react */
import cn from 'clsx';
import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { Button } from '../Button/Button';
import { FaDropbox } from 'react-icons/fa';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { DropboxButtonProps } from './Dropbox.types';

const DROPBOX_BUTTON_NAME: string = 'DropboxButton' as const;

const DROPBOX_BG_COLOR: string = '#0061ff';
const DROPBOX_BG_HOVER_COLOR: string = '#0056e0';
const DROPBOX_BG_ACTIVE_COLOR: string = '#004bc5';
const DROPBOX_TEXT_COLOR: string = '#ffffff';
const DROPBOX_FOCUS_SHADOW_COLOR: string = 'rgba(0, 97, 255, 0.3)';

const StyledDropboxButton = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 18px;
  min-height: 40px;
  width: 100%;
  background-color: var(--necto-dropbox-bg, ${DROPBOX_BG_COLOR});
  color: var(--necto-dropbox-text, ${DROPBOX_TEXT_COLOR});
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
    background-color: var(--necto-dropbox-bg-hover, ${DROPBOX_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-dropbox-bg-active, ${DROPBOX_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--necto-dropbox-focus-shadow, ${DROPBOX_FOCUS_SHADOW_COLOR});
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: var(--necto-dropbox-bg, ${DROPBOX_BG_COLOR});
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
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      className={cn(`_necto:${DROPBOX_BUTTON_NAME}`, className)}
      {...props}
    >
      {children}
    </StyledDropboxButton>
  )
);

DropboxButton.displayName = DROPBOX_BUTTON_NAME;
