/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';

import { state, createStore, getDefaultStore } from '../src/index';

describe('store', () => {
  describe('createStore', () => {
    it('returns a store with get, set, and sub methods', () => {
      const store = createStore();

      expect(typeof store.get).toBe('function');
      expect(typeof store.set).toBe('function');
      expect(typeof store.sub).toBe('function');
    });

    it('creates independent stores (no shared state)', () => {
      const count = state(0);
      const storeA = createStore();
      const storeB = createStore();

      storeA.set(count, 5);

      expect(storeA.get(count)).toBe(5);
      expect(storeB.get(count)).toBe(0);
    });

    it('skips invalidation flush when set does not change state size', () => {
      const s = state(1);
      const store = createStore();
      const listener = vi.fn();

      // Subscribe to make the state "mounted" so writes register as changes
      store.sub(s, listener);
      listener.mockClear();

      // Writing the same value should not increase changedStates size → no flush
      store.set(s, 1);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('getDefaultStore', () => {
    it('returns a store instance', () => {
      const store = getDefaultStore();

      expect(typeof store.get).toBe('function');
      expect(typeof store.set).toBe('function');
      expect(typeof store.sub).toBe('function');
    });

    it('returns the same store instance on subsequent calls', () => {
      const a = getDefaultStore();
      const b = getDefaultStore();

      expect(a).toBe(b);
    });

    it('persists state across calls because it is a singleton', () => {
      const count = state(0);
      const first = getDefaultStore();
      first.set(count, 42);

      const second = getDefaultStore();

      expect(second.get(count)).toBe(42);
    });

    it('is isolated from createStore()', () => {
      const count = state(0);
      const def = getDefaultStore();
      const custom = createStore();

      def.set(count, 7);

      expect(def.get(count)).toBe(7);
      expect(custom.get(count)).toBe(0);
    });
  });

  describe('abort handling', () => {
    it('aborts an in-flight derived promise when the dependency changes', async () => {
      const base = state(0);

      // Derived state that resolves asynchronously and uses the signal
      const asyncDerived = state(async (get, { signal }) => {
        const value = get(base);
        return new Promise<number>((resolve, reject) => {
          const t = setTimeout(() => resolve(value * 10), 50);
          signal.addEventListener('abort', () => {
            clearTimeout(t);
            reject(new Error('aborted'));
          });
        });
      });

      const store = createStore();

      // Start the first read — returns a pending promise, registerAbortHandler fires
      const first = store.get(asyncDerived);
      expect(first).toBeInstanceOf(Promise);

      // Change the dependency before the first promise resolves.
      // Writing base triggers recompute on asyncDerived, which overwrites the
      // pending promise → abortPromise runs → registered abort handler is invoked.
      store.set(base, 1);

      // The first pending promise should reject via the abort path.
      await expect(first).rejects.toThrow('aborted');

      // A fresh read should resolve with the new base value.
      const second = await store.get(asyncDerived);
      expect(second).toBe(10);
    });

    it('does not leak abort handlers after the promise settles', async () => {
      const base = state(1);
      const asyncDerived = state(async (get) => {
        return Promise.resolve(get(base) + 100);
      });

      const store = createStore();

      // Read resolves immediately via microtask; abort handler cleanup runs via .then().
      const value = await store.get(asyncDerived);
      expect(value).toBe(101);

      // Subsequent writes to base should not throw even though the previous
      // promise has already settled and its abort handlers were cleaned up.
      expect(() => store.set(base, 2)).not.toThrow();

      const next = await store.get(asyncDerived);
      expect(next).toBe(102);
    });

    it('registers multiple abort handlers for the same pending promise', async () => {
      const base = state(0);

      // Two consumers derive from `base` via async reads, both share `base`
      // as a dependency. When base changes, both derived promises get aborted.
      const derivedA = state(async (get, { signal }) => {
        const v = get(base);
        return new Promise<number>((resolve, reject) => {
          const t = setTimeout(() => resolve(v + 1), 100);
          signal.addEventListener('abort', () => {
            clearTimeout(t);
            reject(new Error('abort A'));
          });
        });
      });

      const derivedB = state(async (get, { signal }) => {
        const v = get(base);
        return new Promise<number>((resolve, reject) => {
          const t = setTimeout(() => resolve(v + 2), 100);
          signal.addEventListener('abort', () => {
            clearTimeout(t);
            reject(new Error('abort B'));
          });
        });
      });

      const store = createStore();

      const promiseA = store.get(derivedA);
      const promiseB = store.get(derivedB);

      // Invalidate both dependents.
      store.set(base, 99);

      // Both pending promises abort via their registered handlers.
      await expect(promiseA).rejects.toThrow('abort A');
      await expect(promiseB).rejects.toThrow('abort B');
    });
  });
});
