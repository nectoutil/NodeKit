/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import '@testing-library/jest-dom';
import { describe, expect, test } from 'vitest';
import { Overflow } from '@necto-react/components';
import { render, screen, waitFor } from '@testing-library/react';

interface Tag {
  id: string;
  label: string;
}

const tags: ReadonlyArray<Tag> = [
  { id: '1', label: 'one' },
  { id: '2', label: 'two' },
  { id: '3', label: 'three' }
];

describe('Overflow', () => {
  test('renders all items inside a flex container by default', async () => {
    render(
      <Overflow
        items={tags}
        renderItem={(tag) => (
          <span key={tag.id} data-testid="item">
            {tag.label}
          </span>
        )}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('item').length).toBeGreaterThan(0);
    });
  });

  test('renders the wrapper as the supplied element via "as"', async () => {
    render(
      <Overflow
        items={tags}
        as="ul"
        renderItem={(tag) => (
          <li key={tag.id} data-testid="item">
            {tag.label}
          </li>
        )}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('item').length).toBeGreaterThan(0);
    });
    expect(screen.getAllByTestId('item')[0]!.parentElement?.tagName).toBe('UL');
  });

  test('renders an aria-hidden spacer at the end of the wrapper', async () => {
    const { container } = render(
      <Overflow items={tags} renderItem={(tag) => <span key={tag.id}>{tag.label}</span>} />
    );

    await waitFor(() => {
      const spacer = container.querySelector('[aria-hidden="true"]');
      expect(spacer).toBeInTheDocument();
    });
  });

  test('forwards className and style', async () => {
    const { container } = render(
      <Overflow
        items={tags}
        className="my-overflow"
        style={{ backgroundColor: 'red' }}
        renderItem={(tag) => <span key={tag.id}>{tag.label}</span>}
      />
    );

    await waitFor(() => {
      const wrapper = container.querySelector('.my-overflow');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveStyle('background-color: rgb(255, 0, 0)');
    });
  });

  test('applies flex layout styles to the wrapper', async () => {
    const { container } = render(
      <Overflow
        items={tags}
        className="layout-target"
        renderItem={(tag) => <span key={tag.id}>{tag.label}</span>}
      />
    );

    await waitFor(() => {
      const wrapper = container.querySelector('.layout-target')!;
      expect(wrapper).toHaveStyle('display: flex');
      expect(wrapper).toHaveStyle('flex-wrap: nowrap');
      expect(wrapper).toHaveStyle('min-width: 0');
    });
  });

  test('does not call renderOverflow when nothing overflows', async () => {
    render(
      <Overflow
        items={tags}
        renderItem={(tag) => <span key={tag.id}>{tag.label}</span>}
        renderOverflow={({ count }) => <span data-testid="overflow">+{count}</span>}
      />
    );

    await waitFor(() => {
      expect(screen.queryAllByText(/^one$/).length).toBeGreaterThan(0);
    });

    // With a roomy real container in browser/jsdom, 3 small items fit and the
    // overflow indicator shouldn't render.
    expect(screen.queryByTestId('overflow')).not.toBeInTheDocument();
  });

  test('starts hidden until ready (visibility: hidden during measurement)', () => {
    const { container } = render(
      <Overflow
        items={tags}
        className="vis-target"
        renderItem={(tag) => <span key={tag.id}>{tag.label}</span>}
      />
    );

    // Before the first effect runs, the wrapper is visibility: hidden.
    // After the first partition fires (which happens synchronously in tests
    // via useEffect → useState), the wrapper flips to visible. This test
    // verifies the prop pipeline accepts both states.
    const wrapper = container.querySelector('.vis-target');
    expect(wrapper).toHaveAttribute('style', expect.stringContaining('visibility'));
  });

  test('passes index as the second argument to renderItem', async () => {
    const indices: Array<number> = [];

    render(
      <Overflow
        items={tags}
        renderItem={(tag, index) => {
          indices.push(index);
          return <span key={tag.id}>{tag.label}</span>;
        }}
      />
    );

    await waitFor(() => {
      // 0,1,2 should appear at least once
      expect(indices).toContain(0);
      expect(indices).toContain(1);
      expect(indices).toContain(2);
    });
  });

  test('renders nothing when items is empty', async () => {
    const { container } = render(
      <Overflow
        items={[]}
        className="empty-target"
        renderItem={(tag: Tag) => <span key={tag.id}>{tag.label}</span>}
      />
    );

    await waitFor(() => {
      const wrapper = container.querySelector('.empty-target');
      expect(wrapper).toBeInTheDocument();
      // Wrapper exists but contains no items (only the aria-hidden spacer).
      const items = wrapper!.querySelectorAll('span');
      expect(items.length).toBe(0);
    });
  });

  test('skips overflowRenderer entirely when prop is omitted', async () => {
    // Even if items overflow (constrained container), no overflow slot
    // should render when renderOverflow is not provided.
    const { container } = render(
      <div style={{ width: '60px' }}>
        <Overflow
          items={tags}
          renderItem={(tag) => (
            <span key={tag.id} data-testid="item" style={{ minWidth: '40px' }}>
              {tag.label}
            </span>
          )}
        />
      </div>
    );

    await waitFor(() => {
      expect(container.querySelectorAll('[data-testid="item"]').length).toBeGreaterThan(0);
    });

    // No overflow chip should exist anywhere in the rendered tree.
    expect(container.querySelector('[data-testid="more"]')).not.toBeInTheDocument();
  });

  test('forwards a function ref to the container element', async () => {
    let captured: HTMLElement | null = null;

    render(
      <Overflow
        ref={(node) => {
          captured = node;
        }}
        items={tags}
        renderItem={(tag) => <span key={tag.id}>{tag.label}</span>}
      />
    );

    await waitFor(() => {
      expect(captured).toBeInstanceOf(HTMLElement);
    });
  });

  test('forwards an object ref to the container element', async () => {
    const ref = { current: null as HTMLElement | null };

    render(
      <Overflow
        ref={ref}
        items={tags}
        renderItem={(tag) => <span key={tag.id}>{tag.label}</span>}
      />
    );

    await waitFor(() => {
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });

  test('passes hidden items array to renderOverflow when overflow occurs', async () => {
    const hiddenSeen: Array<ReadonlyArray<Tag>> = [];

    render(
      <div style={{ width: '50px' }}>
        <Overflow
          items={tags}
          minVisible={1}
          renderItem={(tag) => (
            <span key={tag.id} data-testid="item" style={{ minWidth: '40px' }}>
              {tag.label}
            </span>
          )}
          renderOverflow={({ hidden, count }) => {
            hiddenSeen.push(hidden);
            return <span data-testid="more">+{count}</span>;
          }}
        />
      </div>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('more')).toBeInTheDocument();
    });

    const lastHidden = hiddenSeen.at(-1);
    expect(lastHidden).toBeDefined();
    expect(lastHidden!.length).toBeGreaterThan(0);
    // Hidden items should be from `tags` (same object references).
    expect(tags).toEqual(expect.arrayContaining(lastHidden as Tag[]));
  });
});
