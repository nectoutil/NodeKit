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
import { GitLabIcon } from './GitLab.icon';

import type {
  ReactElement,
  ForwardedRef,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react';
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
  padding: 0 18px;
  background-color: var(--necto-gitlab-bg, ${GITLAB_BG_COLOR});
  color: var(--necto-gitlab-text, ${GITLAB_TEXT_COLOR});
  border: none;
  font-weight: 500;
  font-family: system-ui, -apple-system, sans-serif;

  &:hover {
    background-color: var(--necto-gitlab-bg-hover, ${GITLAB_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-gitlab-bg-active, ${GITLAB_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px var(--necto-gitlab-focus-shadow, ${GITLAB_FOCUS_SHADOW_COLOR});
  }

  ${(props) =>
    props.$disabled &&
    `
    &:hover,
    &:active {
      background-color: var(--necto-gitlab-bg, ${GITLAB_BG_COLOR});
    }
  `}
`;

export const GitLabButton: ForwardRefExoticComponent<
  Omit<GitLabButtonProps, 'ref'> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, GitLabButtonProps>(
  (
    {
      as,
      asChild,
      iconColor = '#fff',
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
      icon={<GitLabIcon size={iconSize} color={iconColor} />}
      className={cn(`_necto:${GITLAB_BUTTON_NAME}`, className)}
      {...props}
    >
      {children}
    </StyledGitLabButton>
  )
);

GitLabButton.displayName = GITLAB_BUTTON_NAME;
