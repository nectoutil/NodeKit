/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SnapchatButton } from './Snapchat';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Social Buttons/Snapchat Button',
  component: SnapchatButton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Button text content'
    },
    showIcon: {
      control: 'boolean',
      description: 'Show or hide the Snapchat icon'
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Position of the Snapchat icon'
    },
    iconColor: {
      control: ['text', null],
      description: 'Color of button icon'
    },
    as: {
      control: 'text',
      description: 'HTML element or React component to render as'
    },
    asChild: {
      control: 'boolean',
      description: 'Merge props into child element'
    }
  }
} satisfies Meta<typeof SnapchatButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};

export const WithoutIcon: Story = {
  args: {
    showIcon: false
  }
};

export const IconOnRight: Story = {
  args: {
    iconPosition: 'right'
  }
};

export const CustomText: Story = {
  args: {
    children: 'Sign in with Snapchat'
  }
};

export const CustomIconColor: Story = {
  args: {
    iconColor: 'black',
    children: 'Sign in with Snapchat'
  }
};

export const CustomStyles: Story = {
  args: {
    style: {
      borderRadius: '20px',
      padding: '12px 24px',
      fontSize: '16px'
    }
  }
};

export const AsLink: Story = {
  args: {
    as: 'a',
    href: '/auth/Snapchat'
  }
};
