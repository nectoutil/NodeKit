/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { test, expect } from '@playwright/experimental-ct-react';
import { AtlassianButton } from '../../src/SocialButtons/Atlassian/Atlassian';

test.describe('AtlassianButton Visual Tests', () => {
  test('should render Atlassian button states', async ({ mount }) => {
    const component = await mount(
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
        <AtlassianButton />
        <AtlassianButton showIcon={false}>Without Icon</AtlassianButton>
        <AtlassianButton iconPosition="right">Icon Right</AtlassianButton>
        <AtlassianButton disabled>Disabled</AtlassianButton>
      </div>
    );
    await expect(component).toHaveScreenshot('atlassian-button-states.png');
  });
});
