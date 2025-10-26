/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AtlassianButton } from '../../src/SocialButtons/Atlassian/Atlassian';

describe('AtlassianButton', () => {
  it('should render with default text', () => {
    render(<AtlassianButton />);
    expect(screen.getByText('Continue with Atlassian')).toBeInTheDocument();
  });

  it('should render with custom text', () => {
    render(<AtlassianButton>Sign in with Atlassian</AtlassianButton>);
    expect(screen.getByText('Sign in with Atlassian')).toBeInTheDocument();
  });

  it('should render without icon', () => {
    const { container } = render(<AtlassianButton showIcon={false} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
