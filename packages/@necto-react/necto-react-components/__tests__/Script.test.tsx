/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { act, createRef } from 'react';
import { render } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Script } from '../src/Script';

describe('Script', () => {
  it('executes a method callback on a client mount and forwards the executable element', () => {
    const counter = {
      run(value: string): void {
        const root = document.documentElement;
        root.dataset.scriptResult = (root.dataset.scriptResult ?? '') + value;
      }
    };
    const ref = createRef<HTMLScriptElement>();

    const view = render(
      <Script
        id="client-bootstrap"
        ref={ref}
        script={counter.run}
        scriptArgs={['dark']}
        nonce="test"
      />
    );

    const matching = document.querySelectorAll(
      'script[data-necto-script="inline:client-bootstrap"]'
    );
    expect(matching).toHaveLength(1);
    expect(document.documentElement.dataset.scriptResult).toBe('dark');
    expect(matching[0].getAttribute('data-necto-script-status')).toBe('ready');
    expect(ref.current).toBe(matching[0]);
    expect(ref.current?.nonce).toBe('test');

    view.unmount();
    expect(ref.current).toBeNull();
    matching[0].remove();
    delete document.documentElement.dataset.scriptResult;
  });

  it('escapes script sequences in SSR, preserves following markup and adopts on hydration', async () => {
    const script = (value: string): void => {
      const root = document.documentElement;
      root.dataset.scriptResult = (root.dataset.scriptResult ?? '') + '<!--<ScRiPt>' + value;
    };
    const ref = createRef<HTMLScriptElement>();
    const element = (
      <>
        <Script
          id="server-bootstrap"
          ref={ref}
          script={script}
          scriptArgs={['</script><img src=x>']}
          nonce="test"
        />
        <span id="after-script">After</span>
      </>
    );
    const frame = document.createElement('iframe');
    const loaded = new Promise<void>((resolve) =>
      frame.addEventListener('load', () => resolve(), { once: true })
    );
    frame.srcdoc = `<main>${renderToString(element)}</main>`;
    document.body.append(frame);
    try {
      await loaded;
      const frameDocument = frame.contentDocument!;
      const original = frameDocument.getElementById('server-bootstrap') as HTMLScriptElement;
      expect(frameDocument.getElementById('after-script')).not.toBeNull();
      expect(frameDocument.querySelector('img')).toBeNull();
      expect(original.nonce).toBe('test');
      expect(original.textContent).toContain('\\u003c/script>\\u003cimg');
      expect(frameDocument.documentElement.dataset.scriptResult).toBe(
        '<!--<ScRiPt></script><img src=x>'
      );

      const root = hydrateRoot(
        frameDocument.querySelector('main')!,
        <>
          <Script
            id="server-bootstrap"
            ref={ref}
            script={script}
            scriptArgs={['</script><img src=x>']}
            nonce="test"
            window={frame.contentWindow}
          />
          <span id="after-script">After</span>
        </>
      );
      await act(async () => {});
      expect(ref.current).toBe(original);
      expect(frameDocument.querySelectorAll('script')).toHaveLength(1);
      expect(frameDocument.documentElement.dataset.scriptResult).toBe(
        '<!--<ScRiPt></script><img src=x>'
      );
      await act(async () => root.unmount());
    } finally {
      frame.remove();
    }
  });
});
