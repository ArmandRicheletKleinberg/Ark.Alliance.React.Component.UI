/**
 * @fileoverview ProgressBar Component ViewModel
 * @module components/ProgressBar
 * 
 * Business logic and state management for the ProgressBar component.
 */

import { useMemo } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import { useTheme } from '../../core/theme/useTheme';
import type { ProgressBarModel } from './ProgressBar.model';
import { defaultProgressBarModel, ProgressBarModelSchema } from './ProgressBar.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ProgressBar ViewModel options
 */
export interface UseProgressBarOptions extends Partial<ProgressBarModel> {
}

/**
 * ProgressBar ViewModel return type
 */
export interface UseProgressBarResult extends BaseViewModelResult<ProgressBarModel> {
    /** Computed percentage (0-100) */
    percentage: number;
    /** Effective color (accounting for zones) */
    effectiveColor: string;
    /** Size CSS class */
    sizeClass: string;
    /** Variant CSS class */
    variantClass: string;
    /** Color CSS class */
    colorClass: string;
    /** Theme CSS class */
    themeClass: string;
    /** State CSS classes */
    stateClasses: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ProgressBar ViewModel hook
 * 
 * @example
 * ```tsx
 * const vm = useProgressBar({
 *   value: 75,
 *   max: 100,
 *   showPercentage: true,
 *   variant: 'neon',
 * });
 * ```
 */
export function useProgressBar(options: UseProgressBarOptions = {}): UseProgressBarResult {
    // Parse model options with explicit dependencies for proper memoization
    const modelOptions = useMemo(() => {
        return ProgressBarModelSchema.parse({ ...defaultProgressBarModel, ...options });
    }, [
        options.value,
        options.max,
        options.label,
        options.showValue,
        options.showPercentage,
        options.size,
        options.variant,
        options.color,
        options.animated,
        options.indeterminate,
        options.isDark,
        options.disabled,
        options.loading,
        options.testId,
        options.colorZones,
    ]);

    // Use base ViewModel
    const base = useBaseViewModel<ProgressBarModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'progressbar',
    });

    const { resolvedMode } = useTheme();
    const isDark = base.model.isDark !== undefined ? base.model.isDark : resolvedMode === 'dark';

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════════════

    const percentage = useMemo(() => {
        return Math.min(100, Math.max(0, (base.model.value / base.model.max) * 100));
    }, [base.model.value, base.model.max]);

    // Calculate color based on zones if provided
    const effectiveColor = useMemo(() => {
        if (!base.model.colorZones || base.model.colorZones.length === 0) {
            return base.model.color;
        }
        // Find the zone that matches the current percentage
        const sortedZones = [...base.model.colorZones].sort((a, b) => b.threshold - a.threshold);
        const activeZone = sortedZones.find(zone => percentage >= zone.threshold);
        return activeZone?.color ?? base.model.color;
    }, [percentage, base.model.colorZones, base.model.color]);

    const sizeClass = `ark-progress--${base.model.size}`;
    const variantClass = `ark-progress--${base.model.variant}`;
    const colorClass = `ark-progress--${effectiveColor}`;
    const themeClass = isDark ? 'ark-progress--dark' : 'ark-progress--light';

    const stateClasses = [
        base.model.animated && 'ark-progress--animated',
        base.model.indeterminate && 'ark-progress--indeterminate',
    ].filter(Boolean).join(' ');

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        percentage,
        effectiveColor,
        sizeClass,
        variantClass,
        colorClass,
        themeClass,
        stateClasses,
    };
}

export default useProgressBar;
