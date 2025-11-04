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
import { SiHubspot } from 'react-icons/si';

import type {
  ReactElement,
  ForwardedRef,
  ForwardRefExoticComponent,
  RefAttributes
} from 'react';
import type { HubSpotButtonProps } from './HubSpot.types';

const HUBSPOT_BUTTON_NAME = 'HubSpotButton';

const HUBSPOT_BG_COLOR: string = '#ff7a59';
const HUBSPOT_BG_HOVER_COLOR: string = '#ff6a47';
const HUBSPOT_BG_ACTIVE_COLOR: string = '#e55d3f';
const HUBSPOT_TEXT_COLOR: string = '#ffffff';
const HUBSPOT_FOCUS_SHADOW_COLOR: string = 'rgba(255, 122, 89, 0.3)';

const StyledHubSpotButton = styled(Button)<{
  $disabled?: boolean;
}>`
  padding: 0 12px 0 12px;
  background-color: var(--necto-hubspot-bg, ${HUBSPOT_BG_COLOR});
  color: var(--necto-hubspot-text, ${HUBSPOT_TEXT_COLOR});
  border: none;
  font-weight: 500;
  font-family: 'Roboto', system-ui, -apple-system, sans-serif;

  &:hover {
    background-color: var(--necto-hubspot-bg-hover, ${HUBSPOT_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-hubspot-bg-active, ${HUBSPOT_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px var(--necto-hubspot-focus-shadow, ${HUBSPOT_FOCUS_SHADOW_COLOR});
  }

  ${(props) =>
    props.$disabled &&
    `
    &:hover,
    &:active {
      background-color: var(--necto-hubspot-bg, ${HUBSPOT_BG_COLOR});
    }
  `}
`;

export const HubSpotButton: ForwardRefExoticComponent<
  Omit<HubSpotButtonProps, 'ref'> & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, HubSpotButtonProps>(
  (
    {
      as,
      asChild,
      children = 'Continue with HubSpot',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: HubSpotButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledHubSpotButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={cn(`_necto:${HUBSPOT_BUTTON_NAME}`, className)}
      iconPosition={iconPosition}
      icon={<SiHubspot size={iconSize} />}
      {...props}
    >
      {children}
    </StyledHubSpotButton>
  )
);

HubSpotButton.displayName = HUBSPOT_BUTTON_NAME;
