import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRole } from '../src/hooks/useRole/useRole';

describe('useRole', () => {
  it('should return reference and floating prop objects', () => {
    const { result } = renderHook(() => useRole({ open: true }));

    expect(result.current.reference).toBeDefined();
    expect(result.current.floating).toBeDefined();
  });

  it('should default to dialog role', () => {
    const { result } = renderHook(() => useRole({ open: true }));

    expect(result.current.floating.role).toBe('dialog');
    expect(result.current.floating['aria-modal']).toBe('true');
  });

  it('should set aria-expanded on reference for dialog', () => {
    const { result } = renderHook(() => useRole({ open: true }));

    expect(result.current.reference['aria-expanded']).toBe(true);
    expect(result.current.reference['aria-haspopup']).toBe('dialog');
    expect(result.current.reference['aria-controls']).toBeDefined();
  });

  it('should unset aria-controls when closed', () => {
    const { result } = renderHook(() => useRole({ open: false }));

    expect(result.current.reference['aria-expanded']).toBe(false);
    expect(result.current.reference['aria-controls']).toBeUndefined();
  });

  it('should use tooltip role correctly', () => {
    const { result } = renderHook(() =>
      useRole({ open: true, role: 'tooltip' })
    );

    expect(result.current.floating.role).toBe('tooltip');
    expect(result.current.floating['aria-modal']).toBeUndefined();
    expect(result.current.reference['aria-describedby']).toBeDefined();
    expect(result.current.reference['aria-expanded']).toBeUndefined();
  });

  it('should unset aria-describedby for tooltip when closed', () => {
    const { result } = renderHook(() =>
      useRole({ open: false, role: 'tooltip' })
    );

    expect(result.current.reference['aria-describedby']).toBeUndefined();
  });

  it('should use menu role with aria-haspopup=menu', () => {
    const { result } = renderHook(() =>
      useRole({ open: true, role: 'menu' })
    );

    expect(result.current.floating.role).toBe('menu');
    expect(result.current.reference['aria-haspopup']).toBe('menu');
  });

  it('should use listbox role with aria-haspopup=listbox', () => {
    const { result } = renderHook(() =>
      useRole({ open: true, role: 'listbox' })
    );

    expect(result.current.reference['aria-haspopup']).toBe('listbox');
  });

  it('should set aria-modal for alertdialog', () => {
    const { result } = renderHook(() =>
      useRole({ open: true, role: 'alertdialog' })
    );

    expect(result.current.floating.role).toBe('alertdialog');
    expect(result.current.floating['aria-modal']).toBe('true');
  });

  it('should return empty props when disabled', () => {
    const { result } = renderHook(() =>
      useRole({ open: true, enabled: false })
    );

    expect(result.current.reference).toEqual({});
    expect(result.current.floating).toEqual({});
  });

  it('should assign matching id between reference controls and floating id', () => {
    const { result } = renderHook(() => useRole({ open: true }));

    const floatingId = result.current.floating.id;
    expect(floatingId).toBeDefined();
    expect(result.current.reference['aria-controls']).toBe(floatingId);
  });
});
