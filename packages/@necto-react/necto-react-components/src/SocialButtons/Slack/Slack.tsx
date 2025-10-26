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
import { FaSlack } from 'react-icons/fa';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { SlackButtonProps } from './Slack.types';

const SLACK_BUTTON_NAME = 'SlackButton';

const SLACK_BG_COLOR: string = '#4a154b';
const SLACK_BG_HOVER_COLOR: string = '#3f1240';
const SLACK_BG_ACTIVE_COLOR: string = '#350f36';
const SLACK_TEXT_COLOR: string = '#ffffff';
const SLACK_FOCUS_SHADOW_COLOR: string = 'rgba(74, 21, 75, 0.3)';

const StyledSlackButton = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 12px 0 12px;
  min-height: 40px;
  width: 100%;
  background-color: var(--necto-slack-bg, ${SLACK_BG_COLOR});
  color: var(--necto-slack-text, ${SLACK_TEXT_COLOR});
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
    background-color: var(--necto-slack-bg-hover, ${SLACK_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-slack-bg-active, ${SLACK_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--necto-slack-focus-shadow, ${SLACK_FOCUS_SHADOW_COLOR});
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: var(--necto-slack-bg, ${SLACK_BG_COLOR});
    }
  `}
`;

export const SlackButton: ForwardRefExoticComponent<Omit<SlackButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  SlackButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with Slack',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: SlackButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledSlackButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={cn(`_necto:${SLACK_BUTTON_NAME}`, className)}
      iconPosition={iconPosition}
      icon={<FaSlack size={iconSize} />}
      {...props}
    >
      {children}
    </StyledSlackButton>
  )
);

SlackButton.displayName = SLACK_BUTTON_NAME;
