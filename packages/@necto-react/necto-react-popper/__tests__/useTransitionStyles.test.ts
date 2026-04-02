import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTransitionStyles } from '../src/hooks/useTransitionStyles';

describe('useTransitionStyles', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('default behavior', () => {
    it('should return isMounted=false, status=unmounted, and empty-ish styles when closed', () => {
      const { result } = renderHook(() =>
        useTransitionStyles({ open: false })
      );

      expect(result.current.isMounted).toBe(false);
      expect(result.current.status).toBe('unmounted');
      expect(result.current.styles).toEqual({});
    });

    it('should return common styles only when unmounted with common provided', () => {
      const { result } = renderHook(() =>
        useTransitionStyles({ open: false, common: { zIndex: 10 } })
      );

      expect(result.current.styles).toEqual({ zIndex: 10 });
    });
  });

  describe('opening transition', () => {
    it('should mount and set initial status when opened', () => {
      const { result } = renderHook(() =>
        useTransitionStyles({ open: true })
      );

      expect(result.current.isMounted).toBe(true);
      expect(result.current.status).toBe('initial');
    });

    it('should return initial styles with transition properties on initial status', () => {
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
        transitionProperty: 'opacity',
        transitionDuration: '200ms'
      });
    });

    it('should transition to open status and apply openStyles after animation frame', async () => {
      const { result } = renderHook(() =>
        useTransitionStyles({
          open: true,
          initial: { opacity: 0 },
          openStyles: { opacity: 1 },
          duration: 200
        })
      );

      expect(result.current.status).toBe('initial');

      await act(async () => {
        vi.advanceTimersByTime(16);
      });

      expect(result.current.status).toBe('open');
      expect(result.current.styles).toMatchObject({
        opacity: 1,
        transitionProperty: 'opacity',
        transitionDuration: '200ms'
      });
    });
  });

  describe('closing transition', () => {
    it('should set status to close then unmounted after duration', async () => {
      const { result, rerender } = renderHook(
        ({ open }) =>
          useTransitionStyles({ open, duration: 100 }),
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

    it('should apply close styles during closing', async () => {
      const { result, rerender } = renderHook(
        ({ open }) =>
          useTransitionStyles({
            open,
            initial: { opacity: 0 },
            openStyles: { opacity: 1 },
            duration: 100
          }),
        { initialProps: { open: true } }
      );

      await act(async () => {
        vi.advanceTimersByTime(16);
      });

      rerender({ open: false });
      expect(result.current.status).toBe('close');
      expect(result.current.styles).toMatchObject({
        opacity: 0,
        transitionDuration: '100ms'
      });
    });
  });

  describe('custom initial/openStyles', () => {
    it('should apply custom initial styles with opacity and transform', () => {
      const { result } = renderHook(() =>
        useTransitionStyles({
          open: true,
          initial: { opacity: 0, transform: 'scale(0.9)' },
          openStyles: { opacity: 1, transform: 'scale(1)' },
          duration: 200
        })
      );

      expect(result.current.status).toBe('initial');
      expect(result.current.styles).toMatchObject({
        opacity: 0,
        transform: 'scale(0.9)',
        transitionDuration: '200ms'
      });
    });

    it('should apply custom openStyles after animation frame', async () => {
      const { result } = renderHook(() =>
        useTransitionStyles({
          open: true,
          initial: { opacity: 0, transform: 'scale(0.9)' },
          openStyles: { opacity: 1, transform: 'scale(1)' },
          duration: 200
        })
      );

      await act(async () => {
        vi.advanceTimersByTime(16);
      });

      expect(result.current.status).toBe('open');
      expect(result.current.styles).toMatchObject({
        opacity: 1,
        transform: 'scale(1)',
        transitionDuration: '200ms'
      });
    });
  });

  describe('transitionProperty derivation', () => {
    it('should derive transitionProperty as opacity when only opacity styles are provided', () => {
      const { result } = renderHook(() =>
        useTransitionStyles({
          open: true,
          initial: { opacity: 0 },
          openStyles: { opacity: 1 }
        })
      );

      expect(result.current.styles.transitionProperty).toBe('opacity');
    });

    it('should derive transitionProperty as opacity, transform when both are provided', () => {
      const { result } = renderHook(() =>
        useTransitionStyles({
          open: true,
          initial: { opacity: 0, transform: 'translateY(-10px)' },
          openStyles: { opacity: 1, transform: 'translateY(0)' }
        })
      );

      expect(result.current.styles.transitionProperty).toBe(
        'opacity, transform'
      );
    });

    it('should include properties from closeStyles in transitionProperty', () => {
      const { result } = renderHook(() =>
        useTransitionStyles({
          open: true,
          initial: { opacity: 0 },
          openStyles: { opacity: 1 },
          closeStyles: { opacity: 0, transform: 'scale(0.8)' }
        })
      );

      expect(result.current.styles.transitionProperty).toBe(
        'opacity, transform'
      );
    });

    it('should deduplicate properties across initial, openStyles, and closeStyles', () => {
      const { result } = renderHook(() =>
        useTransitionStyles({
          open: true,
          initial: { opacity: 0, transform: 'scale(0.9)' },
          openStyles: { opacity: 1, transform: 'scale(1)' },
          closeStyles: { opacity: 0, transform: 'scale(0.8)' }
        })
      );

      expect(result.current.styles.transitionProperty).toBe(
        'opacity, transform'
      );
    });

    it('should not include transitionProperty or transitionDuration keys in transitionProperty value', () => {
      const { result } = renderHook(() =>
        useTransitionStyles({
          open: true,
          initial: { opacity: 0 },
          openStyles: { opacity: 1 }
        })
      );

      const transitionProp = result.current.styles.transitionProperty as string;
      expect(transitionProp).not.toContain('transitionProperty');
      expect(transitionProp).not.toContain('transitionDuration');
    });
  });

  describe('custom duration', () => {
    it('should use a number duration for both open and close', async () => {
      const { result, rerender } = renderHook(
        ({ open }) =>
          useTransitionStyles({ open, duration: 400 }),
        { initialProps: { open: true } }
      );

      expect(result.current.styles.transitionDuration).toBe('400ms');

      await act(async () => {
        vi.advanceTimersByTime(16);
      });

      expect(result.current.styles.transitionDuration).toBe('400ms');

      rerender({ open: false });
      expect(result.current.styles.transitionDuration).toBe('400ms');
    });

    it('should use separate open/close durations from object form', async () => {
      const { result, rerender } = renderHook(
        ({ open }) =>
          useTransitionStyles({
            open,
            duration: { open: 150, close: 300 }
          }),
        { initialProps: { open: true } }
      );

      expect(result.current.styles.transitionDuration).toBe('150ms');

      await act(async () => {
        vi.advanceTimersByTime(16);
      });

      expect(result.current.styles.transitionDuration).toBe('150ms');

      rerender({ open: false });
      expect(result.current.styles.transitionDuration).toBe('300ms');
    });

    it('should default to 250ms when duration is not specified', () => {
      const { result } = renderHook(() =>
        useTransitionStyles({ open: true })
      );

      expect(result.current.styles.transitionDuration).toBe('250ms');
    });

    it('should default missing open/close in object duration to 250ms', async () => {
      const { result, rerender } = renderHook(
        ({ open }) =>
          useTransitionStyles({
            open,
            duration: { open: 100 }
          }),
        { initialProps: { open: true } }
      );

      expect(result.current.styles.transitionDuration).toBe('100ms');

      await act(async () => {
        vi.advanceTimersByTime(16);
      });

      rerender({ open: false });
      expect(result.current.styles.transitionDuration).toBe('250ms');
    });
  });

  describe('closeStyles fallback', () => {
    it('should fall back to initial styles when no closeStyles provided', async () => {
      const { result, rerender } = renderHook(
        ({ open }) =>
          useTransitionStyles({
            open,
            initial: { opacity: 0 },
            openStyles: { opacity: 1 },
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

    it('should use explicit closeStyles when provided instead of initial', async () => {
      const { result, rerender } = renderHook(
        ({ open }) =>
          useTransitionStyles({
            open,
            initial: { opacity: 0 },
            closeStyles: { opacity: 0.5, transform: 'scale(0.9)' },
            duration: 100
          }),
        { initialProps: { open: true } }
      );

      await act(async () => {
        vi.advanceTimersByTime(16);
      });

      rerender({ open: false });
      expect(result.current.styles).toMatchObject({
        opacity: 0.5,
        transform: 'scale(0.9)'
      });
    });
  });

  describe('common styles', () => {
    it('should include common styles in initial state', () => {
      const { result } = renderHook(() =>
        useTransitionStyles({
          open: true,
          common: { pointerEvents: 'auto' as const },
          initial: { opacity: 0 }
        })
      );

      expect(result.current.styles.pointerEvents).toBe('auto');
      expect(result.current.styles).toMatchObject({ opacity: 0 });
    });

    it('should include common styles in open state', async () => {
      const { result } = renderHook(() =>
        useTransitionStyles({
          open: true,
          common: { pointerEvents: 'auto' as const },
          openStyles: { opacity: 1 }
        })
      );

      await act(async () => {
        vi.advanceTimersByTime(16);
      });

      expect(result.current.styles.pointerEvents).toBe('auto');
      expect(result.current.styles).toMatchObject({ opacity: 1 });
    });

    it('should include common styles in close state', async () => {
      const { result, rerender } = renderHook(
        ({ open }) =>
          useTransitionStyles({
            open,
            common: { pointerEvents: 'none' as const },
            initial: { opacity: 0 },
            duration: 100
          }),
        { initialProps: { open: true } }
      );

      await act(async () => {
        vi.advanceTimersByTime(16);
      });

      rerender({ open: false });
      expect(result.current.styles.pointerEvents).toBe('none');
    });

    it('should return only common styles when unmounted', () => {
      const { result } = renderHook(() =>
        useTransitionStyles({
          open: false,
          common: { zIndex: 50 }
        })
      );

      expect(result.current.styles).toEqual({ zIndex: 50 });
    });

    it('should default to empty common styles', () => {
      const { result } = renderHook(() =>
        useTransitionStyles({ open: false })
      );

      expect(result.current.styles).toEqual({});
    });
  });
});
