/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@necto-react/hooks', () => ({
  useScript: vi.fn(() => 'ready')
}));

import { Script } from '../src/Script';
import { useScript } from '@necto-react/hooks';

describe('Script', () => {
  it('renders the inline bootstrap with a Necto marker and nonce behavior', () => {
    const script = (theme: string): void => {
      document.documentElement.dataset.theme = theme;
    };
    const ref = createRef<HTMLScriptElement>();

    render(<Script ref={ref} script={script} scriptArgs={['dark']} nonce="server-nonce" />);

    const element = document.querySelector<HTMLScriptElement>('script[data-necto-script]');

    expect(element).not.toBeNull();
    expect(element?.dataset.nectoScript).toMatch(/^inline:/);
    expect(element?.textContent).toContain('["dark"]');
    expect(element?.nonce).toBe('');
    expect(ref.current).toBe(element);
    expect(useScript).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ inlineContent: expect.stringContaining('["dark"]') })
    );
  });

  it('escapes script-closing text in serialized arguments', () => {
    const script = (value: string): void => {
      document.documentElement.dataset.value = value;
    };

    render(<Script script={script} scriptArgs={['</script><img src=x>']} />);

    const element = document.querySelector<HTMLScriptElement>('script[data-necto-script]');

    expect(element?.textContent).toContain('\\u003c/script>\\u003cimg');
    expect(document.querySelector('img[src="x"]')).toBeNull();
  });
});
