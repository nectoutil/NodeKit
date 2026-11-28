/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, afterEach } from 'vitest';

import { createScript, observeScript, getScriptKey, getScriptStatus } from '../src/scripts';

afterEach(() => {
  for (const element of Array.from(document.querySelectorAll('script[data-necto-script]'))) {
    element.remove();
  }
});

function queryScript(key: string): HTMLScriptElement {
  return document.querySelector(`script[data-necto-script="${key}"]`) as HTMLScriptElement;
}

describe('getScriptKey', () => {
  it('keys an external script by its resolved URL', () => {
    const key = getScriptKey(document, { src: '/a/b.js' });

    expect(key).toBe(`src:${new URL('/a/b.js', document.baseURI).href}`);
  });

  it('keys an inline script by its id', () => {
    expect(getScriptKey(document, { id: 'boot', inlineContent: 'void 0' })).toBe('inline:boot');
  });
});

describe('getScriptStatus', () => {
  it('returns loading for an unknown key', () => {
    expect(getScriptStatus(document, 'src:never-created')).toBe('loading');
  });
});

describe('createScript', () => {
  it('injects an external script and reports loading', () => {
    const descriptor = { src: '/scripts/dom-create.js' };
    const record = createScript(document, descriptor);

    expect(record.status).toBe('loading');
    expect(record.element.isConnected).toBe(true);
    expect(record.element.src).toBe(new URL(descriptor.src, document.baseURI).href);
    expect(record.element.dataset.nectoScript).toBe(getScriptKey(document, descriptor));
  });

  it('deduplicates repeated calls for the same source', () => {
    const descriptor = { src: '/scripts/dom-dedupe.js' };
    const first = createScript(document, descriptor);
    const second = createScript(document, descriptor);

    expect(second).toBe(first);
    expect(
      document.querySelectorAll(`script[data-necto-script="${getScriptKey(document, descriptor)}"]`)
    ).toHaveLength(1);
  });

  it('marks a classic inline script ready', () => {
    const record = createScript(document, { id: 'dom-inline', inlineContent: 'void 0' });

    expect(record.status).toBe('ready');
    expect(record.element.textContent).toBe('void 0');
  });

  it('adopts a finished untracked script when its readyState is available', () => {
    const existing = document.createElement('script');
    existing.src = '/scripts/dom-finished.js';
    Object.defineProperty(existing, 'readyState', { value: 'complete' });
    document.head.append(existing);
    try {
      const record = createScript(document, { src: existing.src });

      expect(record.element).toBe(existing);
      expect(record.status).toBe('ready');
    } finally {
      existing.remove();
    }
  });

  it('waits for load when adopting a script with no completion signal', () => {
    const existing = document.createElement('script');
    existing.src = '/scripts/dom-pending.js';
    document.head.append(existing);
    try {
      const record = createScript(document, { src: existing.src });

      expect(record.element).toBe(existing);
      expect(record.status).toBe('loading');
      existing.dispatchEvent(new Event('load'));
      expect(record.status).toBe('ready');
    } finally {
      existing.remove();
    }
  });

  it('preserves an explicitly empty crossorigin attribute', () => {
    const record = createScript(document, { id: 'dom-empty-cors', crossOrigin: '' });

    expect(record.element.getAttribute('crossorigin')).toBe('');
  });

  it('adopts an existing script and respects its reported status', () => {
    const existing = document.createElement('script');
    existing.dataset.nectoScript = 'inline:dom-adopt';
    existing.dataset.nectoScriptStatus = 'ready';
    document.head.append(existing);

    const record = createScript(document, { id: 'dom-adopt', inlineContent: 'void 0' });

    expect(record.element).toBe(existing);
    expect(record.status).toBe('ready');
  });
});

describe('observeScript', () => {
  it('notifies and flips to ready on load', () => {
    const descriptor = { src: '/scripts/dom-observe-load.js' };
    const key = getScriptKey(document, descriptor);
    let notified = 0;

    const unsubscribe = observeScript(document, descriptor, () => {
      notified += 1;
    });

    expect(getScriptStatus(document, key)).toBe('loading');

    queryScript(key).dispatchEvent(new Event('load'));

    expect(getScriptStatus(document, key)).toBe('ready');
    expect(notified).toBeGreaterThan(0);

    unsubscribe();
  });

  it('removes a created script and reports error on failure', () => {
    const descriptor = { src: '/scripts/dom-observe-error.js' };
    const key = getScriptKey(document, descriptor);

    observeScript(document, descriptor, () => {});
    const element = queryScript(key);

    element.dispatchEvent(new Event('error'));

    expect(getScriptStatus(document, key)).toBe('error');
    expect(element.isConnected).toBe(false);
  });

  it('stops notifying after unsubscribe', () => {
    const descriptor = { src: '/scripts/dom-observe-unsub.js' };
    const key = getScriptKey(document, descriptor);
    let notified = 0;

    const unsubscribe = observeScript(document, descriptor, () => {
      notified += 1;
    });

    unsubscribe();
    queryScript(key).dispatchEvent(new Event('load'));

    expect(notified).toBe(0);
  });
});
