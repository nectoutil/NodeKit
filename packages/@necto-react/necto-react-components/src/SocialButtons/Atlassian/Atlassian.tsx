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
import { FaAtlassian } from 'react-icons/fa';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { AtlassianButtonProps } from './Atlassian.types';

const ATLASSIAN_BUTTON_NAME: string = 'AtlassianButton' as const;

const ATLASSIAN_BG_COLOR: string = '#0052cc';
const ATLASSIAN_BG_HOVER_COLOR: string = '#0747a6';
const ATLASSIAN_BG_ACTIVE_COLOR: string = '#003d99';
const ATLASSIAN_TEXT_COLOR: string = '#ffffff';
const ATLASSIAN_FOCUS_SHADOW_COLOR: string = 'rgba(0, 82, 204, 0.3)';

const StyledAtlassianButton = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 18px;
  min-height: 40px;
  width: 100%;
  background-color: var(--necto-atlassian-bg, ${ATLASSIAN_BG_COLOR});
  color: var(--necto-atlassian-text, ${ATLASSIAN_TEXT_COLOR});
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
    background-color: var(--necto-atlassian-bg-hover, ${ATLASSIAN_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-atlassian-bg-active, ${ATLASSIAN_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--necto-atlassian-focus-shadow, ${ATLASSIAN_FOCUS_SHADOW_COLOR});
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: var(--necto-atlassian-bg, ${ATLASSIAN_BG_COLOR});
    }
  `}
`;

export const AtlassianButton: ForwardRefExoticComponent<Omit<AtlassianButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  AtlassianButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Atlassian',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: AtlassianButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledAtlassianButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      icon={<FaAtlassian size={iconSize} />}
      className={cn(`_necto:${ATLASSIAN_BUTTON_NAME}`, className)}
      {...props}
    >
      {children}
    </StyledAtlassianButton>
  )
);

AtlassianButton.displayName = ATLASSIAN_BUTTON_NAME;
