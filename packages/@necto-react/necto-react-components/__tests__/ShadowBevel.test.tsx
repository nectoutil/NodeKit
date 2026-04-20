/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ShadowBevel } from '../src';

function cssVars(container: HTMLElement) {
  const el = container.firstChild as HTMLElement;
  return {
    content: el.style.getPropertyValue('--necto-shadow-bevel-content'),
    zIndex: el.style.getPropertyValue('--necto-shadow-bevel-z-index'),
    boxShadow: el.style.getPropertyValue('--necto-shadow-bevel-box-shadow'),
    borderRadius: el.style.getPropertyValue('--necto-shadow-bevel-border-radius'),
  };
}

describe('ShadowBevel', () => {
  describe('default rendering', () => {
    it('renders as a div by default', () => {
      const { container } = render(<ShadowBevel>x</ShadowBevel>);
      expect(container.firstChild?.nodeName).toBe('DIV');
    });

    it('renders children', () => {
      render(<ShadowBevel>hello</ShadowBevel>);
      expect(screen.getByText('hello')).toBeInTheDocument();
    });

    it('applies the necto class name', () => {
      const { container } = render(<ShadowBevel>x</ShadowBevel>);
      expect((container.firstChild as HTMLElement).className).toContain('_necto:ShadowBevel');
    });

    it('merges user className with necto class', () => {
      const { container } = render(<ShadowBevel className="my-class">x</ShadowBevel>);
      const el = container.firstChild as HTMLElement;
      expect(el.className).toContain('my-class');
      expect(el.className).toContain('_necto:ShadowBevel');
    });

    it('has the correct displayName', () => {
      expect(ShadowBevel.displayName).toBe('ShadowBevel');
    });
  });

  describe('bevel prop', () => {
    it('sets content to \'"\"\' when bevel is true (default)', () => {
      const { container } = render(<ShadowBevel>x</ShadowBevel>);
      expect(cssVars(container).content).toBe('""');
    });

    it('sets content to none when bevel is false', () => {
      const { container } = render(<ShadowBevel bevel={false}>x</ShadowBevel>);
      expect(cssVars(container).content).toBe('none');
    });
  });

  describe('boxShadow prop', () => {
    it('defaults to none when not provided', () => {
      const { container } = render(<ShadowBevel>x</ShadowBevel>);
      expect(cssVars(container).boxShadow).toBe('none');
    });

    it('uses var(--necto-shadow-n) when boxShadow is a number', () => {
      const { container } = render(<ShadowBevel boxShadow={2}>x</ShadowBevel>);
      expect(cssVars(container).boxShadow).toBe('var(--necto-shadow-2)');
    });

    it('uses the string verbatim when boxShadow is a string', () => {
      const { container } = render(<ShadowBevel boxShadow="0 2px 4px red">x</ShadowBevel>);
      expect(cssVars(container).boxShadow).toBe('0 2px 4px red');
    });

    it('falls back to none when boxShadow is an empty string', () => {
      const { container } = render(<ShadowBevel boxShadow="">x</ShadowBevel>);
      expect(cssVars(container).boxShadow).toBe('none');
    });
  });

  describe('borderRadius prop', () => {
    it('defaults to 0 when not provided', () => {
      const { container } = render(<ShadowBevel>x</ShadowBevel>);
      expect(cssVars(container).borderRadius).toBe('0');
    });

    it('appends px when borderRadius is a number', () => {
      const { container } = render(<ShadowBevel borderRadius={8}>x</ShadowBevel>);
      expect(cssVars(container).borderRadius).toBe('8px');
    });

    it('uses the string verbatim when borderRadius is a string', () => {
      const { container } = render(<ShadowBevel borderRadius="50%">x</ShadowBevel>);
      expect(cssVars(container).borderRadius).toBe('50%');
    });

    it('falls back to 0 when borderRadius is an empty string', () => {
      const { container } = render(<ShadowBevel borderRadius="">x</ShadowBevel>);
      expect(cssVars(container).borderRadius).toBe('0');
    });
  });

  describe('zIndex prop', () => {
    it('defaults to 0', () => {
      const { container } = render(<ShadowBevel>x</ShadowBevel>);
      expect(cssVars(container).zIndex).toBe('0');
    });

    it('applies the provided zIndex value', () => {
      const { container } = render(<ShadowBevel zIndex={5}>x</ShadowBevel>);
      expect(cssVars(container).zIndex).toBe('5');
    });
  });

  describe('style prop', () => {
    it('merges user styles with CSS variables', () => {
      const { container } = render(
        <ShadowBevel style={{ color: 'red' }}>x</ShadowBevel>
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.color).toBe('red');
      expect(cssVars(container).content).toBe('""');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to the root element', () => {
      const ref = createRef<HTMLElement>();
      render(<ShadowBevel ref={ref}>x</ShadowBevel>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });

  describe('as prop', () => {
    it('renders as the specified element', () => {
      const { container } = render(<ShadowBevel as="section">x</ShadowBevel>);
      expect(container.firstChild?.nodeName).toBe('SECTION');
    });
  });

  describe('static styles', () => {
    it('has overflow clip', () => {
      const { container } = render(<ShadowBevel>x</ShadowBevel>);
      expect(container.firstChild).toHaveStyleRule('overflow', 'clip');
    });

    it('has position relative', () => {
      const { container } = render(<ShadowBevel>x</ShadowBevel>);
      expect(container.firstChild).toHaveStyleRule('position', 'relative');
    });

    it('has z-index 0', () => {
      const { container } = render(<ShadowBevel>x</ShadowBevel>);
      expect(container.firstChild).toHaveStyleRule('z-index', '0');
    });

    it('references box-shadow via CSS var', () => {
      const { container } = render(<ShadowBevel>x</ShadowBevel>);
      expect(container.firstChild).toHaveStyleRule('box-shadow', 'var(--necto-shadow-bevel-box-shadow)');
    });

    it('references border-radius via CSS var', () => {
      const { container } = render(<ShadowBevel>x</ShadowBevel>);
      expect(container.firstChild).toHaveStyleRule('border-radius', 'var(--necto-shadow-bevel-border-radius)');
    });

    it('::before has position absolute', () => {
      const { container } = render(<ShadowBevel>x</ShadowBevel>);
      expect(container.firstChild).toHaveStyleRule('position', 'absolute', { target: '::before' });
    });

    it('::before has pointer-events none', () => {
      const { container } = render(<ShadowBevel>x</ShadowBevel>);
      expect(container.firstChild).toHaveStyleRule('pointer-events', 'none', { target: '::before' });
    });

    it('::before has mix-blend-mode luminosity', () => {
      const { container } = render(<ShadowBevel>x</ShadowBevel>);
      expect(container.firstChild).toHaveStyleRule('mix-blend-mode', 'luminosity', { target: '::before' });
    });

    it('::before has border-radius inherit', () => {
      const { container } = render(<ShadowBevel>x</ShadowBevel>);
      expect(container.firstChild).toHaveStyleRule('border-radius', 'inherit', { target: '::before' });
    });
  });

  describe('ShadowBevel.Root', () => {
    it('renders children', () => {
      render(<ShadowBevel.Root>root content</ShadowBevel.Root>);
      expect(screen.getByText('root content')).toBeInTheDocument();
    });

    it('applies CSS variables the same as ShadowBevel', () => {
      const { container } = render(
        <ShadowBevel.Root bevel={false} borderRadius={4} boxShadow={1}>x</ShadowBevel.Root>
      );
      const vars = cssVars(container);
      expect(vars.content).toBe('none');
      expect(vars.borderRadius).toBe('4px');
      expect(vars.boxShadow).toBe('var(--necto-shadow-1)');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLElement>();
      render(<ShadowBevel.Root ref={ref}>x</ShadowBevel.Root>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });
});
