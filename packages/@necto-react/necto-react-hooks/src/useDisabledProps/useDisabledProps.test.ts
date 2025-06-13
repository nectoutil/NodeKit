/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { describe, it, expect, vi} from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDisabledProps } from './useDisabledProps';
import * as useDisabledModule from '@necto-react-hooks/useDisabled';

describe('useDisabledProps', () => {
  const mockUseDisabled = (returnValue: boolean) => {
    vi.spyOn(useDisabledModule, 'useDisabled').mockReturnValue(returnValue);
  };

  it('should return extraProps unchanged if not disabled', () => {
    mockUseDisabled(false);
    const extraProps = { id: 'test', tabIndex: 0 };
    const { result } = renderHook(() =>
      useDisabledProps({ extraProps })
    );
    expect(result.current).toEqual(extraProps);
  });

  it('should add aria-disabled if isDisabled is true', () => {
    mockUseDisabled(true);
    const extraProps = { id: 'test' };
    const { result } = renderHook(() =>
      useDisabledProps({ extraProps })
    );
    expect(result.current['aria-disabled']).toBe(true);
    expect(result.current.id).toBe('test');
    expect('disabled' in result.current).toBe(false);
  });

  it('should add disabled and aria-disabled if onClick is present and isDisabled is true', () => {
    mockUseDisabled(true);
    const onClick = vi.fn();
    const extraProps = { onClick, id: 'test' };
    const { result } = renderHook(() =>
      useDisabledProps({ extraProps })
    );
    expect('disabled' in result.current).toBe(true);
    if ('disabled' in result.current) {
      expect((result.current as any).disabled).toBe(true);
    }
    expect(result.current['aria-disabled']).toBe(true);
    expect(result.current.onClick).toBe(onClick);
    expect(result.current.id).toBe('test');
  });

  it('should add disabled and aria-disabled if onChange is present and isDisabled is true', () => {
    mockUseDisabled(true);
    const onChange = vi.fn();
    const extraProps = { onChange, id: 'test' };
    const { result } = renderHook(() =>
      useDisabledProps({ extraProps })
    );
    expect('disabled' in result.current).toBe(true);
    if ('disabled' in result.current) {
      expect((result.current as any).disabled).toBe(true);
    }
    expect(result.current['aria-disabled']).toBe(true);
    expect(result.current.onChange).toBe(onChange);
    expect(result.current.id).toBe('test');
    expect(result.current.onChange).toBe(onChange);
    expect(result.current.id).toBe('test');
  });
});