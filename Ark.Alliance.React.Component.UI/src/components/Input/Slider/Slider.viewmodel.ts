/**
 * @fileoverview Slider Component ViewModel
 * @module components/Input/Slider
 */

import { useMemo, useCallback } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { SliderModel } from './Slider.model';
import { SliderModelSchema, defaultSliderModel } from './Slider.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseSliderOptions extends Partial<SliderModel> {
    /** Current value */
    value?: number;
    /** Change handler */
    onChange?: (value: number) => void;
}

export interface UseSliderResult extends BaseViewModelResult<SliderModel> {
    /** Formatted display value */
    displayValue: string;
    /** Handle slider change */
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Computed track classes */
    trackClasses: string;
    /** Computed thumb classes */
    thumbClasses: string;
    /** Wrapper classes */
    wrapperClasses: string;
    /** Progress percentage (0-100) */
    progressPercent: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useSlider(options: UseSliderOptions): UseSliderResult {
    const { onChange, ...modelData } = options;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const modelOptions = useMemo(() => {
        return SliderModelSchema.parse({ ...defaultSliderModel, ...modelData });
    }, [JSON.stringify(modelData)]);

    const base = useBaseViewModel<SliderModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'slider',
    });

    // Progress percentage
    const progressPercent = useMemo(() => {
        const range = base.model.max - base.model.min;
        if (range === 0) return 0;
        return ((base.model.value - base.model.min) / range) * 100;
    }, [base.model.value, base.model.min, base.model.max]);

    // Display value with unit
    const displayValue = useMemo(() => {
        const val = base.model.value.toFixed(base.model.decimals);
        return base.model.unit ? `${val}${base.model.unit}` : val;
    }, [base.model.value, base.model.decimals, base.model.unit]);

    // Change handler
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        base.emit('change', { id: base.model.id, value: newValue });
        onChange?.(newValue);
    }, [base, onChange]);

    // Wrapper classes
    const wrapperClasses = useMemo(() => {
        const classes = [
            'ark-slider',
            `ark-slider--${base.model.variant}`,
            `ark-slider--${base.model.size}`,
            `ark-slider--${base.model.color}`,
            base.model.isDark ? 'ark-slider--dark' : 'ark-slider--light',
        ];
        if (base.model.disabled) classes.push('ark-slider--disabled');
        return classes.join(' ');
    }, [base.model]);

    // Track classes
    const trackClasses = useMemo(() => {
        return 'ark-slider__track';
    }, []);

    // Thumb classes
    const thumbClasses = useMemo(() => {
        return 'ark-slider__thumb';
    }, []);

    return {
        ...base,
        displayValue,
        handleChange,
        trackClasses,
        thumbClasses,
        wrapperClasses,
        progressPercent,
    };
}

export default useSlider;
