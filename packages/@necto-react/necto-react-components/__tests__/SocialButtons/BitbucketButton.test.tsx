/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BitbucketButton } from '../../src/SocialButtons/Bitbucket/Bitbucket';

describe('BitbucketButton', () => {
  it('should render with default text', () => {
    render(<BitbucketButton />);
    expect(screen.getByText('Continue with Bitbucket')).toBeInTheDocument();
  });

  it('should render with custom text', () => {
    render(<BitbucketButton>Sign in with Bitbucket</BitbucketButton>);
    expect(screen.getByText('Sign in with Bitbucket')).toBeInTheDocument();
  });

  it('should render without icon', () => {
    const { container } = render(<BitbucketButton showIcon={false} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
