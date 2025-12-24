/**
 * @fileoverview NumericInput Component ViewModel
 * @module components/Input/NumericInput
 */

import { useMemo, useCallback } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { NumericInputModel } from './NumericInput.model';
import { NumericInputModelSchema, defaultNumericInputModel } from './NumericInput.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseNumericInputOptions extends Partial<NumericInputModel> {
    value?: number;
    onChange?: (value: number) => void;
}

export interface UseNumericInputResult extends BaseViewModelResult<NumericInputModel> {
    /** Display value string */
    displayValue: string;
    /** Handle direct input change */
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Increment value */
    increment: () => void;
    /** Decrement value */
    decrement: () => void;
    /** Can increment */
    canIncrement: boolean;
    /** Can decrement */
    canDecrement: boolean;
    /** Wrapper classes */
    wrapperClasses: string;
    /** Input classes */
    inputClasses: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useNumericInput(options: UseNumericInputOptions): UseNumericInputResult {
    const { onChange, ...modelData } = options;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const modelOptions = useMemo(() => {
        return NumericInputModelSchema.parse({ ...defaultNumericInputModel, ...modelData });
    }, [JSON.stringify(modelData)]);

    const base = useBaseViewModel<NumericInputModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'numericinput',
    });

    // Display value
    const displayValue = useMemo(() => {
        return base.model.value.toFixed(base.model.decimals);
    }, [base.model.value, base.model.decimals]);

    // Can increment/decrement
    const canIncrement = useMemo(() => {
        if (base.model.max === undefined) return true;
        return base.model.value + base.model.step <= base.model.max;
    }, [base.model.value, base.model.step, base.model.max]);

    const canDecrement = useMemo(() => {
        if (base.model.min === undefined) return true;
        return base.model.value - base.model.step >= base.model.min;
    }, [base.model.value, base.model.step, base.model.min]);

    // Clamp value to min/max
    const clampValue = useCallback((val: number) => {
        let clamped = val;
        if (base.model.min !== undefined) clamped = Math.max(clamped, base.model.min);
        if (base.model.max !== undefined) clamped = Math.min(clamped, base.model.max);
        return clamped;
    }, [base.model.min, base.model.max]);

    // Change handler
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val)) {
            const clamped = clampValue(val);
            base.emit('change', { id: base.model.id, value: clamped });
            onChange?.(clamped);
        }
    }, [base, onChange, clampValue]);

    // Increment
    const increment = useCallback(() => {
        if (!canIncrement || base.model.disabled) return;
        const newVal = clampValue(base.model.value + base.model.step);
        base.emit('change', { id: base.model.id, value: newVal });
        onChange?.(newVal);
    }, [base, onChange, canIncrement, clampValue]);

    // Decrement
    const decrement = useCallback(() => {
        if (!canDecrement || base.model.disabled) return;
        const newVal = clampValue(base.model.value - base.model.step);
        base.emit('change', { id: base.model.id, value: newVal });
        onChange?.(newVal);
    }, [base, onChange, canDecrement, clampValue]);

    // Classes
    const wrapperClasses = useMemo(() => {
        const classes = [
            'ark-numeric',
            `ark-numeric--${base.model.variant}`,
            `ark-numeric--${base.model.size}`,
            base.model.isDark ? 'ark-numeric--dark' : 'ark-numeric--light',
        ];
        if (base.model.disabled) classes.push('ark-numeric--disabled');
        return classes.join(' ');
    }, [base.model]);

    const inputClasses = useMemo(() => {
        return 'ark-numeric__input';
    }, []);

    return {
        ...base,
        displayValue,
        handleChange,
        increment,
        decrement,
        canIncrement,
        canDecrement,
        wrapperClasses,
        inputClasses,
    };
}

export default useNumericInput;
