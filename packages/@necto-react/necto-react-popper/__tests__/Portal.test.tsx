/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Portal } from '../src/components/Portal';

describe('Portal', () => {
  it('should have the correct displayName', () => {
    expect(Portal.displayName).toBe('Portal');
  });

  it('should render children into the document body via a portal', async () => {
    render(<Portal><div data-testid="portal-child">hello</div></Portal>);
    expect(await screen.findByTestId('portal-child')).toBeInTheDocument();
  });

  it('should not render children inline at the component mount point', async () => {
    const { container } = render(
      <div id="mount">
        <Portal><span data-testid="child" /></Portal>
      </div>
    );
    await screen.findByTestId('child');
    expect(container.querySelector('#mount span')).toBeNull();
  });

  it('should create a portal container with a custom id', async () => {
    render(<Portal id="my-portal"><span /></Portal>);
    await screen.findByText('', { selector: '#my-portal' }).catch(() => {});
    expect(document.getElementById('my-portal')).not.toBeNull();
  });

  it('should render into a custom root element', async () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    render(<Portal root={root}><span data-testid="custom-root-child" /></Portal>);
    await screen.findByTestId('custom-root-child');
    expect(root.querySelector('[data-testid="custom-root-child"]')).not.toBeNull();
    document.body.removeChild(root);
  });
});
