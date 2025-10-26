/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GitLabButton } from '../../src/SocialButtons/GitLab/GitLab';

describe('GitLabButton', () => {
  it('should render with default text', () => {
    render(<GitLabButton />);
    expect(screen.getByText('Continue with GitLab')).toBeInTheDocument();
  });

  it('should render with custom text', () => {
    render(<GitLabButton>Sign in with GitLab</GitLabButton>);
    expect(screen.getByText('Sign in with GitLab')).toBeInTheDocument();
  });

  it('should render without icon', () => {
    const { container } = render(<GitLabButton showIcon={false} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
