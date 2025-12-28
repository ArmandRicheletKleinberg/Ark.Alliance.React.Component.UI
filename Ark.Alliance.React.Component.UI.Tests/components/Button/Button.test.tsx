/**
 * @fileoverview Button Component Unit Tests
 * @module tests/components/Button
 * 
 * Tests real Button component with mock data from scenarios.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import real component
import { Button } from '@components/Buttons';
import { ButtonModelSchema } from '@components/Buttons/Button/Button.model';

// ═══════════════════════════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════════════════════════

beforeEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    cleanup();
});

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Button Component', () => {
    describe('BTN-001: Click Behavior', () => {
        it('should call onClick when clicked', async () => {
            const onClick = vi.fn();
            const user = userEvent.setup();

            render(
                React.createElement(Button, {
                    onClick,
                    children: 'Click Me',
                })
            );

            const button = screen.getByRole('button');
            await user.click(button);

            expect(onClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('BTN-002: Disabled State', () => {
        it('should not call onClick when disabled', async () => {
            const onClick = vi.fn();
            const user = userEvent.setup();

            render(
                React.createElement(Button, {
                    onClick,
                    disabled: true,
                    children: 'Disabled',
                })
            );

            const button = screen.getByRole('button');
            await user.click(button);

            expect(onClick).not.toHaveBeenCalled();
        });
    });

    describe('BTN-003: Variant Styling', () => {
        it('should apply primary variant by default', () => {
            const { container } = render(
                React.createElement(Button, {
                    children: 'Primary',
                })
            );

            const button = container.querySelector('.ark-btn');
            expect(button?.className).toContain('ark-btn--primary');
        });

        it('should apply secondary variant', () => {
            const { container } = render(
                React.createElement(Button, {
                    variant: 'secondary',
                    children: 'Secondary',
                })
            );

            const button = container.querySelector('.ark-btn');
            expect(button?.className).toContain('ark-btn--secondary');
        });

        it('should apply danger variant', () => {
            const { container } = render(
                React.createElement(Button, {
                    variant: 'danger',
                    children: 'Danger',
                })
            );

            const button = container.querySelector('.ark-btn');
            expect(button?.className).toContain('ark-btn--danger');
        });
    });

    describe('BTN-005: Size Variants', () => {
        it('should apply md size by default', () => {
            const { container } = render(
                React.createElement(Button, {
                    children: 'Medium',
                })
            );

            const button = container.querySelector('.ark-btn');
            expect(button?.className).toContain('ark-btn--md');
        });

        it('should apply sm size', () => {
            const { container } = render(
                React.createElement(Button, {
                    size: 'sm',
                    children: 'Small',
                })
            );

            const button = container.querySelector('.ark-btn');
            expect(button?.className).toContain('ark-btn--sm');
        });

        it('should apply lg size', () => {
            const { container } = render(
                React.createElement(Button, {
                    size: 'lg',
                    children: 'Large',
                })
            );

            const button = container.querySelector('.ark-btn');
            expect(button?.className).toContain('ark-btn--lg');
        });
    });

    describe('BTN-006: Full Width', () => {
        it('should apply full-width class', () => {
            const { container } = render(
                React.createElement(Button, {
                    fullWidth: true,
                    children: 'Full Width',
                })
            );

            const button = container.querySelector('.ark-btn');
            expect(button?.className).toContain('ark-btn--full-width');
        });
    });

    describe('BTN-007: Button Type', () => {
        it('should have type="button" by default', () => {
            render(
                React.createElement(Button, {
                    children: 'Button',
                })
            );

            const button = screen.getByRole('button') as HTMLButtonElement;
            expect(button.type).toBe('button');
        });

        it('should accept type="submit"', () => {
            render(
                React.createElement(Button, {
                    type: 'submit',
                    children: 'Submit',
                })
            );

            const button = screen.getByRole('button') as HTMLButtonElement;
            expect(button.type).toBe('submit');
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// MODEL VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('ButtonModelSchema', () => {
    it('should parse valid button model', () => {
        const result = ButtonModelSchema.parse({
            variant: 'primary',
            size: 'md',
        });

        expect(result.variant).toBe('primary');
        expect(result.size).toBe('md');
    });

    it('should use defaults for missing properties', () => {
        const result = ButtonModelSchema.parse({});

        expect(result.variant).toBe('primary');
        expect(result.size).toBe('md');
        expect(result.type).toBe('button');
        expect(result.fullWidth).toBe(false);
        expect(result.iconOnly).toBe(false);
        expect(result.pill).toBe(false);
    });

    it('should accept all variant options', () => {
        const variants = ['primary', 'secondary', 'ghost', 'outline', 'danger', 'success', 'link'];

        variants.forEach(variant => {
            const result = ButtonModelSchema.parse({ variant });
            expect(result.variant).toBe(variant);
        });
    });

    it('should accept all size options', () => {
        const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

        sizes.forEach(size => {
            const result = ButtonModelSchema.parse({ size });
            expect(result.size).toBe(size);
        });
    });

    it('should reject invalid variant', () => {
        expect(() =>
            ButtonModelSchema.parse({ variant: 'invalid' })
        ).toThrow();
    });

    it('should reject invalid size', () => {
        expect(() =>
            ButtonModelSchema.parse({ size: 'invalid' })
        ).toThrow();
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// ICON TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Button Icons', () => {
    it('should accept iconLeft prop', () => {
        const result = ButtonModelSchema.parse({
            iconLeft: 'arrow-left',
        });

        expect(result.iconLeft).toBe('arrow-left');
    });

    it('should accept iconRight prop', () => {
        const result = ButtonModelSchema.parse({
            iconRight: 'arrow-right',
        });

        expect(result.iconRight).toBe('arrow-right');
    });

    it('should accept iconOnly mode', () => {
        const result = ButtonModelSchema.parse({
            iconOnly: true,
            iconCenter: 'plus',
        });

        expect(result.iconOnly).toBe(true);
        expect(result.iconCenter).toBe('plus');
    });
});
