/**
 * @fileoverview CircularGauge Component
 * @module components/Gauges/CircularGauge
 * 
 * Digital speedometer-style circular gauge with animated progress.
 */

import { forwardRef, memo, useMemo } from 'react';
import { useGauge, type UseGaugeOptions } from '../Gauge.viewmodel';
import './CircularGauge.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface CircularGaugeProps extends UseGaugeOptions {
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CircularGauge - SVG circle progress gauge
 * 
 * Features:
 * - Animated SVG progress arc
 * - Color gradients with glow effect
 * - Auto-color based on value thresholds
 * - Multiple size variants
 * 
 * @example
 * ```tsx
 * <CircularGauge value={75} max={100} label="CPU" color="blue" />
 * <CircularGauge value={42} max={100} label="Memory" unit="%" autoColor />
 * ```
 */
export const CircularGauge = memo(forwardRef<HTMLDivElement, CircularGaugeProps>(
    function CircularGauge(props, ref) {
        const { className = '', ...gaugeOptions } = props;

        const vm = useGauge(gaugeOptions);
        const { circularConfig: cfg, colorConfig } = vm;

        // Generate unique gradient ID
        const gradientId = useMemo(
            () => `gauge-gradient-${Math.random().toString(36).slice(2)}`,
            []
        );

        return (
            <div
                ref={ref}
                className={`ark-circular-gauge ${className}`}
                data-testid={vm.model.testId}
            >
                <div
                    className="ark-circular-gauge__svg-container"
                    style={{ width: cfg.svgSize, height: cfg.svgSize }}
                >
                    <svg
                        width={cfg.svgSize}
                        height={cfg.svgSize}
                        className="ark-circular-gauge__svg"
                    >
                        <defs>
                            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={colorConfig.start} />
                                <stop offset="100%" stopColor={colorConfig.end} />
                            </linearGradient>
                        </defs>

                        {/* Track */}
                        <circle
                            className="ark-circular-gauge__track"
                            cx={cfg.svgSize / 2}
                            cy={cfg.svgSize / 2}
                            r={cfg.radius}
                            strokeWidth={cfg.strokeWidth}
                        />

                        {/* Progress */}
                        <circle
                            className="ark-circular-gauge__progress"
                            cx={cfg.svgSize / 2}
                            cy={cfg.svgSize / 2}
                            r={cfg.radius}
                            strokeWidth={cfg.strokeWidth}
                            stroke={`url(#${gradientId})`}
                            strokeDasharray={cfg.circumference}
                            strokeDashoffset={cfg.strokeDashoffset}
                            style={{
                                filter: `drop-shadow(0 0 8px ${colorConfig.glow})`,
                            }}
                        />
                    </svg>

                    {/* Center Value */}
                    <div className="ark-circular-gauge__value">
                        <span
                            className={`ark-circular-gauge__number ${cfg.fontSize}`}
                            style={{ color: colorConfig.start }}
                        >
                            {vm.displayValue}
                        </span>
                        {vm.model.unit && (
                            <span className="ark-circular-gauge__unit">
                                {vm.model.unit}
                            </span>
                        )}
                    </div>
                </div>

                {/* Label */}
                <span className="ark-circular-gauge__label">
                    {vm.model.label}
                </span>
            </div>
        );
    }
));

CircularGauge.displayName = 'CircularGauge';

export default CircularGauge;
