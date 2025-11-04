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
import { SiNotion } from 'react-icons/si';

import type {
  ReactElement,
  ForwardedRef,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react';
import type { NotionButtonProps } from './Notion.types';

const NOTION_BUTTON_NAME = 'NotionButton';

const NOTION_BG_COLOR: string = '#000000';
const NOTION_BG_HOVER_COLOR: string = '#1a1a1a';
const NOTION_BG_ACTIVE_COLOR: string = '#333333';
const NOTION_TEXT_COLOR: string = '#ffffff';
const NOTION_FOCUS_SHADOW_COLOR: string = 'rgba(0, 0, 0, 0.3)';

const StyledNotionButton = styled(Button)<{
  $disabled?: boolean;
}>`
  padding: 0 12px 0 12px;
  background-color: var(--necto-notion-bg, ${NOTION_BG_COLOR});
  color: var(--necto-notion-text, ${NOTION_TEXT_COLOR});
  border: none;
  font-weight: 500;
  font-family: 'Roboto', system-ui, -apple-system, sans-serif;

  &:hover {
    background-color: var(--necto-notion-bg-hover, ${NOTION_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-notion-bg-active, ${NOTION_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px var(--necto-notion-focus-shadow, ${NOTION_FOCUS_SHADOW_COLOR});
  }

  ${(props) =>
    props.$disabled &&
    `
    &:hover,
    &:active {
      background-color: var(--necto-notion-bg, ${NOTION_BG_COLOR});
    }
  `}
`;

export const NotionButton: ForwardRefExoticComponent<
  Omit<NotionButtonProps, 'ref'> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, NotionButtonProps>(
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
    }: NotionButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledNotionButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={cn(`_necto:${NOTION_BUTTON_NAME}`, className)}
      iconPosition={iconPosition}
      icon={<SiNotion size={iconSize} />}
      {...props}
    >
      {children}
    </StyledNotionButton>
  )
);

NotionButton.displayName = NOTION_BUTTON_NAME;
