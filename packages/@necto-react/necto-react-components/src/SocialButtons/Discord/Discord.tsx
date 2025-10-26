/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cn from 'clsx';
import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { Button } from '../Button/Button';
import { FaDiscord } from 'react-icons/fa';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { DiscordButtonProps } from './Discord.types';

const DISCORD_BUTTON_NAME: string = 'DiscordButton' as const;

const StyledDiscordButton = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 18px;
  min-height: 40px;
  background-color: #5865f2;
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
    background-color: #4752d9;
  }

  &:active {
    background-color: #3c45c0;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(88, 101, 242, 0.3);
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: #5865f2;
    }
  `}
`;

export const DiscordButton: ForwardRefExoticComponent<Omit<DiscordButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  DiscordButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Discord',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: DiscordButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledDiscordButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      icon={<FaDiscord size={iconSize} />}
      className={cn(className, `_necto:${DISCORD_BUTTON_NAME}`)}
      {...props}
    >
      {children}
    </StyledDiscordButton>
  )
);

DiscordButton.displayName = DISCORD_BUTTON_NAME;
