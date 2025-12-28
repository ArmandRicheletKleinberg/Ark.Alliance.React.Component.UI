/**
 * @fileoverview Input Component ViewModel
 * @module components/Input
 * 
 * Business logic and state management for the Input component.
 * Includes input restriction handling for copy/paste/cut control.
 */

import { useCallback, useMemo, useState } from 'react';
import {
    useBaseViewModel,
    useFormInputRestrictions,
    type BaseViewModelResult,
} from '../../../../core/base';
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
    /** Input restriction props (spread on input element) */
    restrictionProps: {
        onCopy: (event: React.ClipboardEvent) => void;
        onCut: (event: React.ClipboardEvent) => void;
        onPaste: (event: React.ClipboardEvent) => void;
        onDrop: (event: React.DragEvent) => void;
        onDragOver: (event: React.DragEvent) => void;
        'data-restrictions-active'?: boolean;
    };
    /** Current restriction message (if action was blocked) */
    restrictionMessage: string | null;
    /** Whether restrictions are active */
    hasRestrictions: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input ViewModel hook
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const vm = useInput({
 *   value: email,
 *   onChange: setEmail,
 *   label: 'Email',
 *   type: 'email',
 *   required: true,
 * });
 * 
 * // With input restrictions
 * const vm = useInput({
 *   value: pin,
 *   onChange: setPin,
 *   label: 'PIN Code',
 *   inputRestriction: InputRestrictionPresets.numericOnly,
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

    // Parse model options with explicit dependencies for proper memoization
    const modelOptions = useMemo(() => {
        return InputModelSchema.parse({ ...defaultInputModel, ...modelData });
    }, [
        modelData.type,
        modelData.size,
        modelData.variant,
        modelData.placeholder,
        modelData.label,
        modelData.required,
        modelData.error,
        modelData.helperText,
        modelData.maxLength,
        modelData.pattern,
        modelData.iconLeft,
        modelData.iconRight,
        modelData.fullWidth,
        modelData.disabled,
        modelData.loading,
        modelData.testId,
        modelData.className,
        modelData.inputRestriction,
        modelData.name,
        modelData.readOnly,
        modelData.autoComplete,
    ]);

    // Use base ViewModel
    const base = useBaseViewModel<InputModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'input',
    });

    // Local state
    const [isFocused, setIsFocused] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    // Handle sanitized paste - appends sanitized text to current value
    const handleSanitizedPaste = useCallback((sanitizedText: string) => {
        const newValue = localValue + sanitizedText;
        setLocalValue(newValue);
        onChange?.(newValue);
    }, [localValue, onChange]);

    // Input restriction handling
    const {
        restrictionProps,
        restrictionMessage,
        hasRestrictions,
    } = useFormInputRestrictions(base.model.inputRestriction, handleSanitizedPaste);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════════════

    const hasError = !!base.model.error;

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
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
        if (hasRestrictions) classes.push('ark-input-wrapper--restricted');
        if (base.model.className) classes.push(base.model.className);
        return classes.join(' ');
    }, [base.model.fullWidth, base.model.className, hasError, hasRestrictions]);

    const inputClasses = useMemo(() => {
        const classes = [
            'ark-input',
            `ark-input--${base.model.size}`,
            `ark-input--${base.model.variant}`,
        ];
        if (isFocused) classes.push('ark-input--focused');
        if (hasError) classes.push('ark-input--error');
        if (base.model.disabled) classes.push('ark-input--disabled');
        if (base.model.readOnly) classes.push('ark-input--readonly');
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
        restrictionProps,
        restrictionMessage,
        hasRestrictions,
    };
}

export default useInput;
