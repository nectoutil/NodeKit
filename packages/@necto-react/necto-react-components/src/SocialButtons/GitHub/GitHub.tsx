/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cn from 'clsx';
import { forwardRef } from 'react';
import styled from 'styled-components';
import { Button } from '../Button/Button';
import { FaGithub } from 'react-icons/fa';
import styles from './GitHub.module.scss';

import type { FC, ReactElement, ForwardedRef } from 'react';
import type { GitHubButtonProps } from './GitHub.types';
import type { IStyledComponent } from 'styled-components';

const GITHUB_BUTTON_NAME: string = 'GitHubButton' as const;

const StyledGitHubButton: IStyledComponent<'web', any> = styled(Button).attrs<{
  $disabled?: boolean;
}>((props) => ({
  className:
    `${styles.GitHubButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const GitHubButton: FC<GitHubButtonProps> = forwardRef<
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
    }: Omit<GitHubButtonProps, 'ref'>,
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
