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
import { FaGithub } from 'react-icons/fa';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { GitHubButtonProps } from './GitHub.types';

const GITHUB_BUTTON_NAME: string = 'GitHubButton' as const;

const StyledGitHubButton = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 18px;
  min-height: 40px;
  background-color: #24292f;
  color: #ffffff;
  border: 1px solid #24292f;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  transition: background-color 0.2s, box-shadow 0.2s, border-color 0.2s, color 0.2s;

  &:hover {
    background-color: #2c3237;
  }

  &:active {
    background-color: #373e47;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(36, 41, 47, 0.3);
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: #24292f;
    }
  `}
`;

export const GitHubButton: ForwardRefExoticComponent<Omit<GitHubButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  GitHubButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with GitHub',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: GitHubButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledGitHubButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      iconSize={iconSize}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      icon={<FaGithub size={iconSize} />}
      className={cn(className, `_necto:${GITHUB_BUTTON_NAME}`)}
      {...props}
    >
      {children}
    </StyledGitHubButton>
  )
);

GitHubButton.displayName = GITHUB_BUTTON_NAME;
