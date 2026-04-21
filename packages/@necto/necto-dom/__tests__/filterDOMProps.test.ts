/*
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { filterDOMProps } from '../src/filterDOMProps';

describe('filterDOMProps', () => {
  it('should allow id by default', () => {
    const props = { id: 'foo', foo: 'bar' };
    const options = {};
    expect(filterDOMProps(props, options)).toEqual({ id: 'foo' });
  });

  it('should allow extra allowed props', () => {
    const props = { id: 'foo', custom: 'bar' };
    const options = {
      additionalAllowedProps: new Set(['custom'])
    };
    expect(filterDOMProps(props, options)).toEqual({
      id: 'foo',
      custom: 'bar'
    });
  });

  it('should allow data-* attributes', () => {
    const props = {
      id: 'foo',
      'data-test': 'bar',
      'data-foo': 'baz',
      notData: 'no'
    };
    const options = {};
    expect(filterDOMProps(props, options)).toEqual({
      id: 'foo',
      'data-test': 'bar',
      'data-foo': 'baz'
    });
  });

  it('should not allow props not specified in options', () => {
    const props = { id: 'foo', htmlFor: 'bar', href: '/home', custom: 'baz' };
    const options = {};
    expect(filterDOMProps(props, options)).toEqual({ id: 'foo' });
  });
});
