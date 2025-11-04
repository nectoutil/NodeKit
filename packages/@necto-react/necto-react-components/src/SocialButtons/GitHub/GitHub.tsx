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

import type {
  ReactElement,
  ForwardedRef,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react';
import type { GitHubButtonProps } from './GitHub.types';

const GITHUB_BUTTON_NAME: string = 'GitHubButton' as const;

const GITHUB_BG_COLOR: string = '#24292f';
const GITHUB_BG_HOVER_COLOR: string = '#2c3237';
const GITHUB_BG_ACTIVE_COLOR: string = '#373e47';
const GITHUB_TEXT_COLOR: string = '#ffffff';
const GITHUB_BORDER_COLOR: string = '#24292f';
const GITHUB_FOCUS_SHADOW_COLOR: string = 'rgba(36, 41, 47, 0.3)';

const StyledGitHubButton = styled(Button)<{
  $disabled?: boolean;
}>`
  padding: 0 18px;
  background-color: var(--necto-github-bg, ${GITHUB_BG_COLOR});
  color: var(--necto-github-text, ${GITHUB_TEXT_COLOR});
  border: 1px solid var(--necto-github-border, ${GITHUB_BORDER_COLOR});
  font-weight: 500;
  font-family: system-ui, -apple-system, sans-serif;

  &:hover {
    background-color: var(--necto-github-bg-hover, ${GITHUB_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-github-bg-active, ${GITHUB_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px var(--necto-github-focus-shadow, ${GITHUB_FOCUS_SHADOW_COLOR});
  }

  ${(props) =>
    props.$disabled &&
    `
    &:hover,
    &:active {
      background-color: var(--necto-github-bg, ${GITHUB_BG_COLOR});
    }
  `}
`;

export const GitHubButton: ForwardRefExoticComponent<
  Omit<GitHubButtonProps, 'ref'> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, GitHubButtonProps>(
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
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      icon={<FaGithub size={iconSize} />}
      className={cn(`_necto:${GITHUB_BUTTON_NAME}`, className)}
      {...props}
    >
      {children}
    </StyledGitHubButton>
  )
);

GitHubButton.displayName = GITHUB_BUTTON_NAME;
