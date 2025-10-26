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
import { FaGitlab } from 'react-icons/fa6';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { GitLabButtonProps } from './GitLab.types';

const GITLAB_BUTTON_NAME: string = 'GitLabButton' as const;

const GITLAB_BG_COLOR: string = '#fc6d26';
const GITLAB_BG_HOVER_COLOR: string = '#e24329';
const GITLAB_BG_ACTIVE_COLOR: string = '#c73b1c';
const GITLAB_TEXT_COLOR: string = '#ffffff';
const GITLAB_FOCUS_SHADOW_COLOR: string = 'rgba(252, 109, 38, 0.3)';

const StyledGitLabButton = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 18px;
  min-height: 40px;
  width: 100%;
  background-color: var(--necto-gitlab-bg, ${GITLAB_BG_COLOR});
  color: var(--necto-gitlab-text, ${GITLAB_TEXT_COLOR});
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
    background-color: var(--necto-gitlab-bg-hover, ${GITLAB_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-gitlab-bg-active, ${GITLAB_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--necto-gitlab-focus-shadow, ${GITLAB_FOCUS_SHADOW_COLOR});
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: var(--necto-gitlab-bg, ${GITLAB_BG_COLOR});
    }
  `}
`;

export const GitLabButton: ForwardRefExoticComponent<Omit<GitLabButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  GitLabButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with GitLab',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: GitLabButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledGitLabButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      icon={<FaGitlab size={iconSize} />}
      className={cn(`_necto:${GITLAB_BUTTON_NAME}`, className)}
      {...props}
    >
      {children}
    </StyledGitLabButton>
  )
);

GitLabButton.displayName = GITLAB_BUTTON_NAME;
