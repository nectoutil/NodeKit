import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTransitionStatus, useTransitionStyles } from '../src/hooks/useTransitionStatus/useTransitionStatus';

describe('useTransitionStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start unmounted when closed', () => {
    const { result } = renderHook(() =>
      useTransitionStatus({ open: false })
    );

    expect(result.current.isMounted).toBe(false);
    expect(result.current.status).toBe('unmounted');
  });

  it('should mount and set initial status when opened', () => {
    const { result } = renderHook(() =>
      useTransitionStatus({ open: true })
    );

    expect(result.current.isMounted).toBe(true);
    expect(result.current.status).toBe('initial');
  });

  it('should transition to open on next animation frame', async () => {
    const { result } = renderHook(() =>
      useTransitionStatus({ open: true })
    );

    expect(result.current.status).toBe('initial');

    await act(async () => {
      vi.advanceTimersByTime(16);
    });

    expect(result.current.status).toBe('open');
  });

  it('should transition to close then unmounted when closed', async () => {
    const { result, rerender } = renderHook(
      ({ open }) => useTransitionStatus({ open, duration: 100 }),
      { initialProps: { open: true } }
    );

    await act(async () => {
      vi.advanceTimersByTime(16);
    });
    expect(result.current.status).toBe('open');

    rerender({ open: false });
    expect(result.current.status).toBe('close');
    expect(result.current.isMounted).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.status).toBe('unmounted');
    expect(result.current.isMounted).toBe(false);
  });

  it('should use custom duration', async () => {
    const { result, rerender } = renderHook(
      ({ open }) => useTransitionStatus({ open, duration: 500 }),
      { initialProps: { open: true } }
    );

    await act(async () => {
      vi.advanceTimersByTime(16);
    });

    rerender({ open: false });
    expect(result.current.status).toBe('close');

    await act(async () => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current.isMounted).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.isMounted).toBe(false);
  });

  it('should support separate open/close durations', async () => {
    const { result, rerender } = renderHook(
      ({ open }) =>
        useTransitionStatus({ open, duration: { open: 200, close: 300 } }),
      { initialProps: { open: true } }
    );

    await act(async () => {
      vi.advanceTimersByTime(16);
    });

    rerender({ open: false });

    await act(async () => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current.isMounted).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.isMounted).toBe(false);
  });
});

describe('useTransitionStyles', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return common styles when unmounted', () => {
    const { result } = renderHook(() =>
      useTransitionStyles({ open: false, common: { zIndex: 10 } })
    );

    expect(result.current.styles).toEqual({ zIndex: 10 });
  });

  it('should return initial styles with transition props on open', () => {
    const { result } = renderHook(() =>
      useTransitionStyles({
        open: true,
        initial: { opacity: 0 },
        duration: 200
      })
    );

    expect(result.current.status).toBe('initial');
    expect(result.current.styles).toMatchObject({
      opacity: 0,
      transitionProperty: 'opacity, transform',
      transitionDuration: '200ms'
    });
  });

  it('should return open styles after animation frame', async () => {
    const { result } = renderHook(() =>
      useTransitionStyles({
        open: true,
        initial: { opacity: 0 },
        openStyles: { opacity: 1 },
        duration: 200
      })
    );

    await act(async () => {
      vi.advanceTimersByTime(16);
    });

    expect(result.current.status).toBe('open');
    expect(result.current.styles).toMatchObject({
      opacity: 1,
      transitionDuration: '200ms'
    });
  });

  it('should fall back to initial styles for close when no closeStyles', async () => {
    const { result, rerender } = renderHook(
      ({ open }) =>
        useTransitionStyles({
          open,
          initial: { opacity: 0 },
          duration: 100
        }),
      { initialProps: { open: true } }
    );

    await act(async () => {
      vi.advanceTimersByTime(16);
    });

    rerender({ open: false });
    expect(result.current.styles).toMatchObject({ opacity: 0 });
  });

  it('should use closeStyles when provided', async () => {
    const { result, rerender } = renderHook(
      ({ open }) =>
        useTransitionStyles({
          open,
          initial: { opacity: 0 },
          closeStyles: { opacity: 0, transform: 'scale(0.9)' },
          duration: 100
        }),
      { initialProps: { open: true } }
    );

    await act(async () => {
      vi.advanceTimersByTime(16);
    });

    rerender({ open: false });
    expect(result.current.styles).toMatchObject({
      opacity: 0,
      transform: 'scale(0.9)'
    });
  });

  it('should include common styles in all states', async () => {
    const { result } = renderHook(() =>
      useTransitionStyles({
        open: true,
        common: { pointerEvents: 'auto' as const },
        initial: { opacity: 0 },
        duration: 100
      })
    );

    expect(result.current.styles.pointerEvents).toBe('auto');
  });

  it('should use close duration for close transition', async () => {
    const { result, rerender } = renderHook(
      ({ open }) =>
        useTransitionStyles({
          open,
          duration: { open: 100, close: 300 }
        }),
      { initialProps: { open: true } }
    );

    await act(async () => {
      vi.advanceTimersByTime(16);
    });

    rerender({ open: false });
    expect(result.current.styles.transitionDuration).toBe('300ms');
  });
});
