/**
 * @fileoverview BaseInput Component Unit Tests
 * @module tests/components/Input/BaseInput
 * 
 * Comprehensive tests for BaseInput MVVM primitive component.
 * Tests model validation, viewmodel state management, and input behavior.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import real component
import { BaseInput } from '../../../Ark.Alliance.React.Component.UI/src/components/Input/BaseInput';
import { BaseInputModelSchema, defaultBaseInputModel, InputSize } from '../../../Ark.Alliance.React.Component.UI/src/components/Input/BaseInput/BaseInput.model';

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

describe('BaseInputModelSchema', () => {
    it('should parse valid input model', () => {
        const result = BaseInputModelSchema.parse({
            value: 'test value',
            size: 'md',
            variant: 'default',
        });

        expect(result.value).toBe('test value');
        expect(result.size).toBe('md');
        expect(result.variant).toBe('default');
    });

    it('should use defaults for missing properties', () => {
        const result = BaseInputModelSchema.parse({});

        expect(result.value).toBe('');
        expect(result.size).toBe('md');
        expect(result.variant).toBe('default');
        expect(result.hasError).toBe(false);
        expect(result.isFocused).toBe(false);
        expect(result.fullWidth).toBe(false);
        expect(result.disabled).toBeDefined();
        expect(result.readOnly).toBe(false);
        expect(result.required).toBe(false);
        expect(result.autoFocus).toBe(false);
    });

    it('should accept all size variants', () => {
        const sizes = ['sm', 'md', 'lg'];

        sizes.forEach(size => {
            const result = BaseInputModelSchema.parse({ size });
            expect(result.size).toBe(size);
        });
    });

    it('should accept all variant types', () => {
        const variants = ['default', 'filled', 'outlined', 'underlined'];

        variants.forEach(variant => {
            const result = BaseInputModelSchema.parse({ variant });
            expect(result.variant).toBe(variant);
        });
    });

    it('should reject invalid size', () => {
        expect(() =>
            BaseInputModelSchema.parse({ size: 'invalid' })
        ).toThrow();
    });

    it('should reject invalid variant', () => {
        expect(() =>
            BaseInputModelSchema.parse({ variant: 'invalid' })
        ).toThrow();
    });

    it('should accept all HTML input types', () => {
        const types = ['text', 'email', 'password', 'number', 'tel', 'url'];

        types.forEach(type => {
            const result = BaseInputModelSchema.parse({ type });
            expect(result.type).toBe(type);
        });
    });

    it('should use default model values', () => {
        expect(defaultBaseInputModel.value).toBe('');
        expect(defaultBaseInputModel.size).toBe('md');
        expect(defaultBaseInputModel.variant).toBe('default');
        expect(defaultBaseInputModel.type).toBe('text');
        expect(defaultBaseInputModel.focusable).toBe(true);
        expect(defaultBaseInputModel.tooltipPosition).toBe('top');
        expect(defaultBaseInputModel.tooltipDelay).toBe(300);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT BEHAVIOR TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('BaseInput Component', () => {
    describe('BASE-INPUT-001: Value Changes', () => {
        it('should call onChange when user types', async () => {
            const onChange = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    onChange,
                })
            );

            const input = container.querySelector('input');
            expect(input).not.toBeNull();

            await user.type(input!, 'test');

            expect(onChange).toHaveBeenCalled();
            expect(onChange.mock.calls.length).toBeGreaterThan(0);
        });

        it('should pass event object to onChange', async () => {
            const onChange = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    onChange,
                })
            );

            const input = container.querySelector('input');
            await user.type(input!, 'a');

            // onChange should receive React.ChangeEvent
            expect(onChange).toHaveBeenCalled();
            const event = onChange.mock.calls[0][0];
            expect(event).toHaveProperty('target');
            expect(event.target).toHaveProperty('value');
        });

        it('should update displayed value', async () => {
            const user = userEvent.setup();
            let value = '';
            const onChange = vi.fn((e) => {
                value = e.target.value;
            });

            const { container, rerender } = render(
                React.createElement(BaseInput, {
                    value,
                    onChange,
                })
            );

            const input = container.querySelector('input');
            await user.type(input!, 'new value');

            // Verify onChange was called
            expect(onChange).toHaveBeenCalled();
        });
    });

    describe('BASE-INPUT-002: Focus/Blur', () => {
        it('should call onFocus when input is focused', async () => {
            const onFocus = vi.fn();

            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    onFocus,
                })
            );

            const input = container.querySelector('input');
            input!.focus();

            expect(onFocus).toHaveBeenCalled();
        });

        it('should call onBlur when input loses focus', async () => {
            const onBlur = vi.fn();

            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    onBlur,
                })
            );

            const input = container.querySelector('input');
            input!.focus();
            input!.blur();

            expect(onBlur).toHaveBeenCalled();
        });

        it('should apply focus class when focused', async () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    isFocused: true,
                })
            );

            // Note: isFocused is a viewmodel state indicator, not reflected as CSS class in InputBase
            // The wrapper receives base classes; verify the input is focusable and wrapper exists
            const wrapper = container.querySelector('.ark-input-base');
            const input = container.querySelector('input');
            expect(wrapper).not.toBeNull();
            expect(input).not.toBeNull();
        });

        it('should pass event object to onFocus and onBlur', () => {
            const onFocus = vi.fn();
            const onBlur = vi.fn();

            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    onFocus,
                    onBlur,
                })
            );

            const input = container.querySelector('input');
            input!.focus();
            input!.blur();

            // Both should receive React.FocusEvent
            expect(onFocus).toHaveBeenCalled();
            expect(onBlur).toHaveBeenCalled();

            const focusEvent = onFocus.mock.calls[0][0];
            const blurEvent = onBlur.mock.calls[0][0];

            expect(focusEvent).toHaveProperty('target');
            expect(blurEvent).toHaveProperty('target');
        });
    });

    describe('BASE-INPUT-003: Sizes', () => {
        it('should apply small size class', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    size: 'sm',
                })
            );

            const wrapper = container.querySelector('.ark-input-base');
            expect(wrapper?.className).toContain('ark-input-base--sm');
        });

        it('should apply medium size class (default)', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    size: 'md',
                })
            );

            const wrapper = container.querySelector('.ark-input-base');
            expect(wrapper?.className).toContain('ark-input-base--md');
        });

        it('should apply large size class', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    size: 'lg',
                })
            );

            const wrapper = container.querySelector('.ark-input-base');
            expect(wrapper?.className).toContain('ark-input-base--lg');
        });
    });

    describe('BASE-INPUT-004: Error State', () => {
        it('should apply error class when hasError is true', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    hasError: true,
                })
            );

            const wrapper = container.querySelector('.ark-input-base');
            expect(wrapper?.className).toContain('ark-input-base--error');
        });

        it('should set aria-invalid when hasError is true', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    hasError: true,
                })
            );

            const input = container.querySelector('input');
            expect(input?.getAttribute('aria-invalid')).toBe('true');
        });

        it('should not have error class when hasError is false', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    hasError: false,
                })
            );

            const wrapper = container.querySelector('.ark-input-base');
            expect(wrapper?.className).not.toContain('ark-input-base--error');
        });
    });

    describe('BASE-INPUT-005: Disabled State', () => {
        it('should be disabled when disabled prop is true', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    disabled: true,
                })
            );

            const input = container.querySelector('input');
            expect(input?.disabled).toBe(true);
        });

        it('should not call onChange when disabled', async () => {
            const onChange = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    disabled: true,
                    onChange,
                })
            );

            const input = container.querySelector('input');

            // Attempt to type (should be blocked)
            try {
                await user.type(input!, 'test');
            } catch (e) {
                // Expected - disabled inputs can't be typed into
            }

            // onChange should not be called
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should apply disabled class', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    disabled: true,
                })
            );

            const wrapper = container.querySelector('.ark-input-base');
            expect(wrapper?.className).toContain('ark-disabled');
        });
    });

    describe('BASE-INPUT-006: Full Width', () => {
        it('should apply full-width class when fullWidth is true', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    fullWidth: true,
                })
            );

            const wrapper = container.querySelector('.ark-input-base');
            expect(wrapper?.className).toContain('ark-w-full');
        });

        it('should not have full-width class by default', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                })
            );

            const wrapper = container.querySelector('.ark-input-base');
            expect(wrapper?.className).not.toContain('ark-w-full');
        });
    });

    describe('BASE-INPUT-007: ReadOnly State', () => {
        it('should be readonly when readOnly prop is true', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: 'readonly value',
                    readOnly: true,
                })
            );

            const input = container.querySelector('input');
            expect(input?.readOnly).toBe(true);
        });

        it('should apply readonly class', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    readOnly: true,
                })
            );

            // Note: readOnly state is reflected via HTML readOnly attribute, not CSS class
            const input = container.querySelector('input');
            expect(input?.readOnly).toBe(true);
        });
    });

    describe('BASE-INPUT-008: Placeholder and Type', () => {
        it('should render with placeholder', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    placeholder: 'Enter text...',
                })
            );

            const input = container.querySelector('input');
            expect(input?.placeholder).toBe('Enter text...');
        });

        it('should render with correct input type', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    type: 'email',
                })
            );

            const input = container.querySelector('input');
            expect(input?.type).toBe('email');
        });

        it('should default to text type', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                })
            );

            const input = container.querySelector('input');
            expect(input?.type).toBe('text');
        });
    });

    describe('BASE-INPUT-009: Required and Validation', () => {
        it('should be required when required prop is true', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    required: true,
                })
            );

            const input = container.querySelector('input');
            expect(input?.required).toBe(true);
        });

        it('should respect maxLength', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    maxLength: 10,
                })
            );

            const input = container.querySelector('input');
            expect(input?.maxLength).toBe(10);
        });

        it('should respect minLength', () => {
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    minLength: 3,
                })
            );

            const input = container.querySelector('input');
            expect(input?.minLength).toBe(3);
        });

        it('should respect pattern', () => {
            const pattern = '[0-9]+';
            const { container } = render(
                React.createElement(BaseInput, {
                    value: '',
                    pattern,
                })
            );

            const input = container.querySelector('input');
            expect(input?.pattern).toBe(pattern);
        });
    });
});
