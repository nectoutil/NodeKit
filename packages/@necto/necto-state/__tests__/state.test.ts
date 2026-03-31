/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi } from 'vitest';

import { state, createStore } from '../src/index';

describe('state', () => {
  describe('primitive state', () => {
    it('should create a state with an initial value', () => {
      const count = state(0);
      const store = createStore();

      expect(store.get(count)).toBe(0);
    });

    it('should create a state with a string value', () => {
      const name = state('hello');
      const store = createStore();

      expect(store.get(name)).toBe('hello');
    });

    it('should create a state with an object value', () => {
      const user = state({ name: 'John', age: 30 });
      const store = createStore();

      expect(store.get(user)).toEqual({ name: 'John', age: 30 });
    });

    it('should create a state with undefined when no initial value', () => {
      const empty = state<string>();
      const store = createStore();

      expect(store.get(empty)).toBeUndefined();
    });

    it('should create a state with null initial value', () => {
      const nullable = state<string | null>(null);
      const store = createStore();

      expect(store.get(nullable)).toBeNull();
    });

    it('should create a state with boolean initial value', () => {
      const flag = state(false);
      const store = createStore();

      expect(store.get(flag)).toBe(false);
    });
  });

  describe('store.set', () => {
    it('should update a primitive state with a new value', () => {
      const count = state(0);
      const store = createStore();

      store.set(count, 5);

      expect(store.get(count)).toBe(5);
    });

    it('should update a state with a function updater', () => {
      const count = state(10);
      const store = createStore();

      store.set(count, (prev) => prev + 5);

      expect(store.get(count)).toBe(15);
    });

    it('should handle multiple sequential updates', () => {
      const count = state(0);
      const store = createStore();

      store.set(count, 1);
      store.set(count, 2);
      store.set(count, 3);

      expect(store.get(count)).toBe(3);
    });

    it('should handle function updaters chained together', () => {
      const count = state(0);
      const store = createStore();

      store.set(count, (prev) => prev + 1);
      store.set(count, (prev) => prev + 1);
      store.set(count, (prev) => prev + 1);

      expect(store.get(count)).toBe(3);
    });

    it('should replace an object value entirely', () => {
      const user = state({ name: 'John' });
      const store = createStore();

      store.set(user, { name: 'Jane' });

      expect(store.get(user)).toEqual({ name: 'Jane' });
    });
  });

  describe('store.sub', () => {
    it('should notify listener when state changes', () => {
      const count = state(0);
      const store = createStore();
      const listener = vi.fn();

      store.sub(count, listener);
      store.set(count, 1);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should not notify listener when value is the same', () => {
      const count = state(0);
      const store = createStore();
      const listener = vi.fn();

      store.sub(count, listener);
      store.set(count, 0);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should notify listener on each change', () => {
      const count = state(0);
      const store = createStore();
      const listener = vi.fn();

      store.sub(count, listener);
      store.set(count, 1);
      store.set(count, 2);
      store.set(count, 3);

      expect(listener).toHaveBeenCalledTimes(3);
    });

    it('should stop notifying after unsubscribe', () => {
      const count = state(0);
      const store = createStore();
      const listener = vi.fn();

      const unsub = store.sub(count, listener);
      store.set(count, 1);
      unsub();
      store.set(count, 2);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should support multiple listeners on the same state', () => {
      const count = state(0);
      const store = createStore();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      store.sub(count, listener1);
      store.sub(count, listener2);
      store.set(count, 1);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('should only unsubscribe the specific listener', () => {
      const count = state(0);
      const store = createStore();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      const unsub1 = store.sub(count, listener1);
      store.sub(count, listener2);
      unsub1();
      store.set(count, 1);

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });

  describe('derived state (read-only)', () => {
    it('should derive a value from another state', () => {
      const count = state(2);
      const doubled = state((get) => get(count) * 2);
      const store = createStore();

      expect(store.get(doubled)).toBe(4);
    });

    it('should update when the dependency changes', () => {
      const count = state(2);
      const doubled = state((get) => get(count) * 2);
      const store = createStore();

      store.set(count, 5);

      expect(store.get(doubled)).toBe(10);
    });

    it('should derive from multiple states', () => {
      const firstName = state('John');
      const lastName = state('Doe');
      const fullName = state((get) => `${get(firstName)} ${get(lastName)}`);
      const store = createStore();

      expect(store.get(fullName)).toBe('John Doe');
    });

    it('should update when any dependency changes', () => {
      const firstName = state('John');
      const lastName = state('Doe');
      const fullName = state((get) => `${get(firstName)} ${get(lastName)}`);
      const store = createStore();

      store.set(firstName, 'Jane');

      expect(store.get(fullName)).toBe('Jane Doe');
    });

    it('should support chained derived states', () => {
      const count = state(3);
      const doubled = state((get) => get(count) * 2);
      const quadrupled = state((get) => get(doubled) * 2);
      const store = createStore();

      expect(store.get(quadrupled)).toBe(12);

      store.set(count, 5);

      expect(store.get(quadrupled)).toBe(20);
    });

    it('should notify subscribers of derived state when dependency changes', () => {
      const count = state(0);
      const doubled = state((get) => get(count) * 2);
      const store = createStore();
      const listener = vi.fn();

      store.sub(doubled, listener);
      store.set(count, 5);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(store.get(doubled)).toBe(10);
    });

    it('should not notify when derived value does not change', () => {
      const count = state(0);
      const isPositive = state((get) => get(count) > 0);
      const store = createStore();
      const listener = vi.fn();

      store.sub(isPositive, listener);
      store.set(count, 0);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should handle conditional dependencies', () => {
      const toggle = state(true);
      const a = state('A');
      const b = state('B');
      const result = state((get) => (get(toggle) ? get(a) : get(b)));
      const store = createStore();

      expect(store.get(result)).toBe('A');

      store.set(toggle, false);

      expect(store.get(result)).toBe('B');
    });
  });

  describe('derived state (read-write)', () => {
    it('should support custom write logic', () => {
      const count = state(0);
      const doubledRW = state(
        (get) => get(count) * 2,
        (_get, set, value: number) => set(count, Math.floor(value / 2)),
      );
      const store = createStore();

      expect(store.get(doubledRW)).toBe(0);

      store.set(doubledRW, 10);

      expect(store.get(count)).toBe(5);
      expect(store.get(doubledRW)).toBe(10);
    });

    it('should support write-only derived state with initial value', () => {
      const log: string[] = [];
      const logger = state(
        'idle',
        (_get, _set, message: string) => {
          log.push(message);
        },
      );
      const store = createStore();

      expect(store.get(logger)).toBe('idle');

      store.set(logger, 'hello');

      expect(log).toEqual(['hello']);
    });

    it('should support clamped state', () => {
      const raw = state(50);
      const clamped = state(
        (get) => get(raw),
        (_get, set, value: number) => set(raw, Math.max(0, Math.min(100, value))),
      );
      const store = createStore();

      store.set(clamped, 150);
      expect(store.get(clamped)).toBe(100);

      store.set(clamped, -50);
      expect(store.get(clamped)).toBe(0);

      store.set(clamped, 42);
      expect(store.get(clamped)).toBe(42);
    });

    it('should allow derived write to update multiple states', () => {
      const x = state(0);
      const y = state(0);
      const reset = state(
        (get) => ({ x: get(x), y: get(y) }),
        (_get, set) => {
          set(x, 0);
          set(y, 0);
        },
      );
      const store = createStore();

      store.set(x, 10);
      store.set(y, 20);

      expect(store.get(reset)).toEqual({ x: 10, y: 20 });

      store.set(reset);

      expect(store.get(x)).toBe(0);
      expect(store.get(y)).toBe(0);
    });
  });

  describe('store isolation', () => {
    it('should isolate state between different stores', () => {
      const count = state(0);
      const store1 = createStore();
      const store2 = createStore();

      store1.set(count, 5);

      expect(store1.get(count)).toBe(5);
      expect(store2.get(count)).toBe(0);
    });

    it('should isolate subscriptions between stores', () => {
      const count = state(0);
      const store1 = createStore();
      const store2 = createStore();
      const listener = vi.fn();

      store1.sub(count, listener);
      store2.set(count, 5);

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('onMount', () => {
    it('should call onMount when state is subscribed to', () => {
      const mounted = vi.fn();
      const count = state(0);
      count.onMount = () => {
        mounted();
      };
      const store = createStore();

      expect(mounted).not.toHaveBeenCalled();

      store.sub(count, () => {});

      expect(mounted).toHaveBeenCalledTimes(1);
    });

    it('should call unmount when all subscribers are removed', () => {
      const unmounted = vi.fn();
      const count = state(0);
      count.onMount = () => unmounted;
      const store = createStore();

      const unsub = store.sub(count, () => {});
      unsub();

      expect(unmounted).toHaveBeenCalledTimes(1);
    });

    it('should allow setting initial value in onMount', () => {
      const count = state(0);
      count.onMount = (set) => {
        set(42);
      };
      const store = createStore();

      store.sub(count, () => {});

      expect(store.get(count)).toBe(42);
    });
  });

  describe('toString / debugLabel', () => {
    it('should return a unique string key', () => {
      const a = state(0);
      const b = state(0);

      expect(a.toString()).not.toBe(b.toString());
    });

    it('should include debugLabel when set', () => {
      const count = state(0);
      count.debugLabel = 'count';

      expect(count.toString()).toContain('count');
    });
  });

  describe('edge cases', () => {
    it('should handle NaN correctly (NaN !== NaN but Object.is(NaN, NaN) is true)', () => {
      const num = state(NaN);
      const store = createStore();
      const listener = vi.fn();

      store.sub(num, listener);
      store.set(num, NaN);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should treat +0 and -0 as different values', () => {
      const num = state(+0);
      const store = createStore();
      const listener = vi.fn();

      store.sub(num, listener);
      store.set(num, -0);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should handle setting the same reference object (no change)', () => {
      const obj = { a: 1 };
      const s = state(obj);
      const store = createStore();
      const listener = vi.fn();

      store.sub(s, listener);
      store.set(s, obj);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should handle deeply nested derived chains', () => {
      const base = state(1);
      const d1 = state((get) => get(base) + 1);
      const d2 = state((get) => get(d1) + 1);
      const d3 = state((get) => get(d2) + 1);
      const d4 = state((get) => get(d3) + 1);
      const d5 = state((get) => get(d4) + 1);
      const store = createStore();

      expect(store.get(d5)).toBe(6);

      store.set(base, 10);

      expect(store.get(d5)).toBe(15);
    });

    it('should handle diamond dependency pattern', () => {
      const base = state(1);
      const left = state((get) => get(base) * 2);
      const right = state((get) => get(base) * 3);
      const combined = state((get) => get(left) + get(right));
      const store = createStore();
      const listener = vi.fn();

      store.sub(combined, listener);
      expect(store.get(combined)).toBe(5);

      store.set(base, 2);

      expect(store.get(combined)).toBe(10);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should handle large number of states', () => {
      const store = createStore();
      const states = Array.from({ length: 100 }, (_, i) => state(i));

      const sum = state((get) => states.reduce((acc, s) => acc + get(s), 0));

      expect(store.get(sum)).toBe(4950);

      store.set(states[0]!, 100);

      expect(store.get(sum)).toBe(5050);
    });
  });
});
