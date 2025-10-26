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
import { FaTiktok } from 'react-icons/fa';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { TikTokButtonProps } from './TikTok.types';

const TIKTOK_BUTTON_NAME = 'TikTokButton';

const TIKTOK_BG_COLOR: string = '#000000';
const TIKTOK_BG_HOVER_COLOR: string = '#1a1a1a';
const TIKTOK_BG_ACTIVE_COLOR: string = '#333333';
const TIKTOK_TEXT_COLOR: string = '#ffffff';
const TIKTOK_FOCUS_SHADOW_COLOR: string = 'rgba(0, 0, 0, 0.3)';

const StyledTikTokButton = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 12px 0 12px;
  min-height: 40px;
  width: 100%;
  background-color: var(--necto-tiktok-bg, ${TIKTOK_BG_COLOR});
  color: var(--necto-tiktok-text, ${TIKTOK_TEXT_COLOR});
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
    background-color: var(--necto-tiktok-bg-hover, ${TIKTOK_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-tiktok-bg-active, ${TIKTOK_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--necto-tiktok-focus-shadow, ${TIKTOK_FOCUS_SHADOW_COLOR});
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: var(--necto-tiktok-bg, ${TIKTOK_BG_COLOR});
    }
  `}
`;

export const TikTokButton: ForwardRefExoticComponent<Omit<TikTokButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  TikTokButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with TikTok',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: TikTokButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledTikTokButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={cn(`_necto:${TIKTOK_BUTTON_NAME}`, className)}
      iconPosition={iconPosition}
      icon={<FaTiktok size={iconSize} />}
      {...props}
    >
      {children}
    </StyledTikTokButton>
  )
);

TikTokButton.displayName = TIKTOK_BUTTON_NAME;
