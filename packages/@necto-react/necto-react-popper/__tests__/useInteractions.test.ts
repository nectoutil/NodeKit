/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useInteractions } from '../src/hooks/useInteractions/useInteractions';

describe('useInteractions', () => {
  it('should return prop getter functions', () => {
    const { result } = renderHook(() => useInteractions());

    expect(typeof result.current.getReferenceProps).toBe('function');
    expect(typeof result.current.getFloatingProps).toBe('function');
    expect(typeof result.current.getItemProps).toBe('function');
  });

  it('should return user props when no interactions', () => {
    const { result } = renderHook(() => useInteractions([]));

    const props = result.current.getReferenceProps({ className: 'test' });
    expect(props.className).toBe('test');
  });

  it('should merge interaction props with user props', () => {
    const interaction = {
      reference: { 'aria-expanded': true },
      floating: { role: 'dialog' }
    };

    const { result } = renderHook(() => useInteractions([interaction]));

    const refProps = result.current.getReferenceProps({ className: 'btn' });
    expect(refProps['aria-expanded']).toBe(true);
    expect(refProps.className).toBe('btn');

    const floatProps = result.current.getFloatingProps();
    expect(floatProps.role).toBe('dialog');
  });

  it('should merge event handlers from multiple interactions', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    const interaction1 = {
      reference: { onClick: handler1 }
    };
    const interaction2 = {
      reference: { onClick: handler2 }
    };

    const { result } = renderHook(() =>
      useInteractions([interaction1, interaction2])
    );

    const props = result.current.getReferenceProps();
    (props.onClick as Function)();

    expect(handler1).toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });

  it('should merge user event handlers with interaction handlers', () => {
    const interactionHandler = vi.fn();
    const userHandler = vi.fn();

    const interaction = {
      reference: { onClick: interactionHandler }
    };

    const { result } = renderHook(() => useInteractions([interaction]));

    const props = result.current.getReferenceProps({ onClick: userHandler });
    (props.onClick as Function)();

    expect(interactionHandler).toHaveBeenCalled();
    expect(userHandler).toHaveBeenCalled();
  });

  it('should merge ref callbacks', () => {
    const ref1 = vi.fn();
    const ref2 = vi.fn();

    const interaction = {
      reference: { ref: ref1 }
    };

    const { result } = renderHook(() => useInteractions([interaction]));

    const props = result.current.getReferenceProps({ ref: ref2 });
    const node = document.createElement('div');
    (props.ref as Function)(node);

    expect(ref1).toHaveBeenCalledWith(node);
    expect(ref2).toHaveBeenCalledWith(node);
  });

  it('should filter out null/undefined interactions', () => {
    const interaction = {
      reference: { role: 'button' }
    };

    const { result } = renderHook(() =>
      useInteractions([null, interaction, undefined])
    );

    const props = result.current.getReferenceProps();
    expect(props.role).toBe('button');
  });

  it('should handle item props', () => {
    const interaction = {
      item: { role: 'option', tabIndex: 0 }
    };

    const { result } = renderHook(() => useInteractions([interaction]));

    const props = result.current.getItemProps();
    expect(props.role).toBe('option');
    expect(props.tabIndex).toBe(0);
  });
});
