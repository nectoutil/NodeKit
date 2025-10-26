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
import { FcGoogle } from 'react-icons/fc';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { GoogleButtonProps } from './Google.types';

const GOOGLE_BUTTON_NAME = 'GoogleButton';

const GOOGLE_BG_COLOR: string = '#ffffff';
const GOOGLE_BG_HOVER_COLOR: string = '#f8f9fa';
const GOOGLE_BG_ACTIVE_COLOR: string = '#eceff1';
const GOOGLE_TEXT_COLOR: string = '#1f1f1f';
const GOOGLE_BORDER_COLOR: string = '#747775';
const GOOGLE_FOCUS_SHADOW_COLOR: string = 'rgba(66, 133, 244, 0.3)';

const StyledGoogleButton = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 12px 0 12px;
  min-height: 40px;
  width: 100%;
  background-color: var(--necto-google-bg, ${GOOGLE_BG_COLOR});
  color: var(--necto-google-text, ${GOOGLE_TEXT_COLOR});
  border: 1px solid var(--necto-google-border, ${GOOGLE_BORDER_COLOR});
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
    background-color: var(--necto-google-bg-hover, ${GOOGLE_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-google-bg-active, ${GOOGLE_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--necto-google-focus-shadow, ${GOOGLE_FOCUS_SHADOW_COLOR});
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: var(--necto-google-bg, ${GOOGLE_BG_COLOR});
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
      className={cn(`_necto:${GOOGLE_BUTTON_NAME}`, className)}
      iconPosition={iconPosition}
      icon={<FcGoogle size={iconSize} />}
      {...props}
    >
      {children}
    </StyledGoogleButton>
  )
);

GoogleButton.displayName = GOOGLE_BUTTON_NAME;
