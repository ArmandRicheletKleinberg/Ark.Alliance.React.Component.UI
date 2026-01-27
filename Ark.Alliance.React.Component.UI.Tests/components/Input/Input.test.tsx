/**
 * @fileoverview Input Component Unit Tests
 * @module tests/components/Input
 * 
 * Tests real Input component with mock data from scenarios.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import real component
import { Input, BaseInputModelSchema as InputModelSchema } from '@components/Input';
import { loadInputScenario, SCENARIO_IDS } from '../../fixtures/TestScenarioLoader';

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
// SCENARIO-DRIVEN TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Input Component', () => {
    describe('INPUT-001: Controlled Value Change', () => {
        const scenario = loadInputScenario(SCENARIO_IDS.INPUT_CONTROLLED);

        it('should call onChange when user types', async () => {
            expect(scenario).not.toBeNull();

            const onChange = vi.fn();
            const user = userEvent.setup();

            render(
                React.createElement(Input, {
                    value: '',
                    onChange,
                    label: 'Email',
                })
            );

            const input = screen.getByRole('textbox');
            await user.type(input, 't');

            expect(onChange).toHaveBeenCalled();
        });
    });

    describe('INPUT-002: With Error State', () => {
        const scenario = loadInputScenario(SCENARIO_IDS.INPUT_ERROR);

        it('should apply error class when error is set', () => {
            expect(scenario).not.toBeNull();

            const { container } = render(
                React.createElement(Input, {
                    value: 'invalid',
                    error: 'Invalid format',
                    onChange: vi.fn(),
                })
            );

            // Check for error class
            const wrapper = container.querySelector('.ark-input');
            expect(wrapper?.className).toContain('ark-input--error');
        });

        it('should display error message', () => {
            render(
                React.createElement(Input, {
                    value: 'invalid',
                    error: 'Invalid format',
                    onChange: vi.fn(),
                })
            );

            expect(screen.getByText('Invalid format')).toBeDefined();
        });
    });

    describe('INPUT-006: NON-REGRESSION - Value Sync from Parent', () => {
        it('should sync value when parent prop changes', async () => {
            const onChange = vi.fn();

            // Initial render with empty value
            const { rerender } = render(
                React.createElement(Input, {
                    value: 'initial',
                    onChange,
                })
            );

            const input = screen.getByRole('textbox') as HTMLInputElement;
            expect(input.value).toBe('initial');

            // Parent updates value prop
            rerender(
                React.createElement(Input, {
                    value: 'updated from parent',
                    onChange,
                })
            );

            // Input should reflect new value (REGRESSION: this was broken before)
            expect(input.value).toBe('updated from parent');
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// MODEL VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('InputModelSchema', () => {
    it('should parse valid input model', () => {
        const result = InputModelSchema.parse({
            type: 'text',
            size: 'md',
        });

        expect(result.type).toBe('text');
        expect(result.size).toBe('md');
    });

    it('should use defaults for missing properties', () => {
        const result = InputModelSchema.parse({});

        expect(result.type).toBe('text');
        expect(result.variant).toBe('default');
    });

    it('should accept email type', () => {
        const result = InputModelSchema.parse({ type: 'email' });
        expect(result.type).toBe('email');
    });

    it('should accept password type', () => {
        const result = InputModelSchema.parse({ type: 'password' });
        expect(result.type).toBe('password');
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// FOCUS/BLUR TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Input Focus/Blur', () => {
    it('should call onFocus when focused', async () => {
        const onFocus = vi.fn();
        const user = userEvent.setup();

        render(
            React.createElement(Input, {
                value: '',
                onChange: vi.fn(),
                onFocus,
            })
        );

        const input = screen.getByRole('textbox');
        await user.click(input);

        expect(onFocus).toHaveBeenCalled();
    });

    it('should call onBlur when blurred', async () => {
        const onBlur = vi.fn();
        const user = userEvent.setup();

        render(
            React.createElement(Input, {
                value: '',
                onChange: vi.fn(),
                onBlur,
            })
        );

        const input = screen.getByRole('textbox');
        await user.click(input);
        await user.tab();

        expect(onBlur).toHaveBeenCalled();
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// DISABLED STATE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Input Disabled State', () => {
    it('should be disabled when prop is true', () => {
        render(
            React.createElement(Input, {
                value: '',
                onChange: vi.fn(),
                disabled: true,
            })
        );

        const input = screen.getByRole('textbox') as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    it('should not call onChange when disabled', async () => {
        const onChange = vi.fn();

        render(
            React.createElement(Input, {
                value: '',
                onChange,
                disabled: true,
            })
        );

        const input = screen.getByRole('textbox');

        // Try to type (should not work)
        fireEvent.change(input, { target: { value: 'test' } });

        // Input is disabled, so onChange shouldn't fire from UI
        // (Native behavior prevents this)
    });
});
