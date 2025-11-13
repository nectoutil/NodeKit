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

import type {
  ReactElement,
  ForwardedRef,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react';
import type { DiscordButtonProps } from './Discord.types';

const DISCORD_BUTTON_NAME: string = 'DiscordButton' as const;

const DISCORD_BG_COLOR: string = '#5865f2';
const DISCORD_BG_HOVER_COLOR: string = '#4752d9';
const DISCORD_BG_ACTIVE_COLOR: string = '#3c45c0';
const DISCORD_TEXT_COLOR: string = '#ffffff';
const DISCORD_FOCUS_SHADOW_COLOR: string = 'rgba(88, 101, 242, 0.3)';

const StyledDiscordButton = styled(Button)<{
  $disabled?: boolean;
}>`
  padding: 0 18px;
  background-color: var(--necto-discord-bg, ${DISCORD_BG_COLOR});
  color: var(--necto-discord-text, ${DISCORD_TEXT_COLOR});
  border: none;
  font-weight: 500;
  font-family: 'Roboto', system-ui, -apple-system, sans-serif;

  &:hover {
    background-color: var(--necto-discord-bg-hover, ${DISCORD_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-discord-bg-active, ${DISCORD_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px var(--necto-discord-focus-shadow, ${DISCORD_FOCUS_SHADOW_COLOR});
  }

  ${(props) =>
    props.$disabled &&
    `
    &:hover,
    &:active {
      background-color: var(--necto-discord-bg, ${DISCORD_BG_COLOR});
    }
  `}
`;

export const DiscordButton: ForwardRefExoticComponent<
  Omit<DiscordButtonProps, 'ref'> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, DiscordButtonProps>(
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
      className={cn(`_necto:${DISCORD_BUTTON_NAME}`, className)}
      {...props}
    >
      {children}
    </StyledDiscordButton>
  )
);

DiscordButton.displayName = DISCORD_BUTTON_NAME;
