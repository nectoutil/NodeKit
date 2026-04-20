/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runAfterTransition } from '../src/transitions';

describe('runAfterTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('runs the callback when no transitions are active', () => {
    const callback = vi.fn();
    runAfterTransition(callback);

    vi.runAllTimers();

    expect(callback).toHaveBeenCalledOnce();
  });

  it('does not throw', () => {
    expect(() => {
      runAfterTransition(() => {});
      vi.runAllTimers();
    }).not.toThrow();
  });

  it('runs multiple independent callbacks', () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();

    runAfterTransition(cb1);
    runAfterTransition(cb2);
    vi.runAllTimers();

    expect(cb1).toHaveBeenCalledOnce();
    expect(cb2).toHaveBeenCalledOnce();
  });

  it('does not call the callback before the animation frame fires', () => {
    const callback = vi.fn();
    runAfterTransition(callback);

    expect(callback).not.toHaveBeenCalled();

    vi.runAllTimers();
    expect(callback).toHaveBeenCalledOnce();
  });
});
