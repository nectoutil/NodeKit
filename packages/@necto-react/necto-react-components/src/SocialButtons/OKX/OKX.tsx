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
import { SiOkx } from 'react-icons/si';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { OKXButtonProps } from './OKX.types';

const OKX_BUTTON_NAME = 'OKXButton';

const OKX_BG_COLOR: string = '#000000';
const OKX_BG_HOVER_COLOR: string = '#1a1a1a';
const OKX_BG_ACTIVE_COLOR: string = '#333333';
const OKX_TEXT_COLOR: string = '#ffffff';
const OKX_FOCUS_SHADOW_COLOR: string = 'rgba(0, 0, 0, 0.3)';

const StyledOKXButton = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 12px 0 12px;
  min-height: 40px;
  width: 100%;
  background-color: var(--necto-okx-bg, ${OKX_BG_COLOR});
  color: var(--necto-okx-text, ${OKX_TEXT_COLOR});
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
    background-color: var(--necto-okx-bg-hover, ${OKX_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-okx-bg-active, ${OKX_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--necto-okx-focus-shadow, ${OKX_FOCUS_SHADOW_COLOR});
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: var(--necto-okx-bg, ${OKX_BG_COLOR});
    }
  `}
`;

export const OKXButton: ForwardRefExoticComponent<Omit<OKXButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  OKXButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with OKX',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: OKXButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledOKXButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={cn(`_necto:${OKX_BUTTON_NAME}`, className)}
      iconPosition={iconPosition}
      icon={<SiOkx size={iconSize} />}
      {...props}
    >
      {children}
    </StyledOKXButton>
  )
);

OKXButton.displayName = OKX_BUTTON_NAME;
