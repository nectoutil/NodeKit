/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GitLabButton } from './GitLab';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Social Buttons/GitLab Button',
  component: GitLabButton,
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
      description: 'Show or hide the GitLab icon'
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Position of the GitLab icon'
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
} satisfies Meta<typeof GitLabButton>;

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
    children: 'Sign in with GitLab'
  }
};

export const CustomIconColor: Story = {
  args: {
    iconColor: null,
    children: 'Sign in with GitLab'
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
    href: '/auth/gitlab'
  }
};
