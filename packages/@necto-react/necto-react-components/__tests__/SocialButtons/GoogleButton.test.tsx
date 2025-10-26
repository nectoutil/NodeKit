/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GoogleButton } from '../../src/SocialButtons/Google/Google';

describe('GoogleButton', () => {
  it('should render with default text', () => {
    render(<GoogleButton />);
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  it('should render with custom text', () => {
    render(<GoogleButton>Sign in with Google</GoogleButton>);
    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
  });

  it('should render without icon', () => {
    const { container } = render(<GoogleButton showIcon={false} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
