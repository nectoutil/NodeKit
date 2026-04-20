/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRenderer } from '@necto-react/hooks';

describe('useRenderer', () => {
  describe('className', () => {
    it('uses defaultClassName when no className is provided', () => {
      const { result } = renderHook(() =>
        useRenderer({ values: {}, defaultClassName: 'necto' })
      );
      expect(result.current.className).toBe('necto');
    });

    it('combines defaultClassName with a static className', () => {
      const { result } = renderHook(() =>
        useRenderer({ values: {}, defaultClassName: 'necto', className: 'custom' })
      );
      expect(result.current.className).toBe('necto custom');
    });

    it('calls className function with values and defaultClassName', () => {
      const { result } = renderHook(() =>
        useRenderer({
          values: { isActive: true },
          defaultClassName: 'necto',
          className: ({ defaultClassName, isActive }: { defaultClassName: string; isActive: boolean }) =>
            `${defaultClassName}${isActive ? ' active' : ''}`
        })
      );
      expect(result.current.className).toBe('necto active');
    });

    it('falls back to "necto" when no defaultClassName is given', () => {
      const { result } = renderHook(() => useRenderer({ values: {} }));
      expect(result.current.className).toBe('necto');
    });
  });

  describe('style', () => {
    it('merges defaultStyle with user style', () => {
      const { result } = renderHook(() =>
        useRenderer({
          values: {},
          defaultStyle: { color: 'red' },
          style: { fontSize: '14px' }
        })
      );
      expect(result.current.style).toEqual({ color: 'red', fontSize: '14px' });
    });

    it('user style overrides defaultStyle', () => {
      const { result } = renderHook(() =>
        useRenderer({
          values: {},
          defaultStyle: { color: 'red' },
          style: { color: 'blue' }
        })
      );
      expect(result.current.style?.color).toBe('blue');
    });

    it('calls style function with values and defaultStyle', () => {
      const { result } = renderHook(() =>
        useRenderer({
          values: { isActive: true },
          defaultStyle: { opacity: 0 },
          style: ({ isActive }: { isActive: boolean }) => ({ opacity: isActive ? 1 : 0 })
        })
      );
      expect(result.current.style).toEqual({ opacity: 1 });
    });
  });

  describe('children', () => {
    it('returns defaultChildren when no children are provided', () => {
      const { result } = renderHook(() =>
        useRenderer({ values: {}, defaultChildren: 'default' })
      );
      expect(result.current.children).toBe('default');
    });

    it('returns children over defaultChildren', () => {
      const { result } = renderHook(() =>
        useRenderer({ values: {}, defaultChildren: 'default', children: 'custom' })
      );
      expect(result.current.children).toBe('custom');
    });

    it('calls children function with values and defaultChildren', () => {
      const { result } = renderHook(() =>
        useRenderer({
          values: { name: 'world' },
          defaultChildren: 'fallback',
          children: ({ name }: { name: string }) => `hello ${name}`
        })
      );
      expect(result.current.children).toBe('hello world');
    });
  });
});
