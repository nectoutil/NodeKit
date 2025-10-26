/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DiscordButton } from '../../src/SocialButtons/Discord/Discord';

describe('DiscordButton', () => {
  it('should render with default text', () => {
    render(<DiscordButton />);
    expect(screen.getByText('Continue with Discord')).toBeInTheDocument();
  });

  it('should render with custom text', () => {
    render(<DiscordButton>Sign in with Discord</DiscordButton>);
    expect(screen.getByText('Sign in with Discord')).toBeInTheDocument();
  });

  it('should render without icon', () => {
    const { container } = render(<DiscordButton showIcon={false} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
