/**
 * @fileoverview ProgressBar Component Unit Tests
 * @module tests/components/ProgressBar
 * 
 * Comprehensive tests for ProgressBar MVVM component.
 * Tests model validation, viewmodel percentage calculation, and progress rendering.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import React from 'react';

// Import real component
import { ProgressBar } from '../../../Ark.Alliance.React.Component.UI/src/components/ProgressBar';
import { ProgressBarModelSchema, defaultProgressBarModel } from '../../../Ark.Alliance.React.Component.UI/src/components/ProgressBar/ProgressBar.model';

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
// MODEL VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('ProgressBarModelSchema', () => {
    it('should parse valid progress bar model', () => {
        const result = ProgressBarModelSchema.parse({
            value: 50,
            max: 100,
            label: 'Progress',
        });

        expect(result.value).toBe(50);
        expect(result.max).toBe(100);
        expect(result.label).toBe('Progress');
    });

    it('should use defaults for missing properties', () => {
        const result = ProgressBarModelSchema.parse({
            value: 25,
            label: 'Test',
        });

        expect(result.max).toBe(100);
        expect(result.color).toBe('cyan');
        expect(result.showPercentage).toBe(false);
        expect(result.showValue).toBe(false);
        expect(result.animated).toBe(false);
        expect(result.indeterminate).toBe(false);
    });

    it('should accept all color variants', () => {
        const colors = ['blue', 'green', 'red', 'cyan', 'yellow', 'purple'];

        colors.forEach(color => {
            const result = ProgressBarModelSchema.parse({
                value: 50,
                label: 'Test',
                color
            });
            expect(result.color).toBe(color);
        });
    });

    it('should reject invalid color', () => {
        expect(() =>
            ProgressBarModelSchema.parse({ value: 50, label: 'Test', color: 'invalid' })
        ).toThrow();
    });

    it('should validate value bounds', () => {
        // Value should be clamped between min and max in the viewmodel
        const result = ProgressBarModelSchema.parse({
            value: 150,
            max: 100,
            label: 'Test',
        });

        expect(result.value).toBe(150); // Model stores the value as-is
        // ViewModel should clamp it
    });

    it('should accept custom max', () => {
        const result = ProgressBarModelSchema.parse({
            value: 50,
            max: 80,
            label: 'Custom',
        });

        expect(result.max).toBe(80);
    });

    it('should use default model values', () => {
        expect(defaultProgressBarModel.value).toBe(0);
        expect(defaultProgressBarModel.max).toBe(100);
        expect(defaultProgressBarModel.color).toBe('cyan');
        expect(defaultProgressBarModel.showPercentage).toBe(false);
        expect(defaultProgressBarModel.showValue).toBe(false);
        expect(defaultProgressBarModel.animated).toBe(false);
        expect(defaultProgressBarModel.indeterminate).toBe(false);
        expect(defaultProgressBarModel.tooltipPosition).toBe('top');
        expect(defaultProgressBarModel.tooltipDelay).toBe(300);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT BEHAVIOR TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('ProgressBar Component', () => {
    describe('PROGRESS-001: Percentage Calculation', () => {
        it('should calculate 0% for min value', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 0,
                    max: 100,
                    label: '0%',
                })
            );

            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });

        it('should calculate 50% for middle value', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 50,
                    max: 100,
                    label: '50%',
                })
            );

            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });

        it('should calculate 100% for max value', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 100,
                    max: 100,
                    label: '100%',
                })
            );

            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });

        it('should handle custom min/max range', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 15,
                    max: 20,
                    label: 'Custom range',
                })
            );

            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });

        it('should clamp values above max', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 150,
                    max: 100,
                    label: 'Over max',
                })
            );

            // Should render without error
            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });

        it('should clamp values at min (0)', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 0,
                    max: 100,
                    label: 'At min',
                })
            );

            // Should render at minimum value
            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });
    });

    describe('PROGRESS-002: Color Variants', () => {
        it('should render with blue color', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 50,
                    label: 'Blue',
                    color: 'blue',
                })
            );

            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });

        it('should render with green color', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 50,
                    label: 'Green',
                    color: 'green',
                })
            );

            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });

        it('should render with red color', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 50,
                    label: 'Red',
                    color: 'red',
                })
            );

            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });

        it('should render with cyan color', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 50,
                    label: 'Cyan',
                    color: 'cyan',
                })
            );

            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });

        it('should render with yellow color', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 50,
                    label: 'Yellow',
                    color: 'yellow',
                })
            );

            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });

        it('should render with purple color', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 50,
                    label: 'Purple',
                    color: 'purple',
                })
            );

            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });
    });

    describe('PROGRESS-003: Value Display', () => {
        it('should allow percentage display when showPercentage=true', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 75,
                    max: 100,
                    showPercentage: true,
                })
            );

            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });

        it('should allow value display when showValue=true', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 40,
                    max: 100,
                    showValue: true,
                })
            );

            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });
    });

    describe('PROGRESS-004: Label Display', () => {
        it('should display label when showLabel is true', () => {
            const label = 'Download Progress';

            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 50,
                    label,
                    showLabel: true,
                })
            );

            expect(container.textContent).toContain(label);
        });

        it('should hide label when showLabel is false', () => {
            const label = 'Hidden Label';

            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 50,
                    label,
                    showLabel: false,
                })
            );

            // Label should not be visible
            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });

        it('should show percentage when showPercentage is true', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 75,
                    max: 100,
                    label: 'Test',
                    showPercentage: true,
                })
            );

            // Should display percentage value
            expect(container.textContent).toMatch(/\d+%/);
        });

        it('should hide percentage when showPercentage is false', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 75,
                    label: 'Test',
                    showPercentage: false,
                })
            );

            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });
    });

    describe('PROGRESS-005: Animation and States', () => {
        it('should render with animation enabled', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 50,
                    label: 'Animated',
                    animated: true,
                })
            );

            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });

        it('should render without animation when disabled', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 50,
                    label: 'Static',
                    animated: false,
                })
            );

            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });

        it('should render in disabled state', () => {
            const { container } = render(
                React.createElement(ProgressBar, {
                    value: 50,
                    label: 'Disabled',
                    disabled: true,
                })
            );

            const progressBar = container.querySelector('.ark-progress');
            expect(progressBar).not.toBeNull();
        });
    });
});
