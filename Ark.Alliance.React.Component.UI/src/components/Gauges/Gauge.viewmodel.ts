/**
 * @fileoverview Gauge Component ViewModel
 * @module components/Gauges/Gauge
 * 
 * Business logic and computed values for gauge components.
 */

import { useMemo, useEffect, useRef } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import { GAUGE_COLORS, type GaugeColorType } from '../../core/constants';
import type { GaugeModel } from './Gauge.model';
import {
    defaultGaugeModel,
    GaugeModelSchema,
    CIRCULAR_GAUGE_SIZE_CONFIG,
    SPEEDOMETER_SIZE_CONFIG,
    getAutoColor,
} from './Gauge.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gauge ViewModel options
 */
export interface UseGaugeOptions extends Partial<GaugeModel> {
    /** Label is required for gauges */
    label: string;
    /** Dark mode flag for styling */
    isDark?: boolean;
    /** Callback when animation completes (after value change) */
    onAnimationEnd?: (value: number) => void;
    /** Callback when value crosses a threshold */
    onThresholdReached?: (threshold: number, direction: 'up' | 'down') => void;
    /** Thresholds to monitor for callbacks */
    thresholds?: number[];
    /** Animation duration in ms (for callback timing) */
    animationDuration?: number;
}

/**
 * Gauge ViewModel return type
 */
export interface UseGaugeResult extends BaseViewModelResult<GaugeModel> {
    /** Percentage (0-100) */
    percentage: number;
    /** Display value (formatted with decimals and percentage if needed) */
    displayValue: string;
    /** Color configuration (start, end, glow) */
    colorConfig: typeof GAUGE_COLORS[keyof typeof GAUGE_COLORS];
    /** Effective color (auto-calculated or specified) */
    effectiveColor: GaugeColorType;
    /** Circular gauge SVG dimensions and calculations */
    circularConfig: {
        svgSize: number;
        strokeWidth: number;
        radius: number;
        circumference: number;
        strokeDashoffset: number;
        fontSize: string;
    };
    /** Speedometer gauge SVG dimensions */
    speedometerConfig: {
        size: number;
        center: number;
        radius: number;
        needleAngle: number;
        needleLength: number;
        tipX: number;
        tipY: number;
    };
    /** Is currently animating */
    isAnimating: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gauge ViewModel hook
 * 
 * Provides computed values for both circular and speedometer gauges.
 * 
 * @example
 * ```tsx
 * const vm = useGauge({
 *   value: 75,
 *   max: 100,
 *   label: 'CPU Usage',
 *   color: 'blue',
 *   onAnimationEnd: (value) => console.log('Animated to:', value),
 *   onThresholdReached: (threshold, dir) => console.log(`Crossed ${threshold} going ${dir}`),
 *   thresholds: [25, 50, 75],
 * });
 * ```
 */
export function useGauge(options: UseGaugeOptions): UseGaugeResult {
    const {
        isDark = true,
        onAnimationEnd,
        onThresholdReached,
        thresholds = [],
        animationDuration = 500,
        ...modelData
    } = options;

    // Track previous value for threshold detection
    const prevValueRef = useRef<number | null>(null);
    const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isAnimatingRef = useRef(false);

    // Parse model options
    const modelOptions = useMemo(() => {
        return GaugeModelSchema.parse({ ...defaultGaugeModel, ...modelData });
    }, [modelData]);

    // Use base ViewModel
    const base = useBaseViewModel<GaugeModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'gauge',
    });

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════════════

    const percentage = useMemo(() => {
        const range = base.model.max - base.model.min;
        if (range === 0) return 0;
        return Math.min(Math.max(((base.model.value - base.model.min) / range) * 100, 0), 100);
    }, [base.model.value, base.model.min, base.model.max]);

    const effectiveColor = useMemo((): GaugeColorType => {
        if (base.model.autoColor) {
            return getAutoColor(
                percentage,
                base.model.warningThreshold,
                base.model.dangerThreshold
            );
        }
        return base.model.color;
    }, [base.model.autoColor, base.model.color, percentage, base.model.warningThreshold, base.model.dangerThreshold]);

    const colorConfig = useMemo(() => {
        return GAUGE_COLORS[effectiveColor];
    }, [effectiveColor]);

    const displayValue = useMemo(() => {
        if (base.model.showPercentage) {
            return `${percentage.toFixed(0)}%`;
        }
        return base.model.value.toFixed(base.model.decimals);
    }, [base.model.value, base.model.showPercentage, base.model.decimals, percentage]);

    // Circular gauge calculations
    const circularConfig = useMemo(() => {
        const sizeConfig = CIRCULAR_GAUGE_SIZE_CONFIG[base.model.size];
        const svgSize = sizeConfig.size;
        const strokeWidth = sizeConfig.stroke;
        const radius = (svgSize - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return {
            svgSize,
            strokeWidth,
            radius,
            circumference,
            strokeDashoffset,
            fontSize: sizeConfig.fontSize,
        };
    }, [base.model.size, percentage]);

    // Speedometer gauge calculations
    const speedometerConfig = useMemo(() => {
        const sizeConfig = SPEEDOMETER_SIZE_CONFIG[base.model.size];
        const size = sizeConfig.size;
        const center = size / 2;
        const radius = sizeConfig.radius;
        const needleAngle = -135 + (percentage / 100) * 270;
        const needleLength = radius - 15;
        const radians = (needleAngle * Math.PI) / 180;
        const tipX = center + needleLength * Math.cos(radians);
        const tipY = center + needleLength * Math.sin(radians);

        return {
            size,
            center,
            radius,
            needleAngle,
            needleLength,
            tipX,
            tipY,
        };
    }, [base.model.size, percentage]);

    // ═══════════════════════════════════════════════════════════════════════
    // ANIMATION CALLBACKS
    // ═══════════════════════════════════════════════════════════════════════

    // Track value changes and trigger callbacks
    useEffect(() => {
        const currentValue = base.model.value;
        const prevValue = prevValueRef.current;

        // Skip on initial render
        if (prevValue === null) {
            prevValueRef.current = currentValue;
            return;
        }

        // Value changed - start animation tracking
        if (prevValue !== currentValue) {
            isAnimatingRef.current = true;

            // Clear any existing timer
            if (animationTimerRef.current) {
                clearTimeout(animationTimerRef.current);
            }

            // Check threshold crossings
            if (onThresholdReached && thresholds.length > 0) {
                for (const threshold of thresholds) {
                    // Crossed going up
                    if (prevValue < threshold && currentValue >= threshold) {
                        onThresholdReached(threshold, 'up');
                    }
                    // Crossed going down
                    if (prevValue > threshold && currentValue <= threshold) {
                        onThresholdReached(threshold, 'down');
                    }
                }
            }

            // Set timer for animation end callback
            if (onAnimationEnd) {
                animationTimerRef.current = setTimeout(() => {
                    isAnimatingRef.current = false;
                    onAnimationEnd(currentValue);
                }, animationDuration);
            } else {
                animationTimerRef.current = setTimeout(() => {
                    isAnimatingRef.current = false;
                }, animationDuration);
            }

            prevValueRef.current = currentValue;
        }

        // Cleanup
        return () => {
            if (animationTimerRef.current) {
                clearTimeout(animationTimerRef.current);
            }
        };
    }, [base.model.value, onAnimationEnd, onThresholdReached, thresholds, animationDuration]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        percentage,
        displayValue,
        colorConfig,
        effectiveColor,
        circularConfig,
        speedometerConfig,
        isAnimating: isAnimatingRef.current,
    };
}

export default useGauge;

