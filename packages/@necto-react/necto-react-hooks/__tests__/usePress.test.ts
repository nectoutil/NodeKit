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
    expect(screen.getByTestId('pressable')).toHaveAttribute('data-necto-pressable');
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

  // ── window mouseup handler (onMouseUpWin) ─────────────────────────────────

  it('fires onPressEnd, onPressUp, and onPress via window mouseup when released over target', () => {
    const onPressEnd = vi.fn();
    const onPressUp = vi.fn();
    const onPress = vi.fn();
    const el = document.createElement('div');
    const child = document.createElement('span');
    el.appendChild(child);
    document.body.appendChild(el);
    const { result } = renderHook(() => usePress({ onPressEnd, onPressUp, onPress }));
    // Must be one synchronous act — effect cleanup removes the window listener on re-render
    act(() => {
      result.current.pressProps.onMouseDown?.(mouseEvent({ currentTarget: el, target: el }));
      child.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
    expect(onPressEnd).toHaveBeenCalled();
    expect(onPressUp).toHaveBeenCalled();
    expect(onPress).toHaveBeenCalled();
    document.body.removeChild(el);
  });

  it('fires onPressEnd and onPressUp but not onPress via window mouseup when outside target', () => {
    const onPressEnd = vi.fn();
    const onPressUp = vi.fn();
    const onPress = vi.fn();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const { result } = renderHook(() => usePress({ onPressEnd, onPressUp, onPress }));
    act(() => {
      result.current.pressProps.onMouseDown?.(mouseEvent({ currentTarget: el, target: el }));
      window.dispatchEvent(new MouseEvent('mouseup'));
    });
    expect(onPressEnd).toHaveBeenCalled();
    expect(onPressUp).toHaveBeenCalled();
    expect(onPress).not.toHaveBeenCalled();
    document.body.removeChild(el);
  });

  // ── onTouchEnd component handler ──────────────────────────────────────────

  it('calls onPressEnd, onPressUp, and onPress on touchend over target', () => {
    const onPressEnd = vi.fn();
    const onPressUp = vi.fn();
    const onPress = vi.fn();
    const { result } = renderHook(() => usePress({ onPressEnd, onPressUp, onPress }));
    const el = document.createElement('div');
    act(() => { result.current.pressProps.onTouchStart?.(touchEvent({ currentTarget: el, target: el })); });
    act(() => { result.current.pressProps.onTouchEnd?.(touchEvent({ currentTarget: el, target: el })); });
    expect(onPressEnd).toHaveBeenCalledWith(expect.objectContaining({ type: 'pressend', pointerType: 'touch' }));
    expect(onPressUp).toHaveBeenCalled();
    expect(onPress).toHaveBeenCalledWith(expect.objectContaining({ type: 'press', pointerType: 'touch' }));
  });

  it('does not call onPress on touchend when target is outside currentTarget', () => {
    const onPress = vi.fn();
    const { result } = renderHook(() => usePress({ onPress }));
    const el = document.createElement('div');
    const outside = document.createElement('span');
    act(() => { result.current.pressProps.onTouchStart?.(touchEvent({ currentTarget: el, target: el })); });
    act(() => { result.current.pressProps.onTouchEnd?.(touchEvent({ currentTarget: el, target: outside })); });
    expect(onPress).not.toHaveBeenCalled();
  });

  it('ignores touchend when pressStarted is false', () => {
    const onPressEnd = vi.fn();
    const { result } = renderHook(() => usePress({ onPressEnd }));
    act(() => { result.current.pressProps.onTouchEnd?.(touchEvent()); });
    expect(onPressEnd).not.toHaveBeenCalled();
  });

  // ── window touchend handler (onTouchEndWin) ───────────────────────────────

  it('fires onPressEnd and onPressUp via window touchend after touchstart', () => {
    const onPressEnd = vi.fn();
    const onPressUp = vi.fn();
    const { result } = renderHook(() => usePress({ onPressEnd, onPressUp }));
    const el = document.createElement('div');
    act(() => {
      result.current.pressProps.onTouchStart?.(touchEvent({ currentTarget: el, target: el }));
      window.dispatchEvent(new UIEvent('touchend'));
    });
    expect(onPressEnd).toHaveBeenCalled();
    expect(onPressUp).toHaveBeenCalled();
  });

  // ── window touchcancel handler (onTouchCancelWin) ─────────────────────────

  it('fires onPressEnd via window touchcancel after touchstart', () => {
    const onPressEnd = vi.fn();
    const { result } = renderHook(() => usePress({ onPressEnd }));
    const el = document.createElement('div');
    act(() => {
      result.current.pressProps.onTouchStart?.(touchEvent({ currentTarget: el, target: el }));
      window.dispatchEvent(new UIEvent('touchcancel'));
    });
    expect(onPressEnd).toHaveBeenCalled();
  });

  // ── styleInjection non-global ─────────────────────────────────────────────

  it('sets touchAction on element when styleInjection is not global', async () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const ref = { current: el };
    // JSDOM returns '' for touchAction, but the hook checks for 'auto'; mock it
    const spy = vi.spyOn(window, 'getComputedStyle').mockReturnValue({ touchAction: 'auto' } as CSSStyleDeclaration);
    renderHook(() => usePress({ styleInjection: 'inline', ref }));
    await act(async () => {});
    expect(el.style.touchAction).toBe('pan-x pan-y pinch-zoom');
    spy.mockRestore();
    document.body.removeChild(el);
  });

  it('does not throw when styleInjection is not global and no ref provided', async () => {
    renderHook(() => usePress({ styleInjection: 'inline' }));
    await act(async () => {});
  });

  // ── setTimeout inside onTouchStart ────────────────────────────────────────

  it('resets ignoreEmulatedMouseEvents after 100ms timeout on touchstart', () => {
    vi.useFakeTimers();
    const onClick = vi.fn();
    const { result } = renderHook(() => usePress({ onClick }));
    const el = document.createElement('div');
    act(() => { result.current.pressProps.onTouchStart?.(touchEvent({ currentTarget: el, target: el })); });
    // After 100ms the flag resets and click handler fires normally
    act(() => { vi.advanceTimersByTime(100); });
    act(() => { result.current.pressProps.onClick?.(mouseEvent()); });
    expect(onClick).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
