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
import { FaSlack } from 'react-icons/fa';

import type {
  ReactElement,
  ForwardedRef,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react';
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
  padding: 0 12px 0 12px;
  background-color: var(--necto-slack-bg, ${SLACK_BG_COLOR});
  color: var(--necto-slack-text, ${SLACK_TEXT_COLOR});
  border: none;
  font-weight: 500;
  font-family: 'Roboto', system-ui, -apple-system, sans-serif;

  &:hover {
    background-color: var(--necto-slack-bg-hover, ${SLACK_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-slack-bg-active, ${SLACK_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px var(--necto-slack-focus-shadow, ${SLACK_FOCUS_SHADOW_COLOR});
  }

  ${(props) =>
    props.$disabled &&
    `
    &:hover,
    &:active {
      background-color: var(--necto-slack-bg, ${SLACK_BG_COLOR});
    }
  `}
`;

export const SlackButton: ForwardRefExoticComponent<
  Omit<SlackButtonProps, 'ref'> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, SlackButtonProps>(
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
