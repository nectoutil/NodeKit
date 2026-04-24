/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createRef } from 'react';
import { act } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { VisuallyHidden } from '../src';

// Only the styles whose inline values stay stable across browsers.
// CSS shorthand longhand normalization (border/margin/padding) varies by engine,
// so we check the semantically critical visually-hidden contract instead.
const HIDDEN_STYLE = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
};

describe('VisuallyHidden', () => {
  describe('default rendering', () => {
    it('renders as a div by default', () => {
      const { container } = render(<VisuallyHidden>x</VisuallyHidden>);
      expect(container.firstChild?.nodeName).toBe('DIV');
    });

    it('renders children', () => {
      render(<VisuallyHidden>hidden text</VisuallyHidden>);
      expect(screen.getByText('hidden text')).toBeInTheDocument();
    });

    it('has the correct displayName', () => {
      expect(VisuallyHidden.displayName).toBe('VisuallyHidden');
    });
  });

  describe('hidden styles', () => {
    it('applies visually-hidden styles by default', () => {
      const { container } = render(<VisuallyHidden>x</VisuallyHidden>);
      expect(container.firstChild).toHaveStyle(HIDDEN_STYLE);
    });

    it('merges user styles on top of hidden styles', () => {
      const { container } = render(
        <VisuallyHidden style={{ color: 'red' }}>x</VisuallyHidden>
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.color).toBe('red');
      expect(el).toHaveStyle({ position: 'absolute' });
    });

    it('passes arbitrary props through', () => {
      render(<VisuallyHidden data-testid="vh">x</VisuallyHidden>);
      expect(screen.getByTestId('vh')).toBeInTheDocument();
    });
  });

  describe('isFocusable prop', () => {
    it('keeps hidden styles when isFocusable is false and element is focused', async () => {
      const { container } = render(
        <VisuallyHidden isFocusable={false} tabIndex={0}>x</VisuallyHidden>
      );
      const el = container.firstChild as HTMLElement;
      await act(async () => { el.focus(); });
      expect(el).toHaveStyle({ position: 'absolute' });
    });

    it('removes hidden styles when isFocusable is true and element is focused', async () => {
      const { container } = render(
        <VisuallyHidden isFocusable tabIndex={0}>x</VisuallyHidden>
      );
      const el = container.firstChild as HTMLElement;
      await act(async () => { el.focus(); });
      expect(el.style.position).toBe('');
    });

    it('restores hidden styles when focus leaves', async () => {
      const { container } = render(
        <VisuallyHidden isFocusable tabIndex={0}>x</VisuallyHidden>
      );
      const el = container.firstChild as HTMLElement;
      await act(async () => { el.focus(); });
      await act(async () => { el.blur(); });
      expect(el).toHaveStyle({ position: 'absolute' });
    });

    it('preserves user styles when focused', async () => {
      const { container } = render(
        <VisuallyHidden isFocusable tabIndex={0} style={{ color: 'blue' }}>x</VisuallyHidden>
      );
      const el = container.firstChild as HTMLElement;
      await act(async () => { el.focus(); });
      expect(el.style.color).toBe('blue');
      expect(el.style.position).toBe('');
    });
  });

  describe('as prop', () => {
    it('renders as the specified element', () => {
      const { container } = render(<VisuallyHidden as="span">x</VisuallyHidden>);
      expect(container.firstChild?.nodeName).toBe('SPAN');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to the root element', () => {
      const ref = createRef<HTMLElement>();
      render(<VisuallyHidden ref={ref}>x</VisuallyHidden>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });

  describe('VisuallyHidden.Root', () => {
    it('renders children', () => {
      render(<VisuallyHidden.Root>root content</VisuallyHidden.Root>);
      expect(screen.getByText('root content')).toBeInTheDocument();
    });

    it('applies the same hidden styles', () => {
      const { container } = render(<VisuallyHidden.Root>x</VisuallyHidden.Root>);
      expect(container.firstChild).toHaveStyle(HIDDEN_STYLE);
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLElement>();
      render(<VisuallyHidden.Root ref={ref}>x</VisuallyHidden.Root>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });
});
