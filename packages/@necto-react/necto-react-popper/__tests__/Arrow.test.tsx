/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Arrow } from '../src/components/Arrow';

describe('Arrow', () => {
  it('should have the correct displayName', () => {
    expect(Arrow.displayName).toBe('Arrow');
  });

  it('should render a default SVG arrow when no children are provided', () => {
    const { container } = render(<Arrow placement="top" />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('should render custom children instead of the default SVG', () => {
    const { container } = render(<Arrow placement="top"><span data-testid="custom" /></Arrow>);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeNull();
  });

  it('should call a render-prop child with the current placement', () => {
    render(
      <Arrow placement="bottom">
        {({ placement }) => <span data-testid="rp">{placement}</span>}
      </Arrow>
    );
    expect(screen.getByTestId('rp').textContent).toBe('bottom');
  });

  it('should set data-placement on the inner wrapper', () => {
    const { container } = render(<Arrow placement="left" />);
    const wrapper = container.querySelector('[data-placement]');
    expect(wrapper?.getAttribute('data-placement')).toBe('left');
  });

  it('should position the span absolutely', () => {
    const { container } = render(<Arrow placement="top" />);
    const span = container.querySelector('span');
    expect(span?.style.position).toBe('absolute');
  });

  it('should apply arrowX as left style', () => {
    const { container } = render(<Arrow placement="top" arrowX={42} />);
    const span = container.querySelector('span');
    expect(span?.style.left).toBe('42px');
  });

  it('should apply arrowY as top style', () => {
    const { container } = render(<Arrow placement="top" arrowY={20} />);
    const span = container.querySelector('span');
    expect(span?.style.top).toBe('20px');
  });
});
