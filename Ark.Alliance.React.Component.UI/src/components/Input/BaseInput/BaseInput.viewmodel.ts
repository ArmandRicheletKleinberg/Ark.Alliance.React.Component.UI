/**
 * @fileoverview BaseInput Component ViewModel
 * @module components/Input/BaseInput
 * 
 * Business logic and state management for the BaseInput primitive component.
 * Serves as the foundation viewmodel for all input variants.
 */

import { useCallback, useMemo, useState } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { BaseInputModel } from './BaseInput.model';
import { defaultBaseInputModel, BaseInputModelSchema } from './BaseInput.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BaseInput ViewModel options
 */
export interface UseBaseInputOptions extends Partial<BaseInputModel> {
    /** Change handler */
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Focus handler */
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    /** Blur handler */
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * BaseInput ViewModel return type
 */
export interface UseBaseInputResult extends BaseViewModelResult<BaseInputModel> {
    /** Current input value */
    value: string;
    /** Handle input change */
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Handle focus */
    handleFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    /** Handle blur */
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    /** Set focus state */
    setIsFocused: (focused: boolean) => void;
    /** Computed input class names */
    inputClasses: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BaseInput ViewModel hook
 * 
 * @example
 * ```tsx
 * const vm = useBaseInput({
 *   value: text,
 *   onChange: setText,
 *   size: 'md',
 *   variant: 'default',
 * });
 * ```
 */
export function useBaseInput(options: UseBaseInputOptions): UseBaseInputResult {
    const { onChange, onFocus, onBlur, ...modelData } = options;

    // Parse model options
    const modelOptions = useMemo(() => {
        return BaseInputModelSchema.parse({ ...defaultBaseInputModel, ...modelData });
    }, [modelData.value, modelData.size, modelData.variant, modelData.hasError,
    modelData.isFocused, modelData.fullWidth, modelData.disabled]);

    // Use base ViewModel
    const base = useBaseViewModel<BaseInputModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'baseinput',
    });

    // Local focus state (can be overridden by model)
    const [localFocused, setLocalFocused] = useState(false);

    // Use model's focus state if provided, otherwise use local state
    const isFocused = base.model.isFocused ?? localFocused;

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        base.updateModel({ value: newValue } as Partial<BaseInputModel>);
        onChange?.(e);
    }, [base, onChange]);

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        setLocalFocused(true);
        base.updateModel({ isFocused: true } as Partial<BaseInputModel>);
        onFocus?.(e);
    }, [base, onFocus]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        setLocalFocused(false);
        base.updateModel({ isFocused: false } as Partial<BaseInputModel>);
        onBlur?.(e);
    }, [base, onBlur]);

    const setIsFocused = useCallback((focused: boolean) => {
        setLocalFocused(focused);
        base.updateModel({ isFocused: focused } as Partial<BaseInputModel>);
    }, [base]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED STYLES
    // ═══════════════════════════════════════════════════════════════════════

    const inputClasses = useMemo(() => {
        const classes = [
            'ark-base-input',
            `ark-base-input--${base.model.size}`,
            `ark-base-input--${base.model.variant}`,
        ];

        if (base.model.hasError) classes.push('ark-base-input--error');
        if (isFocused) classes.push('ark-base-input--focused');
        if (base.model.fullWidth) classes.push('ark-base-input--full-width');
        if (base.model.disabled) classes.push('ark-base-input--disabled');
        if (base.model.readOnly) classes.push('ark-base-input--readonly');
        if (base.model.className) classes.push(base.model.className);

        return classes.join(' ');
    }, [base.model, isFocused]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        value: base.model.value,
        handleChange,
        handleFocus,
        handleBlur,
        setIsFocused,
        inputClasses,
    };
}

export default useBaseInput;
