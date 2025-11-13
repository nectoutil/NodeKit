/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MicrosoftButton } from './Microsoft';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Social Buttons/Microsoft Button',
  component: MicrosoftButton,
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
      description: 'Show or hide the Microsoft icon'
    },
    iconPosition: {
      control: 'radio',
      options: ['left', 'right'],
      description: 'Position of the Microsoft icon'
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
} satisfies Meta<typeof MicrosoftButton>;

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

export const AsLink: Story = {
  args: {
    as: 'a',
    href: '/auth/microsoft'
  }
};
