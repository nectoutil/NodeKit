/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Primitive } from '../src/Primitive/Primitive';

describe('Primitive', () => {
  describe('default rendering', () => {
    it('renders as a div by default', () => {
      const { container } = render(<Primitive>content</Primitive>);
      expect(container.firstChild?.nodeName).toBe('DIV');
    });

    it('renders children', () => {
      render(<Primitive>Test Content</Primitive>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('passes className through', () => {
      const { container } = render(<Primitive className="foo">x</Primitive>);
      expect(container.firstChild).toHaveClass('foo');
    });

    it('passes arbitrary props through', () => {
      render(<Primitive data-testid="prim" aria-label="test">x</Primitive>);
      expect(screen.getByTestId('prim')).toHaveAttribute('aria-label', 'test');
    });

    it('has the correct displayName', () => {
      expect(Primitive.displayName).toBe('Primitive');
    });
  });

  describe('as prop', () => {
    it('renders as the specified HTML tag', () => {
      const { container } = render(<Primitive as="section">x</Primitive>);
      expect(container.firstChild?.nodeName).toBe('SECTION');
    });

    it('renders as a button with correct attributes', () => {
      render(<Primitive as="button" type="submit">Submit</Primitive>);
      const el = screen.getByText('Submit');
      expect(el.tagName).toBe('BUTTON');
      expect(el).toHaveAttribute('type', 'submit');
    });

    it('renders as an anchor with href', () => {
      render(<Primitive as="a" href="/test">Link</Primitive>);
      const el = screen.getByText('Link');
      expect(el.tagName).toBe('A');
      expect(el).toHaveAttribute('href', '/test');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to the default div element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Primitive ref={ref}>x</Primitive>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards ref when using the as prop', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Primitive as="button" ref={ref}>x</Primitive>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('asChild', () => {
    it('renders the child element with no extra div wrapper', () => {
      const { container } = render(
        <Primitive asChild>
          <span>content</span>
        </Primitive>
      );
      expect(container.firstChild?.nodeName).toBe('SPAN');
      expect(container.querySelector('div')).toBeNull();
    });

    it('merges props onto the child element', () => {
      render(
        <Primitive asChild data-testid="cloned">
          <span>child</span>
        </Primitive>
      );
      expect(screen.getByTestId('cloned').tagName).toBe('SPAN');
    });

    it('throws when given more than one child', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() =>
        render(
          <Primitive asChild>
            <span>a</span>
            <span>b</span>
          </Primitive>
        )
      ).toThrow();
      spy.mockRestore();
    });

    it('uses the forwarded ref when child has no ref', () => {
      const ref = createRef<HTMLSpanElement>();
      render(
        <Primitive asChild ref={ref}>
          <span>x</span>
        </Primitive>
      );
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it('preserves the child existing ref', () => {
      const childRef = createRef<HTMLSpanElement>();
      render(
        <Primitive asChild>
          <span ref={childRef}>x</span>
        </Primitive>
      );
      expect(childRef.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe('tag components via Proxy', () => {
    it('Primitive.div renders a div', () => {
      render(<Primitive.div>content</Primitive.div>);
      expect(screen.getByText('content').tagName).toBe('DIV');
    });

    it('Primitive.Div renders a div via capitalized accessor', () => {
      render(<Primitive.Div>content</Primitive.Div>);
      expect(screen.getByText('content').tagName).toBe('DIV');
    });

    it('Primitive.button renders a button', () => {
      render(<Primitive.button type="button">click</Primitive.button>);
      expect(screen.getByText('click').tagName).toBe('BUTTON');
    });

    it('Primitive.span renders a span', () => {
      render(<Primitive.span>inline</Primitive.span>);
      expect(screen.getByText('inline').tagName).toBe('SPAN');
    });

    it('tag component passes props through', () => {
      render(<Primitive.div data-testid="tag-div" className="c">x</Primitive.div>);
      const el = screen.getByTestId('tag-div');
      expect(el).toHaveClass('c');
    });

    it('tag component forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Primitive.div ref={ref}>x</Primitive.div>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('returns the same component on repeated access', () => {
      expect(Primitive.div).toBe(Primitive.div);
    });
  });
});
