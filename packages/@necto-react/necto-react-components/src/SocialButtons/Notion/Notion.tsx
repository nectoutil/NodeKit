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

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { NotionButtonProps } from './Notion.types';
import type { IStyledComponent } from 'styled-components';

const NOTION_BUTTON_NAME = 'NotionButton';

const StyledNotionButton: IStyledComponent<'web', any> = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 12px 0 12px;
  min-height: 40px;
  background-color: #000000;
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
    background-color: #1a1a1a;
  }

  &:active {
    background-color: #333333;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.3);
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: #000000;
    }
  `}
`;

export const NotionButton: ForwardRefExoticComponent<Omit<NotionButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
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
