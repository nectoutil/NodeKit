/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { Button } from '../Button/Button';
import { FaSpotify } from 'react-icons/fa';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { SpotifyButtonProps } from './Spotify.types';

const SPOTIFY_BUTTON_NAME = 'SpotifyButton';

const StyledSpotifyButton = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 12px 0 12px;
  min-height: 40px;
  background-color: #1db954;
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
    background-color: #1aa64b;
  }

  &:active {
    background-color: #179443;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(29, 185, 84, 0.3);
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: #1db954;
    }
  `}
`;

export const SpotifyButton: ForwardRefExoticComponent<Omit<SpotifyButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  SpotifyButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Spotify',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: SpotifyButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledSpotifyButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={className}
      iconPosition={iconPosition}
      icon={<FaSpotify size={iconSize} />}
      {...props}
    >
      {children}
    </StyledSpotifyButton>
  )
);

SpotifyButton.displayName = SPOTIFY_BUTTON_NAME;
