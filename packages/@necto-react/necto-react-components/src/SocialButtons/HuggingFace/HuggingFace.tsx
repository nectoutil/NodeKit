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
import { SiHuggingface } from 'react-icons/si';

import type { ReactElement, ForwardedRef, ForwardRefExoticComponent, RefAttributes } from 'react';
import type { HuggingFaceButtonProps } from './HuggingFace.types';

const HUGGINGFACE_BUTTON_NAME = 'HuggingFaceButton';

const HUGGINGFACE_BG_COLOR: string = '#ffcc00';
const HUGGINGFACE_BG_HOVER_COLOR: string = '#e6b800';
const HUGGINGFACE_BG_ACTIVE_COLOR: string = '#cca300';
const HUGGINGFACE_TEXT_COLOR: string = '#000000';
const HUGGINGFACE_FOCUS_SHADOW_COLOR: string = 'rgba(255, 204, 0, 0.3)';

const StyledHuggingFaceButton = styled(Button)<{
  $disabled?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 12px 0 12px;
  min-height: 40px;
  width: 100%;
  background-color: var(--necto-huggingface-bg, ${HUGGINGFACE_BG_COLOR});
  color: var(--necto-huggingface-text, ${HUGGINGFACE_TEXT_COLOR});
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
    background-color: var(--necto-huggingface-bg-hover, ${HUGGINGFACE_BG_HOVER_COLOR});
  }

  &:active {
    background-color: var(--necto-huggingface-bg-active, ${HUGGINGFACE_BG_ACTIVE_COLOR});
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--necto-huggingface-focus-shadow, ${HUGGINGFACE_FOCUS_SHADOW_COLOR});
  }

  ${props => props.$disabled && `
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;

    &:hover,
    &:active {
      background-color: var(--necto-huggingface-bg, ${HUGGINGFACE_BG_COLOR});
    }
  `}
`;

export const HuggingFaceButton: ForwardRefExoticComponent<Omit<HuggingFaceButtonProps, "ref"> & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  HuggingFaceButtonProps
>(
  (
    {
      as,
      asChild,
      children = 'Continue with HuggingFace',
      iconPosition = 'left',
      showIcon = true,
      iconSize = 20,
      disabled,
      className,
      ...props
    }: HuggingFaceButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ): ReactElement => (
    <StyledHuggingFaceButton
      as={as}
      ref={ref}
      asChild={asChild}
      showIcon={showIcon}
      disabled={disabled}
      $disabled={disabled}
      className={cn(`_necto:${HUGGINGFACE_BUTTON_NAME}`, className)}
      iconPosition={iconPosition}
      icon={<SiHuggingface size={iconSize} />}
      {...props}
    >
      {children}
    </StyledHuggingFaceButton>
  )
);

HuggingFaceButton.displayName = HUGGINGFACE_BUTTON_NAME;
