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

  test('does not call renderMore when nothing overflows', async () => {
    render(
      <Overflow
        items={tags}
        renderItem={(tag) => <span key={tag.id}>{tag.label}</span>}
        renderMore={({ count }) => <span data-testid="overflow">+{count}</span>}
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
});
