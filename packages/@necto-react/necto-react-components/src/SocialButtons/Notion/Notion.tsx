/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from 'react';
import styled from 'styled-components';
import { Button } from '../Button/Button';
import { SiNotion } from 'react-icons/si';
import styles from './Notion.module.scss';

import type { FC, ReactElement, ForwardedRef } from 'react';
import type { NotionButtonProps } from './Notion.types';
import type { IStyledComponent } from 'styled-components';

const NOTION_BUTTON_NAME = 'NotionButton';

const StyledNotionButton: IStyledComponent<'web', any> = styled(Button).attrs<{
  $disabled?: boolean;
}>((props) => ({
  className:
    `${styles.NotionButton} ${props.$disabled ? styles.disabled : ''}`.trim()
}))<{ $disabled?: boolean }>``;

export const NotionButton: FC<NotionButtonProps> = forwardRef<
  HTMLButtonElement,
  NotionButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Notion',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: Omit<NotionButtonProps, 'ref'>,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledNotionButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={className}
      iconPosition={iconPosition}
      icon={<SiNotion size={iconSize} />}
      {...props}
    >
      {children}
    </StyledNotionButton>
  )
);

NotionButton.displayName = NOTION_BUTTON_NAME;
