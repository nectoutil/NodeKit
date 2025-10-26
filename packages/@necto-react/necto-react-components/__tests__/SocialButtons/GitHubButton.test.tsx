/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GitHubButton } from '../../src/SocialButtons/GitHub/GitHub';

describe('GitHubButton', () => {
  it('should render with default text', () => {
    render(<GitHubButton />);
    expect(screen.getByText('Continue with GitHub')).toBeInTheDocument();
  });

  it('should render with custom text', () => {
    render(<GitHubButton>Sign in with GitHub</GitHubButton>);
    expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument();
  });

  it('should render without icon', () => {
    const { container } = render(<GitHubButton showIcon={false} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
