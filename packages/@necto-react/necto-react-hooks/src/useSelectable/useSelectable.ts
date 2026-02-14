/**
 * Portions of this file are based on code from the React Aria Spectrum library by Adobe,
 * licensed under the Apache License, Version 2.0.
 * Copyright (c) Adobe. All rights reserved.
 * See: https://github.com/adobe/react-spectrum
 *
 * Modifications copyright (c) Corinvo, LLC. and affiliates. All rights reserved.
 *
 * This file contains code licensed under:
 * - The MIT License (see LICENSE in the root directory) for Corinvo modifications.
 * - The Apache License, Version 2.0 for portions from Adobe.
 *
 * Modifications have been made to adapt the code for use in this project.
 */

import { defu } from 'defu';
import { isMac } from '@necto/platform';
import { mergeProps } from '@necto/mergers';
import { useEffect, useRef, useCallback } from 'react';
import {
  focusWithoutScrolling,
  getActiveElement,
  getEventTarget
} from '@necto/dom';

import { useId } from '../useId';
import { usePress } from '../usePress';
import { useLongPress } from '../useLongPress';

import type { FocusEvent, MouseEvent, DragEvent, RefObject } from 'react';
import type { DOMAttributes } from '@necto-react/types';
import type { PointerType, PressEvent } from '@necto/types';
import type {
  UseSelectableOptions,
  UseSelectableReturn
} from './useSelectable.types';

/**
 * Checks if a link should open in a new tab based on modifier keys.
 */
function shouldOpenInNewTab(e: {
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
}): boolean {
  return !!(e.metaKey || e.ctrlKey || e.altKey || e.shiftKey);
}

/**
 * Handles interactions with an item in a selectable collection.
 * Manages selection, focus, actions, and keyboard/pointer interactions.
 */
export function useSelectable(
  options: UseSelectableOptions
): UseSelectableReturn {
  const {
    id: providedId,
    selectionManager: manager,
    key,
    ref,
    shouldSelectOnPressUp,
    shouldUseVirtualFocus,
    focus,
    isDisabled: isDisabledProp,
    onAction,
    linkBehavior,
    onNavigate
  } = defu(options, {
    linkBehavior: 'action' as const
  });

  const id: string = useId({ defaultId: providedId });
  const modality = useRef<PointerType | null>(null);
  const hadPrimaryActionOnPressStart = useRef<boolean>(false);
  const longPressTriggeredRef = useRef<boolean>(false);

  const isDisabled: boolean =
    isDisabledProp || (manager?.isDisabled(key) ?? false);
  const isLink: boolean = manager?.isLink(key) ?? false;
  const allowsSelection: boolean =
    !isDisabled &&
    (manager?.canSelectItem(key) ?? false) &&
    !(isLink && linkBehavior === 'override');
  const allowsActions: boolean =
    (onAction ||
      (isLink && linkBehavior !== 'selection' && linkBehavior !== 'none')) &&
    !isDisabled;
  const hasPrimaryAction: boolean =
    allowsActions &&
    (manager?.selectionBehavior === 'replace'
      ? !allowsSelection
      : !allowsSelection || (manager?.isEmpty ?? true));
  const hasSecondaryAction: boolean =
    allowsActions &&
    allowsSelection &&
    manager?.selectionBehavior === 'replace';
  const hasAction: boolean = hasPrimaryAction || hasSecondaryAction;
  const longPressEnabled: boolean = hasAction && allowsSelection;

  const onSelect = useCallback(
    (e: PressEvent | PointerEvent): void => {
      if (!manager) return;

      const ctrlModifier: boolean | undefined = isMac() ? e.metaKey : e.ctrlKey;

      if ('pointerType' in e && e.pointerType === 'keyboard' && ctrlModifier) {
        manager.toggleSelection(key);
        return;
      }

      if (manager.selectionMode === 'none') return;

      if (isLink) {
        if (linkBehavior === 'selection') {
          manager.setSelectedKeys(manager.selectedKeys);
          return;
        }
        if (linkBehavior === 'override' || linkBehavior === 'none') return;
      }

      if (manager.selectionMode === 'single') {
        if (manager.isSelected(key) && !manager.disallowEmptySelection) {
          manager.toggleSelection(key);
        } else {
          manager.replaceSelection(key);
        }
      } else if ('shiftKey' in e && e.shiftKey) {
        manager.extendSelection(key);
      } else if (
        manager.selectionBehavior === 'toggle' ||
        ctrlModifier ||
        ('pointerType' in e &&
          (e.pointerType === 'touch' || e.pointerType === 'virtual'))
      ) {
        manager.toggleSelection(key);
      } else {
        manager.replaceSelection(key);
      }
    },
    [manager, key, linkBehavior, isLink]
  );

  const performAction = useCallback(
    (e?: PressEvent | MouseEvent): void => {
      // Handle link navigation
      if (isLink && linkBehavior !== 'none' && manager) {
        const itemProps = manager.getItemProps(key);
        if (itemProps?.href) {
          // Check if link should open in new tab
          if (e && shouldOpenInNewTab(e)) {
            window.open(itemProps.href, '_blank', 'noopener,noreferrer');
          } else if (onNavigate) {
            onNavigate(itemProps.href, itemProps.routerOptions);
          } else {
            // Fallback to native navigation
            window.location.href = itemProps.href;
          }
          return;
        }
      }

      // Handle regular action
      if (onAction) {
        onAction();
        (ref.current as Element)?.dispatchEvent(
          new CustomEvent('necto-item-action', { bubbles: true })
        );
      }
    },
    [onAction, ref, isLink, linkBehavior, manager, key, onNavigate]
  );

  // Long press handling with accessibility description
  const { longPressProps } = useLongPress({
    isDisabled: !longPressEnabled,
    accessibilityDescription: longPressEnabled
      ? 'Long press to enter selection mode'
      : undefined,
    onLongPress(): void {
      longPressTriggeredRef.current = true;
      onSelect({ pointerType: 'touch' } as PressEvent);
      manager?.setSelectionBehavior('toggle');
    }
  });

  // Focus management
  useEffect((): void => {
    if (!manager) return;
    if (
      key === manager.focusedKey &&
      manager.isFocused &&
      !shouldUseVirtualFocus
    ) {
      if (focus) {
        focus();
      } else if (ref.current && getActiveElement() !== ref.current) {
        focusWithoutScrolling(ref.current as HTMLElement);
      }
    }
  }, [
    ref,
    key,
    manager,
    manager?.focusedKey,
    manager?.isFocused,
    shouldUseVirtualFocus,
    focus
  ]);

  // Clear focused key if item becomes disabled
  useEffect((): void => {
    if (isDisabled && manager?.focusedKey === key) manager.setFocusedKey(null);
  }, [manager, isDisabled, key]);

  const { pressProps, isPressed } = usePress({
    isDisabled,
    preventFocusOnPress: shouldUseVirtualFocus,
    ref: ref as RefObject<HTMLElement>,
    onPressStart(e): void {
      modality.current = e.pointerType;
      hadPrimaryActionOnPressStart.current = hasPrimaryAction;

      if (shouldSelectOnPressUp) {
        if (e.pointerType === 'keyboard' && !hasAction) onSelect(e);
      } else if (allowsSelection) {
        if (e.pointerType === 'mouse' && !hasPrimaryAction) onSelect(e);
        else if (e.pointerType === 'keyboard' && !allowsActions) onSelect(e);
      }

      if (shouldUseVirtualFocus && e.pointerType !== 'touch' && manager) {
        manager.setFocused(true);
        manager.setFocusedKey(key);
      }
    },
    onPress(e): void {
      if (longPressTriggeredRef.current) {
        longPressTriggeredRef.current = false;
        return;
      }

      if (shouldUseVirtualFocus && e.pointerType === 'touch' && manager) {
        manager.setFocused(true);
        manager.setFocusedKey(key);
      }

      const isTouchLike: boolean =
        e.pointerType === 'touch' ||
        e.pointerType === 'pen' ||
        e.pointerType === 'virtual';

      if (shouldSelectOnPressUp) {
        if (
          hasPrimaryAction ||
          (hasSecondaryAction && e.pointerType !== 'mouse')
        ) {
          performAction(e);
        } else if (e.pointerType !== 'keyboard' && allowsSelection) {
          onSelect(e);
        }
      } else if (
        isTouchLike ||
        (e.pointerType === 'mouse' && hadPrimaryActionOnPressStart.current)
      ) {
        if (hasAction) performAction(e);
        else if (allowsSelection) onSelect(e);
      }
    }
  });

  const onDoubleClick = hasSecondaryAction
    ? (e: MouseEvent): void => {
        if (modality.current === 'mouse') {
          e.stopPropagation();
          e.preventDefault();
          performAction(e);
        }
      }
    : undefined;

  const onDragStartCapture = (e: DragEvent): void => {
    if (modality.current === 'touch' && longPressEnabled) e.preventDefault();
  };

  // Prevent default link click if we're handling navigation ourselves
  const onClick =
    isLink && linkBehavior !== 'none'
      ? (e: MouseEvent): void => {
          e.preventDefault();
        }
      : undefined;

  const itemProps: DOMAttributes & Record<string, unknown> = { id };
  itemProps['data-necto-key'] = String(key);
  if (manager?.collection?.id)
    itemProps['data-necto-collection'] = manager.collection.id;

  if (!shouldUseVirtualFocus && !isDisabled) {
    itemProps.tabIndex = key === manager?.focusedKey ? 0 : -1;
    itemProps.onFocus = (e: FocusEvent): void => {
      if (getEventTarget(e.nativeEvent) === ref.current)
        manager?.setFocusedKey(key);
    };
  } else if (isDisabled || shouldUseVirtualFocus) {
    itemProps.onMouseDown = (e: MouseEvent): void => e.preventDefault();
  }

  const selectableProps = mergeProps(
    itemProps,
    allowsSelection ||
      hasPrimaryAction ||
      (shouldUseVirtualFocus && !isDisabled)
      ? pressProps
      : {},
    longPressEnabled ? longPressProps : {},
    { onDoubleClick, onDragStartCapture, onClick }
  );

  return {
    selectableProps,
    isPressed,
    isSelected: manager?.isSelected(key) ?? false,
    isFocused: (manager?.isFocused && manager?.focusedKey === key) ?? false,
    isDisabled,
    allowsSelection,
    hasAction
  };
}
