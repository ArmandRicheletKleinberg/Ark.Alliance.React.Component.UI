/**
 * @fileoverview DigitalGauge Component
 * @module components/Gauges/DigitalGauge
 * 
 * Segment-display style digital counter with trend indicator.
 * Used for displaying PnL, balance, and numeric metrics.
 */

import { forwardRef, memo, useMemo } from 'react';
import { useGauge, type UseGaugeOptions } from '../Gauge.viewmodel';
import './DigitalGauge.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type TrendDirection = 'up' | 'down' | 'neutral';
export type DigitalGaugeColor = 'green' | 'red' | 'blue' | 'cyan' | 'white' | 'auto';

export interface DigitalGaugeProps extends Omit<UseGaugeOptions, 'color'> {
    /** Display color (auto = based on value sign) */
    color?: DigitalGaugeColor;
    /** Prefix for positive values (default: '+') */
    prefix?: string;
    /** Suffix after value (e.g., '%', 'USDT') */
    suffix?: string;
    /** Show trend indicator arrow */
    showTrend?: boolean;
    /** Force trend direction (auto-calculated if not set) */
    trend?: TrendDirection;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COLOR CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const colorClasses: Record<Exclude<DigitalGaugeColor, 'auto'>, string> = {
    green: 'ark-digital-gauge--green',
    red: 'ark-digital-gauge--red',
    blue: 'ark-digital-gauge--blue',
    cyan: 'ark-digital-gauge--cyan',
    white: 'ark-digital-gauge--white',
};

const SIZE_CLASSES = {
    sm: { value: 'ark-digital-gauge__value--sm', label: 'ark-digital-gauge__label--sm' },
    md: { value: 'ark-digital-gauge__value--md', label: 'ark-digital-gauge__label--md' },
    lg: { value: 'ark-digital-gauge__value--lg', label: 'ark-digital-gauge__label--lg' },
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DigitalGauge - Numeric display with trend indicator
 * 
 * @example
 * ```tsx
 * <DigitalGauge value={125.50} label="Balance" suffix="USDT" showTrend />
 * <DigitalGauge value={-45.30} label="PnL" color="auto" />
 * ```
 */
export const DigitalGauge = memo(forwardRef<HTMLDivElement, DigitalGaugeProps>(
    function DigitalGauge(props, ref) {
        const {
            color = 'auto',
            prefix = '+',
            suffix,
            showTrend = false,
            trend,
            className = '',
            ...gaugeOptions
        } = props;

        const vm = useGauge(gaugeOptions);

        // Determine color and trend based on value
        const displayColor = useMemo(() => {
            if (color !== 'auto') return color;
            return vm.model.value >= 0 ? 'green' : 'red';
        }, [color, vm.model.value]);

        const displayTrend: TrendDirection = useMemo(() => {
            if (trend) return trend;
            if (vm.model.value > 0) return 'up';
            if (vm.model.value < 0) return 'down';
            return 'neutral';
        }, [trend, vm.model.value]);

        // Format value
        const formattedValue = useMemo(() => {
            const absValue = Math.abs(vm.model.value);
            return absValue.toLocaleString('en-US', {
                minimumFractionDigits: vm.model.decimals,
                maximumFractionDigits: vm.model.decimals,
            });
        }, [vm.model.value, vm.model.decimals]);

        const sign = vm.model.value >= 0 ? prefix : '-';
        const sizeClass = SIZE_CLASSES[vm.model.size];
        const colorClass = colorClasses[displayColor];

        return (
            <div
                ref={ref}
                className={`ark-digital-gauge ${colorClass} ${className}`}
                data-testid={vm.model.testId}
            >
                <div className="ark-digital-gauge__row">
                    {/* Value Display */}
                    <div className="ark-digital-gauge__value-container">
                        <span className={`ark-digital-gauge__value ${sizeClass.value}`}>
                            {sign}{formattedValue}
                        </span>
                        {suffix && (
                            <span className="ark-digital-gauge__suffix">{suffix}</span>
                        )}
                    </div>

                    {/* Trend Indicator */}
                    {showTrend && (
                        <div className={`ark-digital-gauge__trend ark-digital-gauge__trend--${displayTrend}`}>
                            {displayTrend === 'up' && (
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            )}
                            {displayTrend === 'down' && (
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7 7L17 17M17 17H7M17 17V7" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            )}
                            {displayTrend === 'neutral' && (
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            )}
                        </div>
                    )}
                </div>

                {/* Label */}
                <div className={`ark-digital-gauge__label ${sizeClass.label}`}>
                    {vm.model.label}
                </div>
            </div>
        );
    }
));

DigitalGauge.displayName = 'DigitalGauge';

export default DigitalGauge;
