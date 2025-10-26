/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { test, expect } from '@playwright/experimental-ct-react';
import { GitHubButton } from '../../src/SocialButtons/GitHub/GitHub';

test.describe('GitHubButton Visual Tests', () => {
  test('should render GitHub button states', async ({ mount }) => {
    const component = await mount(
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
        <GitHubButton />
        <GitHubButton showIcon={false}>Without Icon</GitHubButton>
        <GitHubButton iconPosition="right">Icon Right</GitHubButton>
        <GitHubButton disabled>Disabled</GitHubButton>
      </div>
    );
    await expect(component).toHaveScreenshot('github-button-states.png');
  });
});
