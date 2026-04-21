/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Box } from '../src';

function getEl(container: HTMLElement): HTMLElement {
  return container.firstChild as HTMLElement;
}

function cssVar(el: HTMLElement, name: string): string {
  return el.style.getPropertyValue(name);
}

describe('Box', () => {
  describe('default rendering', () => {
    it('renders as a div by default', () => {
      const { container } = render(<Box>x</Box>);
      expect(getEl(container).nodeName).toBe('DIV');
    });

    it('renders children', () => {
      render(<Box>hello box</Box>);
      expect(screen.getByText('hello box')).toBeInTheDocument();
    });

    it('applies the necto class name', () => {
      const { container } = render(<Box>x</Box>);
      expect(getEl(container).className).toContain('_necto:Box');
    });

    it('merges user className with necto class', () => {
      const { container } = render(<Box className="my-class">x</Box>);
      const el = getEl(container);
      expect(el.className).toContain('my-class');
      expect(el.className).toContain('_necto:Box');
    });

    it('forwards ref to the underlying element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Box ref={ref}>x</Box>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('renders as a different element via the `as` prop', () => {
      const { container } = render(<Box as="section">x</Box>);
      expect(getEl(container).nodeName).toBe('SECTION');
    });

    it('exposes a `Root` property for compound usage', () => {
      expect(Box.Root).toBeDefined();
    });

    it('forwards arbitrary HTML attributes via rest spread', () => {
      const { container } = render(
        <Box data-testid="foo" id="bar">
          x
        </Box>
      );
      const el = getEl(container);
      expect(el.getAttribute('data-testid')).toBe('foo');
      expect(el.id).toBe('bar');
    });
  });

  describe('color & background', () => {
    it('sets backgroundColor when background is provided', () => {
      const { container } = render(<Box background="red">x</Box>);
      expect(getEl(container).style.backgroundColor).toBe('red');
    });

    it('sets color when color is provided', () => {
      const { container } = render(<Box color="blue">x</Box>);
      expect(getEl(container).style.color).toBe('blue');
    });

    it('sets boxShadow when shadow is provided', () => {
      const { container } = render(<Box shadow="0 0 5px #000">x</Box>);
      expect(getEl(container).style.boxShadow).toBe('0 0 5px #000');
    });

    it('does not set background when omitted', () => {
      const { container } = render(<Box>x</Box>);
      expect(getEl(container).style.backgroundColor).toBe('');
    });
  });

  describe('border style resolution', () => {
    it('uses the explicit borderStyle when provided', () => {
      const { container } = render(<Box borderStyle="dashed">x</Box>);
      expect(getEl(container).style.borderStyle).toBe('dashed');
    });

    it('defaults to solid when borderColor is provided without borderStyle', () => {
      const { container } = render(<Box borderColor="red">x</Box>);
      const el = getEl(container);
      expect(el.style.borderStyle).toBe('solid');
      expect(el.style.borderColor).toBe('red');
    });

    it('defaults to solid when borderWidth is provided without borderStyle', () => {
      const { container } = render(<Box borderWidth="2px">x</Box>);
      expect(getEl(container).style.borderStyle).toBe('solid');
    });

    it.each([
      ['borderBlockStartWidth'],
      ['borderBlockEndWidth'],
      ['borderInlineStartWidth'],
      ['borderInlineEndWidth']
    ] as const)(
      'defaults to solid when only %s is provided',
      (prop) => {
        const { container } = render(<Box {...{ [prop]: '2px' }}>x</Box>);
        expect(getEl(container).style.borderStyle).toBe('solid');
      }
    );

    it('does not set borderStyle when no border-related prop is provided', () => {
      const { container } = render(<Box>x</Box>);
      expect(getEl(container).style.borderStyle).toBe('');
    });
  });

  describe('outline style resolution', () => {
    it('uses the explicit outlineStyle when provided', () => {
      const { container } = render(<Box outlineStyle="dashed">x</Box>);
      expect(getEl(container).style.outlineStyle).toBe('dashed');
    });

    it('defaults to solid when outlineColor is provided without outlineStyle', () => {
      const { container } = render(<Box outlineColor="red">x</Box>);
      const el = getEl(container);
      expect(el.style.outlineStyle).toBe('solid');
      expect(el.style.outlineColor).toBe('red');
    });

    it('defaults to solid when outlineWidth is provided without outlineStyle', () => {
      const { container } = render(<Box outlineWidth="2px">x</Box>);
      const el = getEl(container);
      expect(el.style.outlineStyle).toBe('solid');
      expect(el.style.outlineWidth).toBe('2px');
    });

    it('does not set outlineStyle when no outline-related prop is provided', () => {
      const { container } = render(<Box>x</Box>);
      expect(getEl(container).style.outlineStyle).toBe('');
    });
  });

  describe('border width CSS custom properties', () => {
    it('sets --necto-box-border-width', () => {
      const { container } = render(<Box borderWidth="3px">x</Box>);
      expect(cssVar(getEl(container), '--necto-box-border-width')).toBe('3px');
    });

    it.each([
      ['borderBlockStartWidth', '--necto-box-border-block-start-width'],
      ['borderBlockEndWidth', '--necto-box-border-block-end-width'],
      ['borderInlineStartWidth', '--necto-box-border-inline-start-width'],
      ['borderInlineEndWidth', '--necto-box-border-inline-end-width']
    ] as const)('sets %s → %s', (prop, cssName) => {
      const { container } = render(<Box {...{ [prop]: '4px' }}>x</Box>);
      expect(cssVar(getEl(container), cssName)).toBe('4px');
    });
  });

  describe('border radius CSS custom properties', () => {
    it('sets --necto-box-border-radius', () => {
      const { container } = render(<Box borderRadius="8px">x</Box>);
      expect(cssVar(getEl(container), '--necto-box-border-radius')).toBe('8px');
    });

    it.each([
      ['borderEndStartRadius', '--necto-box-border-end-start-radius'],
      ['borderEndEndRadius', '--necto-box-border-end-end-radius'],
      ['borderStartStartRadius', '--necto-box-border-start-start-radius'],
      ['borderStartEndRadius', '--necto-box-border-start-end-radius']
    ] as const)('sets %s → %s', (prop, cssName) => {
      const { container } = render(<Box {...{ [prop]: '12px' }}>x</Box>);
      expect(cssVar(getEl(container), cssName)).toBe('12px');
    });
  });

  describe('sizing CSS custom properties', () => {
    it.each([
      ['minHeight', '--necto-box-min-height', '100px'],
      ['minWidth', '--necto-box-min-width', '200px'],
      ['maxWidth', '--necto-box-max-width', '300px'],
      ['width', '--necto-box-width', '400px'],
      ['overflowX', '--necto-box-overflow-x', 'hidden'],
      ['overflowY', '--necto-box-overflow-y', 'scroll'],
      ['opacity', '--necto-box-opacity', '0.5'],
      ['zIndex', '--necto-box-z-index', '10']
    ] as const)('sets %s → %s', (prop, cssName, value) => {
      const { container } = render(<Box {...{ [prop]: value }}>x</Box>);
      expect(cssVar(getEl(container), cssName)).toBe(value);
    });
  });

  describe('padding resolution', () => {
    it('applies `padding` to all four sides as px', () => {
      const { container } = render(<Box padding={10}>x</Box>);
      const el = getEl(container);
      expect(cssVar(el, '--necto-box-padding-block-start')).toBe('10px');
      expect(cssVar(el, '--necto-box-padding-block-end')).toBe('10px');
      expect(cssVar(el, '--necto-box-padding-inline-start')).toBe('10px');
      expect(cssVar(el, '--necto-box-padding-inline-end')).toBe('10px');
    });

    it('overrides block sides with `paddingBlock`', () => {
      const { container } = render(
        <Box padding={10} paddingBlock={20}>
          x
        </Box>
      );
      const el = getEl(container);
      expect(cssVar(el, '--necto-box-padding-block-start')).toBe('20px');
      expect(cssVar(el, '--necto-box-padding-block-end')).toBe('20px');
      expect(cssVar(el, '--necto-box-padding-inline-start')).toBe('10px');
      expect(cssVar(el, '--necto-box-padding-inline-end')).toBe('10px');
    });

    it('overrides inline sides with `paddingInline`', () => {
      const { container } = render(
        <Box padding={10} paddingInline={30}>
          x
        </Box>
      );
      const el = getEl(container);
      expect(cssVar(el, '--necto-box-padding-inline-start')).toBe('30px');
      expect(cssVar(el, '--necto-box-padding-inline-end')).toBe('30px');
      expect(cssVar(el, '--necto-box-padding-block-start')).toBe('10px');
      expect(cssVar(el, '--necto-box-padding-block-end')).toBe('10px');
    });

    it('prefers per-side padding over paddingBlock/paddingInline/padding', () => {
      const { container } = render(
        <Box
          padding={10}
          paddingBlock={20}
          paddingBlockStart={40}
          paddingBlockEnd={50}
          paddingInline={30}
          paddingInlineStart={60}
          paddingInlineEnd={70}
        >
          x
        </Box>
      );
      const el = getEl(container);
      expect(cssVar(el, '--necto-box-padding-block-start')).toBe('40px');
      expect(cssVar(el, '--necto-box-padding-block-end')).toBe('50px');
      expect(cssVar(el, '--necto-box-padding-inline-start')).toBe('60px');
      expect(cssVar(el, '--necto-box-padding-inline-end')).toBe('70px');
    });

    it('leaves padding CSS vars empty when no padding props are provided', () => {
      const { container } = render(<Box>x</Box>);
      const el = getEl(container);
      expect(cssVar(el, '--necto-box-padding-block-start')).toBe('');
      expect(cssVar(el, '--necto-box-padding-block-end')).toBe('');
      expect(cssVar(el, '--necto-box-padding-inline-start')).toBe('');
      expect(cssVar(el, '--necto-box-padding-inline-end')).toBe('');
    });
  });
});
