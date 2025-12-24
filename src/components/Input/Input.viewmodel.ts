/**
 * @fileoverview Input Component ViewModel
 * @module components/Input
 * 
 * Business logic and state management for the Input component.
 */

import { useCallback, useMemo, useState } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import type { InputModel } from './Input.model';
import {
    defaultInputModel,
    InputModelSchema,
} from './Input.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input ViewModel options
 */
export interface UseInputOptions extends Partial<InputModel> {
    /** Current value */
    value?: string;
    /** Change handler */
    onChange?: (value: string) => void;
    /** Focus handler */
    onFocus?: () => void;
    /** Blur handler */
    onBlur?: () => void;
    /** Dark mode styling */
    isDark?: boolean;
}

/**
 * Input ViewModel return type
 */
export interface UseInputResult extends BaseViewModelResult<InputModel> {
    /** Current value */
    value: string;
    /** Is focused */
    isFocused: boolean;
    /** Has error */
    hasError: boolean;
    /** Handle value change */
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Handle focus */
    handleFocus: () => void;
    /** Handle blur */
    handleBlur: () => void;
    /** Computed input classes */
    inputClasses: string;
    /** Computed wrapper classes */
    wrapperClasses: string;
    /** Input styles */
    inputStyles: React.CSSProperties;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input ViewModel hook
 * 
 * @example
 * ```tsx
 * const vm = useInput({
 *   value: email,
 *   onChange: setEmail,
 *   label: 'Email',
 *   type: 'email',
 *   required: true,
 * });
 * ```
 */
export function useInput(options: UseInputOptions = {}): UseInputResult {
    const {
        value = '',
        onChange,
        onFocus,
        onBlur,
        isDark = true,
        ...modelData
    } = options;

    // Parse model options
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const modelOptions = useMemo(() => {
        return InputModelSchema.parse({ ...defaultInputModel, ...modelData });
    }, [JSON.stringify(modelData)]);

    // Use base ViewModel
    const base = useBaseViewModel<InputModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'input',
    });

    // Local state
    const [isFocused, setIsFocused] = useState(false);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════════════

    const hasError = !!base.model.error;

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        base.emit('change', { id: base.model.id, value: newValue });
        onChange?.(newValue);
    }, [base, onChange]);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
        base.emit('focus', { id: base.model.id });
        onFocus?.();
    }, [base, onFocus]);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        base.emit('blur', { id: base.model.id });
        onBlur?.();
    }, [base, onBlur]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED STYLES
    // ═══════════════════════════════════════════════════════════════════════

    const wrapperClasses = useMemo(() => {
        const classes = ['ark-input-wrapper'];
        if (base.model.fullWidth) classes.push('ark-input-wrapper--full-width');
        if (hasError) classes.push('ark-input-wrapper--error');
        if (base.model.className) classes.push(base.model.className);
        return classes.join(' ');
    }, [base.model.fullWidth, base.model.className, hasError]);

    const inputClasses = useMemo(() => {
        const classes = [
            'ark-input',
            `ark-input--${base.model.size}`,
            `ark-input--${base.model.variant}`,
        ];
        if (isFocused) classes.push('ark-input--focused');
        if (hasError) classes.push('ark-input--error');
        if (base.model.disabled) classes.push('ark-input--disabled');
        if (base.model.iconLeft) classes.push('ark-input--has-icon-left');
        if (base.model.iconRight) classes.push('ark-input--has-icon-right');
        return classes.join(' ');
    }, [base.model, isFocused, hasError]);

    const inputStyles: React.CSSProperties = useMemo(() => ({
        borderColor: hasError
            ? '#ef4444'
            : isFocused
                ? (isDark ? '#00d4ff' : '#3b82f6')
                : (isDark ? 'rgba(75, 85, 99, 1)' : 'rgba(209, 213, 219, 1)'),
    }), [hasError, isFocused, isDark]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        value,
        isFocused,
        hasError,
        handleChange,
        handleFocus,
        handleBlur,
        inputClasses,
        wrapperClasses,
        inputStyles,
    };
}

export default useInput;
