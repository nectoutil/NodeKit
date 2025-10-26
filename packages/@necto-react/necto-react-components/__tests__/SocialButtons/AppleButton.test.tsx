/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppleButton } from '../../src/SocialButtons/Apple/Apple';

describe('AppleButton', () => {
  it('should render with default text', () => {
    render(<AppleButton />);
    expect(screen.getByText('Continue with Apple')).toBeInTheDocument();
  });

  it('should render with custom text', () => {
    render(<AppleButton>Sign in with Apple</AppleButton>);
    expect(screen.getByText('Sign in with Apple')).toBeInTheDocument();
  });

  it('should render without icon', () => {
    const { container } = render(<AppleButton showIcon={false} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
