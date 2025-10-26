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
import { FaGitlab } from 'react-icons/fa6';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { GitLabButtonProps } from './GitLab.types';

const GITLAB_BUTTON_NAME: string = 'GitLabButton' as const;

const StyledGitLabButton = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 18px;
  min-height: 40px;
  background-color: #fc6d26;
  color: #ffffff;
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
    background-color: #e24329;
  }

  &:active {
    background-color: #c73b1c;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(252, 109, 38, 0.3);
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: #fc6d26;
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
      iconSize={iconSize}
      disabled={disabled}
      $disabled={disabled}
      iconPosition={iconPosition}
      icon={<FaGitlab size={iconSize} />}
      className={cn(className, `_necto:${GITLAB_BUTTON_NAME}`)}
      {...props}
    >
      {children}
    </StyledGitLabButton>
  )
);

GitLabButton.displayName = GITLAB_BUTTON_NAME;
