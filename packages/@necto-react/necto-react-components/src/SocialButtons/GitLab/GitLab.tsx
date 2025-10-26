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
import styles from './GitLab.module.scss';
import { FaGitlab } from 'react-icons/fa6';

import type { FC, ReactElement, ForwardedRef } from 'react';
import type { GitLabButtonProps } from './GitLab.types';
import type { IStyledComponent } from 'styled-components';

const GITLAB_BUTTON_NAME: string = 'GitLabButton' as const;

const StyledGitLabButton: IStyledComponent<'web', any> = styled(Button).attrs<{
  $disabled?: boolean;
}>((props) => ({
  className:
    `${styles.GitLabButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const GitLabButton: FC<GitLabButtonProps> = forwardRef<
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
    }: Omit<GitLabButtonProps, 'ref'>,
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
