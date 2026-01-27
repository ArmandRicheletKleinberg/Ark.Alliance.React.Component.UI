/**
 * @fileoverview SignalBarsGauge Component
 * @module components/Gauges/SignalBarsGauge
 * 
 * Smartphone-style network quality indicator with vertical bars.
 * Colors progress from green → blue → yellow → red based on value.
 */

import { forwardRef, memo, useMemo } from 'react';
import { useGauge, type UseGaugeOptions } from '../Gauge.viewmodel';
import './SignalBarsGauge.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SignalBarsGaugeProps extends UseGaugeOptions {
    /** Number of bars (4 or 5) */
    bars?: 4 | 5;
    /** Show percentage label */
    showLabel?: boolean;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const SIZE_CONFIG = {
    sm: { maxHeight: 14, barWidth: 3, gap: 2 },
    md: { maxHeight: 18, barWidth: 4, gap: 2 },
    lg: { maxHeight: 24, barWidth: 5, gap: 3 },
} as const;

const getColorForValue = (percentage: number): { fill: string; glow: string } => {
    if (percentage >= 90) return { fill: '#ef4444', glow: 'rgba(239, 68, 68, 0.6)' };
    if (percentage >= 70) return { fill: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)' };
    if (percentage >= 40) return { fill: '#00d4ff', glow: 'rgba(0, 212, 255, 0.6)' };
    return { fill: '#10b981', glow: 'rgba(16, 185, 129, 0.6)' };
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * SignalBarsGauge - Signal strength visualization
 * 
 * @example
 * ```tsx
 * <SignalBarsGauge value={75} max={100} label="Signal" bars={4} />
 * <SignalBarsGauge value={90} max={100} label="Quality" bars={5} showLabel />
 * ```
 */
export const SignalBarsGauge = memo(forwardRef<HTMLDivElement, SignalBarsGaugeProps>(
    function SignalBarsGauge(props, ref) {
        const {
            bars = 4,
            showLabel = true,
            className = '',
            ...gaugeOptions
        } = props;

        const vm = useGauge(gaugeOptions);
        const config = SIZE_CONFIG[vm.model.size];
        const colors = useMemo(() => getColorForValue(vm.percentage), [vm.percentage]);

        const { maxHeight, barWidth, gap } = config;
        const totalWidth = bars * barWidth + (bars - 1) * gap;
        const activeBars = Math.ceil((vm.percentage / 100) * bars);

        const getBarHeight = (index: number): number => {
            const minHeight = maxHeight * 0.3;
            const step = (maxHeight - minHeight) / (bars - 1);
            return minHeight + (index * step);
        };

        return (
            <div
                ref={ref}
                className={`ark-signal-bars-gauge ${className}`}
                data-testid={vm.model.testId}
            >
                <svg
                    width={totalWidth}
                    height={maxHeight}
                    viewBox={`0 0 ${totalWidth} ${maxHeight}`}
                    style={{ filter: `drop-shadow(0 0 2px ${colors.glow})` }}
                >
                    {Array.from({ length: bars }).map((_, i) => {
                        const isActive = i < activeBars;
                        const barHeight = getBarHeight(i);
                        const x = i * (barWidth + gap);
                        const y = maxHeight - barHeight;

                        return (
                            <rect
                                key={i}
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                rx={1}
                                fill={isActive ? colors.fill : 'rgba(100,100,100,0.25)'}
                                style={isActive ? {
                                    filter: `drop-shadow(0 0 2px ${colors.glow})`,
                                } : undefined}
                            />
                        );
                    })}
                </svg>

                {/* Percentage label */}
                {showLabel && (
                    <span
                        className="ark-signal-bars-gauge__label"
                        style={{ color: colors.fill }}
                    >
                        {vm.percentage.toFixed(0)}%
                    </span>
                )}
            </div>
        );
    }
));

SignalBarsGauge.displayName = 'SignalBarsGauge';

export default SignalBarsGauge;
