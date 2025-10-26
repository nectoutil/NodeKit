/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { test, expect } from '@playwright/experimental-ct-react';
import { FacebookButton } from '../../src/SocialButtons/Facebook/Facebook';

test.describe('FacebookButton Visual Tests', () => {
  test('should render Facebook button states', async ({ mount }) => {
    const component = await mount(
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
        <FacebookButton />
        <FacebookButton showIcon={false}>Without Icon</FacebookButton>
        <FacebookButton iconPosition="right">Icon Right</FacebookButton>
        <FacebookButton disabled>Disabled</FacebookButton>
      </div>
    );
    await expect(component).toHaveScreenshot('facebook-button-states.png');
  });
});
