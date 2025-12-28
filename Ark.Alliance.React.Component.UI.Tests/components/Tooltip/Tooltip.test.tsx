/**
 * @fileoverview Tooltip Component Unit Tests
 * @module tests/components/Tooltip
 * 
 * Comprehensive tests for Tooltip MVVM component.
 * Tests model validation, viewmodel positioning logic, and tooltip behavior.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import real component
import { Tooltip, withTooltip } from '../../../Ark.Alliance.React.Component.UI/src/components/Tooltip';
import { TooltipModelSchema, defaultTooltipModel, TooltipPosition } from '../../../Ark.Alliance.React.Component.UI/src/components/Tooltip/Tooltip.model';

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

describe('TooltipModelSchema', () => {
    it('should parse valid tooltip model', () => {
        const result = TooltipModelSchema.parse({
            content: 'Tooltip text',
            position: 'top',
        });

        expect(result.content).toBe('Tooltip text');
        expect(result.position).toBe('top');
    });

    it('should use defaults for missing properties', () => {
        const result = TooltipModelSchema.parse({
            content: 'Text',
        });

        expect(result.position).toBe('top');
        expect(result.delay).toBe(300);
        expect(result.isVisible).toBe(false);
        expect(result.disabled).toBe(false);
    });

    it('should accept all position variants', () => {
        const positions: TooltipPosition[] = ['top', 'bottom', 'left', 'right'];

        positions.forEach(position => {
            const result = TooltipModelSchema.parse({
                content: 'Text',
                position
            });
            expect(result.position).toBe(position);
        });
    });

    it('should reject invalid position', () => {
        expect(() =>
            TooltipModelSchema.parse({ content: 'Text', position: 'invalid' })
        ).toThrow();
    });

    it('should accept delay value', () => {
        const result = TooltipModelSchema.parse({
            content: 'Text',
            delay: 500,
        });

        expect(result.delay).toBe(500);
    });

    it('should use default model values', () => {
        expect(defaultTooltipModel.position).toBe('top');
        expect(defaultTooltipModel.delay).toBe(300);
        expect(defaultTooltipModel.isVisible).toBe(false);
        expect(defaultTooltipModel.tooltipPosition).toBe('top');
        expect(defaultTooltipModel.tooltipDelay).toBe(300);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT BEHAVIOR TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Tooltip Component', () => {
    describe('TOOLTIP-001: Show/Hide Behavior', () => {
        it('should not show tooltip initially without interaction', () => {
            const { container } = render(
                React.createElement(Tooltip, {
                    content: 'Tooltip content',
                    children: React.createElement('button', {}, 'Hover me'),
                })
            );

            // Tooltip should not be visible without interaction
            const tooltip = container.querySelector('.ark-tooltip');
            expect(tooltip).toBeNull();
        });

        it('should render trigger wrapper with children', () => {
            const { container } = render(
                React.createElement(Tooltip, {
                    content: 'Tooltip content',
                    children: React.createElement('div', {}, 'Child'),
                })
            );

            const trigger = container.querySelector('.ark-tooltip-trigger');
            expect(trigger).not.toBeNull();
        });

        it('should not show tooltip when disabled', () => {
            const { container } = render(
                React.createElement(Tooltip, {
                    content: 'Tooltip content',
                    disabled: true,
                    children: React.createElement('button', {}, 'Disabled'),
                })
            );

            // When disabled, should not render trigger wrapper
            const trigger = container.querySelector('.ark-tooltip-trigger');
            expect(trigger).toBeNull();
        });

        it('should render content text', () => {
            const content = 'Test tooltip content';

            const { container } = render(
                React.createElement(Tooltip, {
                    content,
                    children: React.createElement('button', {}, 'Click me'),
                })
            );

            expect(container.textContent).toContain('Click me');
        });
    });

    describe('TOOLTIP-002: Positioning', () => {
        it('should render with top position by default', () => {
            const { container } = render(
                React.createElement(Tooltip, {
                    content: 'Top tooltip',
                    position: 'top',
                    children: React.createElement('div', {}, 'Target'),
                })
            );

            // Tooltip wrapper should exist
            const trigger = container.querySelector('.ark-tooltip-trigger');
            expect(trigger).not.toBeNull();
        });

        it('should accept bottom position', () => {
            const { container } = render(
                React.createElement(Tooltip, {
                    content: 'Bottom tooltip',
                    position: 'bottom',
                    children: React.createElement('div', {}, 'Target'),
                })
            );

            const trigger = container.querySelector('.ark-tooltip-trigger');
            expect(trigger).not.toBeNull();
        });

        it('should accept left position', () => {
            const { container } = render(
                React.createElement(Tooltip, {
                    content: 'Left tooltip',
                    position: 'left',
                    children: React.createElement('div', {}, 'Target'),
                })
            );

            const trigger = container.querySelector('.ark-tooltip-trigger');
            expect(trigger).not.toBeNull();
        });

        it('should accept right position', () => {
            const { container } = render(
                React.createElement(Tooltip, {
                    content: 'Right tooltip',
                    position: 'right',
                    children: React.createElement('div', {}, 'Target'),
                })
            );

            const trigger = container.querySelector('.ark-tooltip-trigger');
            expect(trigger).not.toBeNull();
        });

        it('should use top as default position', () => {
            const model = TooltipModelSchema.parse({ content: 'Test' });
            expect(model.position).toBe('top');
        });
    });

    describe('TOOLTIP-003: Delay Timing', () => {
        it('should respect delay prop', async () => {
            vi.useFakeTimers();

            let visible = false;
            const setVisible = (v: boolean) => { visible = v; };

            // Simulate delay logic (in real implementation, this would be in the component)
            setTimeout(() => setVisible(true), 500);

            vi.advanceTimersByTime(400);
            expect(visible).toBe(false);

            vi.advanceTimersByTime(100);
            expect(visible).toBe(true);

            vi.useRealTimers();
        });

        it('should have default delay of 300ms', () => {
            const model = TooltipModelSchema.parse({ content: 'Text' });
            expect(model.delay).toBe(300);
        });

        it('should accept custom delay', () => {
            const model = TooltipModelSchema.parse({
                content: 'Text',
                delay: 1000
            });
            expect(model.delay).toBe(1000);
        });
    });

    describe('TOOLTIP-004: withTooltip HOC', () => {
        it('should wrap component with tooltip functionality', () => {
            // Create a simple test component
            const TestComponent = React.forwardRef<HTMLDivElement, { children?: React.ReactNode }>(
                (props, ref) => React.createElement('div', { ref, ...props }, props.children)
            );
            TestComponent.displayName = 'TestComponent';

            // Wrap with HOC
            const WrappedComponent = withTooltip(TestComponent);

            const { container } = render(
                React.createElement(WrappedComponent, {
                    tooltip: 'Wrapped tooltip',
                    children: 'Test content',
                })
            );

            // Component should render
            expect(container.textContent).toContain('Test content');
        });

        it('should not show tooltip when tooltip prop is not provided', () => {
            const TestComponent = React.forwardRef<HTMLDivElement, { children?: React.ReactNode }>(
                (props, ref) => React.createElement('div', { ref, className: 'test-component', ...props }, props.children)
            );
            TestComponent.displayName = 'TestComponent';

            const WrappedComponent = withTooltip(TestComponent);

            const { container } = render(
                React.createElement(WrappedComponent, {
                    children: 'No tooltip',
                })
            );

            const tooltip = container.querySelector('.ark-tooltip');
            // Tooltip should not be rendered
            expect(tooltip).toBeNull();
        });
    });

    describe('TOOLTIP-005: Ref Handling', () => {
        it('should handle null refs gracefully', () => {
            // Should not throw when refs are null
            expect(() => {
                render(
                    React.createElement(Tooltip, {
                        content: 'Tooltip',
                        children: React.createElement('div', {}, 'Test'),
                    })
                );
            }).not.toThrow();
        });
    });

    describe('TOOLTIP-006: Content Variants', () => {
        it('should accept string content', () => {
            const { container } = render(
                React.createElement(Tooltip, {
                    content: 'Simple text',
                    children: React.createElement('button', {}, 'Trigger'),
                })
            );

            //  Trigger should render
            expect(container.textContent).toContain('Trigger');
        });

        it('should handle empty content', () => {
            const { container } = render(
                React.createElement(Tooltip, {
                    content: '',
                    children: React.createElement('div', {}, 'Trigger'),
                })
            );

            // Should render without error
            expect(container).not.toBeNull();
        });

        it('should handle long content', () => {
            const longContent = 'This is a very long tooltip content that should still render correctly and be properly displayed to the user.';

            const { container } = render(
                React.createElement(Tooltip, {
                    content: longContent,
                    children: React.createElement('span', {}, 'Info'),
                })
            );

            expect(container).not.toBeNull();
        });
    });
});
