/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';

import { Portal } from '../src/Portal';
import { DEFAULT_PORTAL_ROOT_ID } from '../src/Portal/constants';

afterEach(() => {
  cleanup();
  document.getElementById(DEFAULT_PORTAL_ROOT_ID)?.remove();
});

describe('Portal', () => {
  it('has the correct display name', () => {
    expect(Portal.displayName).toBe('Portal');
  });

  it('renders its content in a supplied container', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    render(
      <Portal container={container}>
        <span data-testid="portal-content">content</span>
      </Portal>
    );

    expect(container.querySelector('[data-testid="portal-content"]')).toBeInTheDocument();

    container.remove();
  });

  it('creates and renders into the default portal root when no container is supplied', async () => {
    render(
      <Portal>
        <span data-testid="portal-content">content</span>
      </Portal>
    );

    await waitFor(() => {
      expect(document.getElementById(DEFAULT_PORTAL_ROOT_ID)).toBeInstanceOf(HTMLDivElement);
    });

    expect(document.getElementById(DEFAULT_PORTAL_ROOT_ID)).toContainElement(
      screen.getByTestId('portal-content')
    );
  });

  it('forwards its ref to the rendered primitive div', async () => {
    const ref = createRef<HTMLDivElement>();

    render(<Portal ref={ref}>content</Portal>);

    await waitFor(() => {
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
