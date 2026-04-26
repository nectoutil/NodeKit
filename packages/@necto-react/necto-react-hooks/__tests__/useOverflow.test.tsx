/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useEffect } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { useOverflow } from '@necto-react/hooks';

/**
 * Test harness: renders a flex row with `items` plus a fake spacer that the
 * test controls. Items are 40px wide. The container width is also controlled
 * by the test, so we can deterministically force overflow without depending
 * on real layout.
 */
interface HarnessProps {
  items: ReadonlyArray<string>;
  containerWidth: number;
  collapseFrom?: 'start' | 'end';
  minVisible?: number;
  onState?: (state: {
    visibleItems: ReadonlyArray<string>;
    hiddenItems: ReadonlyArray<string>;
    hiddenCount: number;
    isReady: boolean;
  }) => void;
}

const ITEM_WIDTH = 40;

function Harness({
  items,
  containerWidth,
  collapseFrom = 'end',
  minVisible = 1,
  onState
}: HarnessProps) {
  const overflow = useOverflow({ items, collapseFrom, minVisible });

  useEffect(() => {
    onState?.({
      visibleItems: overflow.visibleItems,
      hiddenItems: overflow.hiddenItems,
      hiddenCount: overflow.hiddenCount,
      isReady: overflow.isReady
    });
  });

  return (
    <div
      ref={(node) => {
        if (!node) return;
        overflow.containerRef.current = node;
        // Stub the container width so the partition algorithm reads it
        // deterministically regardless of jsdom/browser rendering.
        Object.defineProperty(node, 'getBoundingClientRect', {
          value: () => ({
            width: containerWidth,
            height: 32,
            top: 0,
            left: 0,
            right: containerWidth,
            bottom: 32,
            x: 0,
            y: 0,
            toJSON() {
              return this;
            }
          }),
          configurable: true
        });
      }}
      data-testid="container"
    >
      {overflow.visibleItems.map((label) => (
        <span key={label} data-testid="item" style={{ width: ITEM_WIDTH }}>
          {label}
        </span>
      ))}
      <div
        ref={(node) => {
          if (!node) return;
          overflow.spacerRef.current = node;
          // The spacer's width reflects how much room is left in the row.
          // Compute it from container width minus item count × item width.
          const usedWidth: number = overflow.visibleItems.length * ITEM_WIDTH;
          const remaining: number = Math.max(0, containerWidth - usedWidth);
          Object.defineProperty(node, 'getBoundingClientRect', {
            value: () => ({
              width: remaining,
              height: 32,
              top: 0,
              left: 0,
              right: remaining,
              bottom: 32,
              x: 0,
              y: 0,
              toJSON() {
                return this;
              }
            }),
            configurable: true
          });
        }}
        data-testid="spacer"
      />
    </div>
  );
}

describe('useOverflow', () => {
  test('returns all items as visible when the container fits everything', async () => {
    const items = ['a', 'b', 'c'] as const;
    const states: Array<{
      visibleItems: ReadonlyArray<string>;
      hiddenItems: ReadonlyArray<string>;
      hiddenCount: number;
      isReady: boolean;
    }> = [];

    render(
      <Harness items={[...items]} containerWidth={500} onState={(s) => states.push(s)} />
    );

    await waitFor(() => {
      expect(states.at(-1)?.isReady).toBe(true);
    });

    const last = states.at(-1)!;
    expect(last.visibleItems).toEqual(['a', 'b', 'c']);
    expect(last.hiddenItems).toEqual([]);
    expect(last.hiddenCount).toBe(0);
  });

  test('hides items from the end when collapseFrom is "end"', async () => {
    // 3 items × 40px = 120px content, container is 80px → 1 item must hide
    // (80 / 40 = 2, but spacer needs at least 0.9 of width, so visible = 1)
    const items = ['a', 'b', 'c'] as const;
    const states: Array<{
      visibleItems: ReadonlyArray<string>;
      hiddenItems: ReadonlyArray<string>;
      hiddenCount: number;
      isReady: boolean;
    }> = [];

    render(
      <Harness
        items={[...items]}
        containerWidth={80}
        collapseFrom="end"
        onState={(s) => states.push(s)}
      />
    );

    await waitFor(() => {
      const last = states.at(-1)!;
      expect(last.isReady).toBe(true);
      expect(last.hiddenCount).toBeGreaterThan(0);
    });

    const last = states.at(-1)!;
    // Should drop from the end first.
    expect(last.visibleItems[0]).toBe('a');
    expect(last.hiddenItems[last.hiddenItems.length - 1]).toBe('c');
  });

  test('hides items from the start when collapseFrom is "start"', async () => {
    const items = ['a', 'b', 'c'] as const;
    const states: Array<{
      visibleItems: ReadonlyArray<string>;
      hiddenItems: ReadonlyArray<string>;
      hiddenCount: number;
      isReady: boolean;
    }> = [];

    render(
      <Harness
        items={[...items]}
        containerWidth={80}
        collapseFrom="start"
        onState={(s) => states.push(s)}
      />
    );

    await waitFor(() => {
      const last = states.at(-1)!;
      expect(last.isReady).toBe(true);
      expect(last.hiddenCount).toBeGreaterThan(0);
    });

    const last = states.at(-1)!;
    // Should drop from the start first.
    expect(last.hiddenItems[0]).toBe('a');
    expect(last.visibleItems.at(-1)).toBe('c');
  });

  test('respects minVisible — never hides below the threshold', async () => {
    const items = ['a', 'b', 'c', 'd'] as const;
    const states: Array<{
      visibleItems: ReadonlyArray<string>;
      hiddenItems: ReadonlyArray<string>;
      hiddenCount: number;
      isReady: boolean;
    }> = [];

    // Container barely fits one item (40px) — but minVisible=2 forces 2 visible.
    render(
      <Harness
        items={[...items]}
        containerWidth={20}
        minVisible={2}
        onState={(s) => states.push(s)}
      />
    );

    await waitFor(() => {
      expect(states.at(-1)?.isReady).toBe(true);
    });

    expect(states.at(-1)!.visibleItems.length).toBeGreaterThanOrEqual(2);
  });

  test('exposes containerRef and spacerRef as ref objects', () => {
    let captured: {
      containerRef?: React.RefObject<HTMLElement | null>;
      spacerRef?: React.RefObject<HTMLElement | null>;
    } = {};

    function Probe() {
      const overflow = useOverflow({ items: ['a'] });
      captured = {
        containerRef: overflow.containerRef,
        spacerRef: overflow.spacerRef
      };
      return null;
    }

    render(<Probe />);
    expect(captured.containerRef).toBeDefined();
    expect(captured.spacerRef).toBeDefined();
    expect('current' in captured.containerRef!).toBe(true);
    expect('current' in captured.spacerRef!).toBe(true);
  });

  test('resets visible/hidden when items change', async () => {
    const states: Array<{
      visibleItems: ReadonlyArray<string>;
      hiddenItems: ReadonlyArray<string>;
      hiddenCount: number;
      isReady: boolean;
    }> = [];

    const { rerender } = render(
      <Harness
        items={['a', 'b', 'c']}
        containerWidth={80}
        onState={(s) => states.push(s)}
      />
    );

    await waitFor(() => {
      expect(states.at(-1)?.isReady).toBe(true);
      expect(states.at(-1)?.hiddenCount).toBeGreaterThan(0);
    });

    states.length = 0;

    await act(async () => {
      rerender(
        <Harness
          items={['x', 'y']}
          containerWidth={500}
          onState={(s) => states.push(s)}
        />
      );
    });

    await waitFor(() => {
      const last = states.at(-1)!;
      expect(last.visibleItems).toEqual(['x', 'y']);
      expect(last.hiddenCount).toBe(0);
    });
  });

  test('returns hiddenCount equal to hiddenItems.length', async () => {
    const states: Array<{
      visibleItems: ReadonlyArray<string>;
      hiddenItems: ReadonlyArray<string>;
      hiddenCount: number;
      isReady: boolean;
    }> = [];

    render(
      <Harness
        items={['a', 'b', 'c']}
        containerWidth={80}
        onState={(s) => states.push(s)}
      />
    );

    await waitFor(() => {
      expect(states.at(-1)?.isReady).toBe(true);
    });

    const last = states.at(-1)!;
    expect(last.hiddenCount).toBe(last.hiddenItems.length);
  });

  test('does not flicker isReady when parent re-renders with new array refs but same length', async () => {
    // Regression: parents that build the items array inline (`.map(...)` on
    // every render) used to trigger a full reset + setReady(false), causing
    // the wrapper to flicker visibility:hidden on every re-render. Same-
    // length item changes should keep the current partition + ready state.
    const states: Array<{
      visibleItems: ReadonlyArray<{ id: string }>;
      hiddenItems: ReadonlyArray<{ id: string }>;
      hiddenCount: number;
      isReady: boolean;
    }> = [];

    function ObjectHarness({
      items,
      containerWidth
    }: {
      items: ReadonlyArray<{ id: string }>;
      containerWidth: number;
    }) {
      const overflow = useOverflow({ items });

      useEffect(() => {
        states.push({
          visibleItems: overflow.visibleItems,
          hiddenItems: overflow.hiddenItems,
          hiddenCount: overflow.hiddenCount,
          isReady: overflow.isReady
        });
      });

      return (
        <div
          ref={(node) => {
            if (!node) return;
            overflow.containerRef.current = node;
            Object.defineProperty(node, 'getBoundingClientRect', {
              value: () => ({
                width: containerWidth,
                height: 32,
                top: 0,
                left: 0,
                right: containerWidth,
                bottom: 32,
                x: 0,
                y: 0,
                toJSON() {
                  return this;
                }
              }),
              configurable: true
            });
          }}
        >
          {overflow.visibleItems.map((item) => (
            <span key={item.id} style={{ width: ITEM_WIDTH }}>
              {item.id}
            </span>
          ))}
          <div
            ref={(node) => {
              if (!node) return;
              overflow.spacerRef.current = node;
              const usedWidth: number = overflow.visibleItems.length * ITEM_WIDTH;
              const remaining: number = Math.max(0, containerWidth - usedWidth);
              Object.defineProperty(node, 'getBoundingClientRect', {
                value: () => ({
                  width: remaining,
                  height: 32,
                  top: 0,
                  left: 0,
                  right: remaining,
                  bottom: 32,
                  x: 0,
                  y: 0,
                  toJSON() {
                    return this;
                  }
                }),
                configurable: true
              });
            }}
          />
        </div>
      );
    }

    // Initial render with 3 items, container fits 2 → 1 must hide.
    const { rerender } = render(
      <ObjectHarness
        items={[{ id: 'a' }, { id: 'b' }, { id: 'c' }]}
        containerWidth={80}
      />
    );

    await waitFor(() => {
      const last = states.at(-1)!;
      expect(last.isReady).toBe(true);
      expect(last.hiddenCount).toBeGreaterThan(0);
    });

    const visibleAfterSettle: number = states.at(-1)!.visibleItems.length;
    const hiddenAfterSettle: number = states.at(-1)!.hiddenItems.length;

    states.length = 0;

    // Re-render with NEW object refs at the same indices, same length.
    // This simulates a parent component that rebuilds the items array on
    // every render (e.g. mapping over children to build descriptors).
    await act(async () => {
      rerender(
        <ObjectHarness
          items={[{ id: 'a' }, { id: 'b' }, { id: 'c' }]}
          containerWidth={80}
        />
      );
    });

    // After the same-length re-render: isReady must NOT flip to false
    // (no flicker), and the partition counts must be preserved.
    for (const state of states) {
      expect(state.isReady).toBe(true);
    }

    const last = states.at(-1)!;
    expect(last.visibleItems.length).toBe(visibleAfterSettle);
    expect(last.hiddenItems.length).toBe(hiddenAfterSettle);
    // The visible/hidden arrays should reference the NEW objects.
    expect(last.visibleItems[0]?.id).toBe('a');
  });

  test('marks isReady true after the first partition pass', async () => {
    const states: Array<{
      visibleItems: ReadonlyArray<string>;
      hiddenItems: ReadonlyArray<string>;
      hiddenCount: number;
      isReady: boolean;
    }> = [];

    render(<Harness items={['a']} containerWidth={500} onState={(s) => states.push(s)} />);

    expect(states[0]?.isReady).toBe(false);

    await waitFor(() => {
      expect(states.at(-1)?.isReady).toBe(true);
    });
  });
});
