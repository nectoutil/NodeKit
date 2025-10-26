/**
 * Copyright (c) Corinvo, LLC. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { If } from '../src/Conditionals/If/If';
import { Else } from '../src/Conditionals/Else/Else';

describe('Conditionals', () => {
  describe('If Component', () => {
    it('should render children when condition is true', () => {
      render(
        <If condition={true}>
          <div>Visible Content</div>
        </If>
      );
      expect(screen.getByText('Visible Content')).toBeInTheDocument();
    });

    it('should not render children when condition is false', () => {
      render(
        <If condition={false}>
          <div>Hidden Content</div>
        </If>
      );
      expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
    });

    it('should render If content when condition is true with Else', () => {
      render(
        <If condition={true}>
          <div>If Content</div>
          <Else>
            <div>Else Content</div>
          </Else>
        </If>
      );
      expect(screen.getByText('If Content')).toBeInTheDocument();
      expect(screen.queryByText('Else Content')).not.toBeInTheDocument();
    });

    it('should render Else content when condition is false', () => {
      render(
        <If condition={false}>
          <div>If Content</div>
          <Else>
            <div>Else Content</div>
          </Else>
        </If>
      );
      expect(screen.queryByText('If Content')).not.toBeInTheDocument();
      expect(screen.getByText('Else Content')).toBeInTheDocument();
    });

    it('should handle function conditions', () => {
      const conditionFn = () => true;
      render(
        <If condition={conditionFn}>
          <div>Function Condition</div>
        </If>
      );
      expect(screen.getByText('Function Condition')).toBeInTheDocument();
    });

    it('should return null when no children', () => {
      const { container } = render(<If condition={true}>{null}</If>);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Else Component', () => {
    it('should render children when used standalone', () => {
      render(
        <Else>
          <div>Else Standalone</div>
        </Else>
      );
      expect(screen.getByText('Else Standalone')).toBeInTheDocument();
    });
  });
});
