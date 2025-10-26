/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Primitive } from '../src/Primitive/Primitive';

describe('Primitive', () => {
  it('should render as default div element', () => {
    const { container } = render(<Primitive>Test Content</Primitive>);
    expect(container.querySelector('div')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render as custom element via "as" prop', () => {
    const { container } = render(<Primitive as="button">Click Me</Primitive>);
    expect(container.querySelector('button')).toBeInTheDocument();
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should merge props with child element when asChild is true', () => {
    render(
      <Primitive asChild data-testid="merged">
        <button>Child Button</button>
      </Primitive>
    );
    const button = screen.getByTestId('merged');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
    expect(screen.getByText('Child Button')).toBeInTheDocument();
  });

  it('should pass through className and other props', () => {
    const { container } = render(
      <Primitive className="custom-class" data-testid="test">
        Content
      </Primitive>
    );
    const element = container.querySelector('.custom-class');
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('data-testid', 'test');
  });

  it('should render as anchor tag with href', () => {
    render(
      <Primitive as="a" href="/test">
        Link
      </Primitive>
    );
    const link = screen.getByText('Link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/test');
  });
});
