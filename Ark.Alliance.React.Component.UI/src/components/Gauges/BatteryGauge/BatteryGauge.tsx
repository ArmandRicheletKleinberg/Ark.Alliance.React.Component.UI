/**
 * @fileoverview BatteryGauge Component
 * @module components/Gauges/BatteryGauge
 * 
 * Neon-style battery gauge showing usage percentage.
 * Colors progress from green → blue → yellow → red based on value.
 */

import { forwardRef, memo, useMemo } from 'react';
import { useGauge, type UseGaugeOptions } from '../Gauge.viewmodel';
import './BatteryGauge.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface BatteryGaugeProps extends UseGaugeOptions {
    /** Show percentage label next to gauge */
    showLabel?: boolean;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const SIZE_CONFIG = {
    sm: { width: 24, height: 12, tipWidth: 2, segments: 4, gap: 1 },
    md: { width: 36, height: 16, tipWidth: 3, segments: 5, gap: 1 },
    lg: { width: 48, height: 20, tipWidth: 4, segments: 6, gap: 1 },
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
 * BatteryGauge - SVG battery visualization
 * 
 * @example
 * ```tsx
 * <BatteryGauge value={75} max={100} label="Cache" showLabel />
 * <BatteryGauge value={25} max={100} label="Memory" size="md" />
 * ```
 */
export const BatteryGauge = memo(forwardRef<HTMLDivElement, BatteryGaugeProps>(
    function BatteryGauge(props, ref) {
        const { showLabel = true, className = '', ...gaugeOptions } = props;

        const vm = useGauge(gaugeOptions);
        const config = SIZE_CONFIG[vm.model.size];
        const colors = useMemo(() => getColorForValue(vm.percentage), [vm.percentage]);

        const { width, height, tipWidth, segments, gap } = config;
        const innerWidth = width - 3;
        const segmentWidth = (innerWidth - (segments - 1) * gap) / segments;
        const activeSegments = Math.ceil((vm.percentage / 100) * segments);

        return (
            <div
                ref={ref}
                className={`ark-battery-gauge ${className}`}
                data-testid={vm.model.testId}
            >
                <svg
                    width={width + tipWidth}
                    height={height}
                    viewBox={`0 0 ${width + tipWidth} ${height}`}
                    style={{ filter: `drop-shadow(0 0 3px ${colors.glow})` }}
                >
                    {/* Battery outline */}
                    <rect
                        x={0.5}
                        y={0.5}
                        width={width - 1}
                        height={height - 1}
                        rx={2}
                        ry={2}
                        fill="none"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth={1}
                    />

                    {/* Battery tip */}
                    <rect
                        x={width}
                        y={height * 0.25}
                        width={tipWidth}
                        height={height * 0.5}
                        rx={1}
                        fill="rgba(255,255,255,0.3)"
                    />

                    {/* Battery segments */}
                    {Array.from({ length: segments }).map((_, i) => {
                        const isActive = i < activeSegments;
                        const x = 2 + i * (segmentWidth + gap);

                        return (
                            <rect
                                key={i}
                                x={x}
                                y={2}
                                width={segmentWidth}
                                height={height - 4}
                                rx={1}
                                fill={isActive ? colors.fill : 'rgba(100,100,100,0.2)'}
                                style={isActive ? {
                                    filter: `drop-shadow(0 0 2px ${colors.glow})`,
                                } : undefined}
                            />
                        );
                    })}
                </svg>

                {/* Optional label */}
                {showLabel && (
                    <span className="ark-battery-gauge__label">
                        {vm.percentage.toFixed(0)}%
                    </span>
                )}
            </div>
        );
    }
));

BatteryGauge.displayName = 'BatteryGauge';

export default BatteryGauge;
