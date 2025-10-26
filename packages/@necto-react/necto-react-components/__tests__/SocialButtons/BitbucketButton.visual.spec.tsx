/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { test, expect } from '@playwright/experimental-ct-react';
import { BitbucketButton } from '../../src/SocialButtons/Bitbucket/Bitbucket';

test.describe('BitbucketButton Visual Tests', () => {
  test('should render Bitbucket button states', async ({ mount }) => {
    const component = await mount(
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
        <BitbucketButton />
        <BitbucketButton showIcon={false}>Without Icon</BitbucketButton>
        <BitbucketButton iconPosition="right">Icon Right</BitbucketButton>
        <BitbucketButton disabled>Disabled</BitbucketButton>
      </div>
    );
    await expect(component).toHaveScreenshot('bitbucket-button-states.png');
  });
});
