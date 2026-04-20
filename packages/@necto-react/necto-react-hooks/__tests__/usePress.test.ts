// biome-ignore-all lint/suspicious/noExplicitAny: Explicit any okay for tests.

/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createElement } from 'react';
import { usePress } from '@necto-react/hooks';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, renderHook, act } from '@testing-library/react';

function Pressable(props: Parameters<typeof usePress>[0] & { 'data-testid'?: string }) {
  const { 'data-testid': testId = 'pressable', ...pressOptions } = props;
  const { pressProps, isPressed } = usePress(pressOptions);
  return createElement('div', {
    role: 'button',
    tabIndex: 0,
    'data-testid': testId,
    'data-pressed': String(isPressed),
    ...(pressProps as any),
  });
}

function mouseEvent(overrides: Record<string, any> = {}) {
  return { button: 0, currentTarget: document.body, target: document.body, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false, preventDefault: vi.fn(), ...overrides } as any;
}

function touchEvent(overrides: Record<string, any> = {}) {
  return { currentTarget: document.body, target: document.body, shiftKey: false, ctrlKey: false, metaKey: false, altKey: false, preventDefault: vi.fn(), ...overrides } as any;
}

describe('usePress', () => {
  afterEach(cleanup);

  beforeEach(() => {
    document.body.style.userSelect = '';
  });

  // ── initial state ──────────────────────────────────────────────────────────

  it('returns isPressed as false initially', () => {
    render(createElement(Pressable, null));
    expect(screen.getByTestId('pressable').dataset.pressed).toBe('false');
  });

  it('returns pressProps with all expected handlers', () => {
    const { result } = renderHook(() => usePress());
    const { pressProps } = result.current;
    expect(typeof pressProps.onMouseDown).toBe('function');
    expect(typeof pressProps.onMouseUp).toBe('function');
    expect(typeof pressProps.onMouseLeave).toBe('function');
    expect(typeof pressProps.onMouseEnter).toBe('function');
    expect(typeof pressProps.onTouchStart).toBe('function');
    expect(typeof pressProps.onTouchEnd).toBe('function');
    expect(typeof pressProps.onKeyDown).toBe('function');
    expect(typeof pressProps.onKeyUp).toBe('function');
    expect(typeof pressProps.onClick).toBe('function');
  });

  it('sets data-necto-pressable attribute by default', () => {
    render(createElement(Pressable, null));
    expect(screen.getByTestId('pressable').hasAttribute('data-necto-pressable')).toBe(true);
  });

  // ── mouse ──────────────────────────────────────────────────────────────────

  it('sets isPressed to true on mousedown', async () => {
    const user = userEvent.setup();
    render(createElement(Pressable, null));
    const el = screen.getByTestId('pressable');
    await user.pointer([{ keys: '[MouseLeft>]', target: el }]);
    expect(el.dataset.pressed).toBe('true');
    await user.pointer([{ keys: '[/MouseLeft]' }]);
  });

  it('calls onPressStart on mousedown', async () => {
    const onPressStart = vi.fn();
    const user = userEvent.setup();
    render(createElement(Pressable, { onPressStart }));
    await user.pointer({ keys: '[MouseLeft]', target: screen.getByTestId('pressable') });
    expect(onPressStart).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pressstart', pointerType: 'mouse' })
    );
  });

  it('calls onPress, onPressEnd, and onPressUp on full click', async () => {
    const onPress = vi.fn();
    const onPressEnd = vi.fn();
    const onPressUp = vi.fn();
    const user = userEvent.setup();
    render(createElement(Pressable, { onPress, onPressEnd, onPressUp }));
    await user.click(screen.getByTestId('pressable'));
    expect(onPressEnd).toHaveBeenCalledWith(expect.objectContaining({ type: 'pressend', pointerType: 'mouse' }));
    expect(onPressUp).toHaveBeenCalled();
    expect(onPress).toHaveBeenCalled();
  });

  it('clears isPressed after click completes', async () => {
    const user = userEvent.setup();
    render(createElement(Pressable, null));
    const el = screen.getByTestId('pressable');
    await user.click(el);
    expect(el.dataset.pressed).toBe('false');
  });

  it('calls onPressChange(true) then onPressChange(false) on click', async () => {
    const onPressChange = vi.fn();
    const user = userEvent.setup();
    render(createElement(Pressable, { onPressChange }));
    await user.click(screen.getByTestId('pressable'));
    expect(onPressChange).toHaveBeenCalledWith(true);
    expect(onPressChange).toHaveBeenCalledWith(false);
  });

  it('calls onPressEnd on mouseleave while pressed', async () => {
    const onPressEnd = vi.fn();
    const user = userEvent.setup();
    render(createElement('div', null,
      createElement(Pressable, { onPressEnd }),
      createElement('div', { 'data-testid': 'outside', style: { width: 100, height: 100 } })
    ));
    const el = screen.getByTestId('pressable');
    await user.pointer({ keys: '[MouseLeft]', target: el });
    await user.pointer({ target: screen.getByTestId('outside') });
    expect(onPressEnd).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pressend', pointerType: 'mouse' })
    );
  });

  it('restores pressed state on mouseenter after leaving', () => {
    const onPressStart = vi.fn();
    const { result } = renderHook(() => usePress({ onPressStart }));
    const e = mouseEvent();
    act(() => { result.current.pressProps.onMouseDown?.(e); });
    act(() => { result.current.pressProps.onMouseLeave?.(e); });
    onPressStart.mockClear();
    act(() => { result.current.pressProps.onMouseEnter?.(e); });
    expect(onPressStart).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pressstart', pointerType: 'mouse' })
    );
    expect(result.current.isPressed).toBe(true);
  });

  it('registers a window mouseup listener on mousedown', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const { result } = renderHook(() => usePress({}));
    act(() => { result.current.pressProps.onMouseDown?.(mouseEvent()); });
    expect(addSpy).toHaveBeenCalledWith('mouseup', expect.any(Function), { once: true });
    addSpy.mockRestore();
  });

  it('calls e.preventDefault on mousedown when preventFocusOnPress is true', () => {
    const e = mouseEvent();
    const { result } = renderHook(() => usePress({ preventFocusOnPress: true }));
    act(() => { result.current.pressProps.onMouseDown?.(e); });
    expect(e.preventDefault).toHaveBeenCalled();
  });

  // ── disabled ───────────────────────────────────────────────────────────────

  it('does not fire press callbacks when isDisabled', async () => {
    const onPressStart = vi.fn();
    const onPress = vi.fn();
    const user = userEvent.setup();
    render(createElement(Pressable, { isDisabled: true, onPressStart, onPress }));
    await user.click(screen.getByTestId('pressable'));
    expect(onPressStart).not.toHaveBeenCalled();
    expect(onPress).not.toHaveBeenCalled();
  });

  // ── click handler ──────────────────────────────────────────────────────────

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(createElement(Pressable, { onClick }));
    await user.click(screen.getByTestId('pressable'));
    expect(onClick).toHaveBeenCalled();
  });

  it('does not call onClick when isDisabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(createElement(Pressable, { isDisabled: true, onClick }));
    await user.click(screen.getByTestId('pressable'));
    expect(onClick).not.toHaveBeenCalled();
  });

  // ── touch ──────────────────────────────────────────────────────────────────

  it('calls onPressStart with touch pointerType on touchstart', () => {
    const onPressStart = vi.fn();
    const { result } = renderHook(() => usePress({ onPressStart }));
    act(() => { result.current.pressProps.onTouchStart?.(touchEvent()); });
    expect(onPressStart).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pressstart', pointerType: 'touch' })
    );
  });

  it('calls onPress on touch tap', async () => {
    const onPress = vi.fn();
    const user = userEvent.setup();
    render(createElement(Pressable, { onPress }));
    const el = screen.getByTestId('pressable');
    await user.pointer([{ keys: '[TouchA]', target: el }, { keys: '[/TouchA]', target: el }]);
    expect(onPress).toHaveBeenCalled();
  });

  it('does not fire on touch when isDisabled', async () => {
    const onPressStart = vi.fn();
    const user = userEvent.setup();
    render(createElement(Pressable, { isDisabled: true, onPressStart }));
    const el = screen.getByTestId('pressable');
    await user.pointer([{ keys: '[TouchA]', target: el }, { keys: '[/TouchA]', target: el }]);
    expect(onPressStart).not.toHaveBeenCalled();
  });

  it('registers window touchend and touchcancel listeners on touchstart', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const { result } = renderHook(() => usePress({}));
    act(() => { result.current.pressProps.onTouchStart?.(touchEvent()); });
    expect(addSpy).toHaveBeenCalledWith('touchend', expect.any(Function), { once: true });
    expect(addSpy).toHaveBeenCalledWith('touchcancel', expect.any(Function), { once: true });
    addSpy.mockRestore();
  });

  // ── keyboard ───────────────────────────────────────────────────────────────

  it('calls onPress on Enter key', async () => {
    const onPress = vi.fn();
    const user = userEvent.setup();
    render(createElement(Pressable, { onPress }));
    screen.getByTestId('pressable').focus();
    await user.keyboard('{Enter}');
    expect(onPress).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'press', pointerType: 'keyboard' })
    );
  });

  it('calls onPress on Space key', async () => {
    const onPress = vi.fn();
    const user = userEvent.setup();
    render(createElement(Pressable, { onPress }));
    screen.getByTestId('pressable').focus();
    await user.keyboard(' ');
    expect(onPress).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'press', pointerType: 'keyboard' })
    );
  });

  it('calls onPressStart with keyboard pointerType on Enter', async () => {
    const onPressStart = vi.fn();
    const user = userEvent.setup();
    render(createElement(Pressable, { onPressStart }));
    screen.getByTestId('pressable').focus();
    await user.keyboard('{Enter}');
    expect(onPressStart).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pressstart', pointerType: 'keyboard' })
    );
  });

  it('calls onPressEnd and onPressUp on key release', async () => {
    const onPressEnd = vi.fn();
    const onPressUp = vi.fn();
    const user = userEvent.setup();
    render(createElement(Pressable, { onPressEnd, onPressUp }));
    screen.getByTestId('pressable').focus();
    await user.keyboard('{Enter}');
    expect(onPressEnd).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pressend', pointerType: 'keyboard' })
    );
    expect(onPressUp).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pressup', pointerType: 'keyboard' })
    );
  });

  it('does not fire onPress for non-press keys', async () => {
    const onPress = vi.fn();
    const user = userEvent.setup();
    render(createElement(Pressable, { onPress }));
    screen.getByTestId('pressable').focus();
    await user.keyboard('{Tab}');
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not fire onPress on keyboard when isDisabled', async () => {
    const onPress = vi.fn();
    const user = userEvent.setup();
    render(createElement(Pressable, { isDisabled: true, onPress }));
    screen.getByTestId('pressable').focus();
    await user.keyboard('{Enter}');
    expect(onPress).not.toHaveBeenCalled();
  });
});
