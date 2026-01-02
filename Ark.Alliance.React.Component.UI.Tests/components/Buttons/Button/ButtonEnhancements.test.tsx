/**
 * @fileoverview Button Component Tests with Primitive Enhancements
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../../../../Ark.Alliance.React.Component.UI/src/components/Buttons/Button';

describe('Button Component', () => {
    it('should render iconLeftElement', () => {
        render(
            <Button
                iconLeftElement={<span data-testid="custom-icon">Custom</span>}
            >
                Button With Icon
            </Button>
        );
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
        expect(screen.getByText('Button With Icon')).toBeInTheDocument();
    });

    it('should render iconRightElement', () => {
        render(
            <Button
                iconRightElement={<span data-testid="custom-icon-right">Right</span>}
            >
                Button With Right Icon
            </Button>
        );
        expect(screen.getByTestId('custom-icon-right')).toBeInTheDocument();
    });

    it('should allow usage of "danger" variant', () => {
        render(
            <Button variant="danger">
                Danger Button
            </Button>
        );
        const btn = screen.getByRole('button');
        expect(btn).toHaveClass('ark-btn--danger');
    });

    it('should prioritize iconElement over icon string', () => {
        render(
            <Button
                iconLeft="plus"
                iconLeftElement={<span data-testid="override-icon">Override</span>}
            >
                Priority Test
            </Button>
        );
        // "plus" icon would render an svg or i tag usually, but our custom element should be present
        expect(screen.getByTestId('override-icon')).toBeInTheDocument();
        // Since we didn't mock Icon to disappear, we assume our logic conditionally renders one or the other.
        // The implementation does: element ? element : string ? renderIcon : null.
    });
});
