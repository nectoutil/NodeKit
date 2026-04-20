/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createElement } from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useFormState,
  mergeValidation,
  FormValidationContext,
  DEFAULT_VALIDATION_RESULT,
  VALID_VALIDITY_STATE
} from '@necto-react/hooks';

const INVALID_DETAILS = { ...VALID_VALIDITY_STATE, customError: true, valid: false };

describe('useFormState', () => {
  describe('defaults', () => {
    it('returns default valid state when nothing is provided', () => {
      const { result } = renderHook(() => useFormState({ value: '' }));
      expect(result.current.realtimeValidation).toEqual(DEFAULT_VALIDATION_RESULT);
      expect(result.current.displayValidation).toEqual(DEFAULT_VALIDATION_RESULT);
    });

    it('exposes updateValidation, resetValidation, and commitValidation', () => {
      const { result } = renderHook(() => useFormState({ value: '' }));
      expect(typeof result.current.updateValidation).toBe('function');
      expect(typeof result.current.resetValidation).toBe('function');
      expect(typeof result.current.commitValidation).toBe('function');
    });
  });

  describe('controlled isInvalid', () => {
    it('marks realtimeValidation as invalid when isInvalid is true', () => {
      const { result } = renderHook(() => useFormState({ value: '', isInvalid: true }));
      expect(result.current.realtimeValidation.isInvalid).toBe(true);
    });

    it('marks displayValidation as invalid when isInvalid is true', () => {
      const { result } = renderHook(() => useFormState({ value: '', isInvalid: true }));
      expect(result.current.displayValidation.isInvalid).toBe(true);
    });

    it('marks realtimeValidation as valid when isInvalid is false', () => {
      const { result } = renderHook(() => useFormState({ value: '', isInvalid: false }));
      expect(result.current.realtimeValidation.isInvalid).toBe(false);
    });
  });

  describe('client validation — aria mode (default)', () => {
    it('shows error in realtimeValidation when validate returns an error string', () => {
      const { result } = renderHook(() =>
        useFormState({ value: 'bad', validate: (v) => v === 'bad' ? 'Invalid' : undefined })
      );
      expect(result.current.realtimeValidation.isInvalid).toBe(true);
      expect(result.current.realtimeValidation.validationErrors).toContain('Invalid');
    });

    it('shows no error when validate returns undefined', () => {
      const { result } = renderHook(() =>
        useFormState({ value: 'good', validate: (v) => v === 'bad' ? 'Invalid' : undefined })
      );
      expect(result.current.realtimeValidation.isInvalid).toBe(false);
    });

    it('shows errors immediately in displayValidation in aria mode', () => {
      const { result } = renderHook(() =>
        useFormState({ value: 'bad', validate: () => 'Error', validationBehavior: 'aria' })
      );
      expect(result.current.displayValidation.isInvalid).toBe(true);
    });

    it('returns null for validate returning true (valid)', () => {
      const { result } = renderHook(() =>
        useFormState({ value: 'x', validate: () => true })
      );
      expect(result.current.realtimeValidation.isInvalid).toBe(false);
    });
  });

  describe('client validation — native mode', () => {
    it('does not show client errors in displayValidation before commit', () => {
      const { result } = renderHook(() =>
        useFormState({ value: 'bad', validate: () => 'Error', validationBehavior: 'native' })
      );
      expect(result.current.displayValidation.isInvalid).toBe(false);
    });

    it('shows client errors in displayValidation after commitValidation', () => {
      const { result } = renderHook(() =>
        useFormState({ value: 'bad', validate: () => 'Error', validationBehavior: 'native' })
      );
      act(() => { result.current.commitValidation(); });
      act(() => {});
      expect(result.current.displayValidation.isInvalid).toBe(true);
    });
  });

  describe('resetValidation', () => {
    it('clears displayValidation in native mode', () => {
      const { result } = renderHook(() =>
        useFormState({ value: 'bad', validate: () => 'Error', validationBehavior: 'native' })
      );
      act(() => { result.current.commitValidation(); });
      act(() => {});
      act(() => { result.current.resetValidation(); });
      expect(result.current.displayValidation.isInvalid).toBe(false);
    });
  });

  describe('server errors via FormValidationContext', () => {
    it('shows server errors from context', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) =>
        createElement(FormValidationContext.Provider, { value: { email: 'Email taken' } }, children);

      const { result } = renderHook(
        () => useFormState({ value: '', name: 'email' }),
        { wrapper }
      );
      expect(result.current.realtimeValidation.isInvalid).toBe(true);
      expect(result.current.realtimeValidation.validationErrors).toContain('Email taken');
    });

    it('shows no server errors when context is empty', () => {
      const { result } = renderHook(() => useFormState({ value: '', name: 'email' }));
      expect(result.current.realtimeValidation.isInvalid).toBe(false);
    });
  });
});

describe('mergeValidation', () => {
  it('merges multiple valid results into a valid result', () => {
    const merged = mergeValidation(DEFAULT_VALIDATION_RESULT, DEFAULT_VALIDATION_RESULT);
    expect(merged.isInvalid).toBe(false);
    expect(merged.validationErrors).toHaveLength(0);
  });

  it('merges errors from multiple invalid results', () => {
    const a = { isInvalid: true, validationErrors: ['Error A'], validationDetails: INVALID_DETAILS };
    const b = { isInvalid: true, validationErrors: ['Error B'], validationDetails: INVALID_DETAILS };
    const merged = mergeValidation(a, b);
    expect(merged.isInvalid).toBe(true);
    expect(merged.validationErrors).toContain('Error A');
    expect(merged.validationErrors).toContain('Error B');
  });

  it('deduplicates identical error messages', () => {
    const a = { isInvalid: true, validationErrors: ['Same'], validationDetails: INVALID_DETAILS };
    const merged = mergeValidation(a, a);
    expect(merged.validationErrors).toHaveLength(1);
  });

  it('is invalid when any result is invalid', () => {
    const invalid = { isInvalid: true, validationErrors: ['Err'], validationDetails: INVALID_DETAILS };
    const merged = mergeValidation(DEFAULT_VALIDATION_RESULT, invalid);
    expect(merged.isInvalid).toBe(true);
  });

  it('has valid:false when merged result is invalid', () => {
    const invalid = { isInvalid: true, validationErrors: ['Err'], validationDetails: INVALID_DETAILS };
    const merged = mergeValidation(DEFAULT_VALIDATION_RESULT, invalid);
    expect(merged.validationDetails.valid).toBe(false);
  });
});
