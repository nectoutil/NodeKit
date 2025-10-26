/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DropboxButton } from '../../src/SocialButtons/Dropbox/Dropbox';

describe('DropboxButton', () => {
  it('should render with default text', () => {
    render(<DropboxButton />);
    expect(screen.getByText('Continue with Dropbox')).toBeInTheDocument();
  });

  it('should render with custom text', () => {
    render(<DropboxButton>Sign in with Dropbox</DropboxButton>);
    expect(screen.getByText('Sign in with Dropbox')).toBeInTheDocument();
  });

  it('should render without icon', () => {
    const { container } = render(<DropboxButton showIcon={false} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
