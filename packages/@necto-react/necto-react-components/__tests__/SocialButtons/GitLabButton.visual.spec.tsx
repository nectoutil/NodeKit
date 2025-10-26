/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { test, expect } from '@playwright/experimental-ct-react';
import { GitLabButton } from '../../src/SocialButtons/GitLab/GitLab';

test.describe('GitLabButton Visual Tests', () => {
  test('should render GitLab button states', async ({ mount }) => {
    const component = await mount(
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
        <GitLabButton />
        <GitLabButton showIcon={false}>Without Icon</GitLabButton>
        <GitLabButton iconPosition="right">Icon Right</GitLabButton>
        <GitLabButton disabled>Disabled</GitLabButton>
      </div>
    );
    await expect(component).toHaveScreenshot('gitlab-button-states.png');
  });
});
