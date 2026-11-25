/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { KVStore } from '@necto/idb';
import { useKV } from '@necto-react/hooks';
import { renderToString } from 'react-dom/server';
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

const store = new KVStore({ database: 'use-kv-test', store: 'records' });

describe('useKV', () => {
  beforeEach(async () => {
    await store.clear();
  });

  it('should be pending with no value on the first render', () => {
    const { result } = renderHook(() => useKV('missing', { store }));

    expect(result.current.pending).toBe(true);
    expect(result.current[0]).toBeUndefined();
  });

  it('should settle to undefined when the record does not exist', async () => {
    const { result } = renderHook(() => useKV('missing', { store }));

    await waitFor(() => expect(result.current.pending).toBe(false));

    expect(result.current[0]).toBeUndefined();
  });

  it('should return the default value while pending and once settled', async () => {
    const { result } = renderHook(() => useKV('missing', { store, defaultValue: 'light' }));

    expect(result.current[0]).toBe('light');

    await waitFor(() => expect(result.current.pending).toBe(false));

    expect(result.current[0]).toBe('light');
  });

  it('should read an existing record', async () => {
    await store.set('theme', 'dark');

    const { result } = renderHook(() => useKV<string>('theme', { store }));

    await waitFor(() => expect(result.current[0]).toBe('dark'));
  });

  it('should write with set', async () => {
    const { result } = renderHook(() => useKV<string>('theme', { store }));

    await waitFor(() => expect(result.current.pending).toBe(false));
    await act(async () => void result.current[1]('dark'));
    await waitFor(() => expect(result.current[0]).toBe('dark'));

    expect(await store.get('theme')).toBe('dark');
  });

  it('should write with an updater through a single transaction', async () => {
    await store.set('count', 1);

    const { result } = renderHook(() => useKV<number>('count', { store }));

    await waitFor(() => expect(result.current[0]).toBe(1));
    await act(async () => void result.current.set((prev) => (prev ?? 0) + 1));
    await waitFor(() => expect(result.current[0]).toBe(2));
  });

  it('should delete with remove', async () => {
    await store.set('theme', 'dark');

    const { result } = renderHook(() => useKV<string>('theme', { store }));

    await waitFor(() => expect(result.current[0]).toBe('dark'));
    await act(async () => void result.current[2]());
    await waitFor(() => expect(result.current[0]).toBeUndefined());
  });

  it('should update a second component reading the same key', async () => {
    const first = renderHook(() => useKV<string>('shared', { store }));
    const second = renderHook(() => useKV<string>('shared', { store }));

    await waitFor(() => expect(first.result.current.pending).toBe(false));
    await act(async () => void first.result.current.set('value'));

    await waitFor(() => expect(second.result.current[0]).toBe('value'));
  });

  it('should expose the same members as a tuple and as an object', async () => {
    const { result } = renderHook(() => useKV<string>('theme', { store }));

    await waitFor(() => expect(result.current.pending).toBe(false));

    expect(result.current[0]).toBe(result.current.value);
    expect(result.current[1]).toBe(result.current.set);
    expect(result.current[2]).toBe(result.current.remove);
  });

  it('should render the server value during server rendering', () => {
    function Probe(): string {
      const [value] = useKV<string>('theme', { store, serverValue: 'light' });

      return value ?? 'none';
    }

    expect(renderToString(<Probe />)).toContain('light');
  });

  it('should scope records to a scoped store', async () => {
    const scoped = store.scope('tenant');

    const { result } = renderHook(() => useKV<string>('theme', { store: scoped }));

    await waitFor(() => expect(result.current.pending).toBe(false));
    await act(async () => void result.current.set('dark'));
    await waitFor(() => expect(result.current[0]).toBe('dark'));

    expect(await store.get('tenant:theme')).toBe('dark');
    expect(await store.get('theme')).toBeUndefined();
  });
});
