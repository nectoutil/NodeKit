/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FacebookButton } from '../../src/SocialButtons/Facebook/Facebook';

describe('FacebookButton', () => {
  it('should render with default text', () => {
    render(<FacebookButton />);
    expect(screen.getByText('Continue with Facebook')).toBeInTheDocument();
  });

  it('should render with custom text', () => {
    render(<FacebookButton>Sign in with Facebook</FacebookButton>);
    expect(screen.getByText('Sign in with Facebook')).toBeInTheDocument();
  });

  it('should render without icon', () => {
    const { container } = render(<FacebookButton showIcon={false} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
