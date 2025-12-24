/**
 * @fileoverview SpeedometerGauge Component
 * @module components/Gauges/SpeedometerGauge
 * 
 * Speedometer-style gauge with needle indicator.
 */

import { forwardRef, memo } from 'react';
import { useGauge, type UseGaugeOptions } from '../Gauge.viewmodel';
import './SpeedometerGauge.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SpeedometerGaugeProps extends UseGaugeOptions {
    /** Dark mode styling */
    isDark?: boolean;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * SpeedometerGauge - Needle-style speedometer gauge
 * 
 * Features:
 * - Animated needle indicator
 * - Tick marks with color zones
 * - Neon glow effects
 * - Auto-color based on value
 * 
 * @example
 * ```tsx
 * <SpeedometerGauge value={75} max={100} label="CPU" />
 * <SpeedometerGauge value={42} max={100} label="Memory" autoColor />
 * ```
 */
export const SpeedometerGauge = memo(forwardRef<HTMLDivElement, SpeedometerGaugeProps>(
    function SpeedometerGauge(props, ref) {
        const { className = '', isDark = true, ...gaugeOptions } = props;

        const vm = useGauge({ ...gaugeOptions, isDark });
        const { speedometerConfig: cfg, colorConfig } = vm;

        // Theme-aware colors
        const labelTextColor = isDark ? 'text-gray-300' : 'text-gray-700';
        const subLabelTextColor = isDark ? 'text-gray-500' : 'text-gray-500';
        const trackColor = isDark ? 'rgba(100,100,100,0.15)' : 'rgba(150,150,150,0.25)';
        const centerDotColor = isDark ? '#0a0e27' : '#f8fafc';

        // Generate tick marks
        const ticks = [];
        for (let i = 0; i < 18; i++) {
            const angle = -135 + i * (270 / 17);
            const rad = (angle * Math.PI) / 180;
            const isMajor = i % 3 === 0;
            const len = isMajor ? 8 : 4;
            const x1 = cfg.center + (cfg.radius - len) * Math.cos(rad);
            const y1 = cfg.center + (cfg.radius - len) * Math.sin(rad);
            const x2 = cfg.center + cfg.radius * Math.cos(rad);
            const y2 = cfg.center + cfg.radius * Math.sin(rad);
            const pct = (i / 17) * 100;
            const tc = pct > 90 ? '#ef4444' : pct > 75 ? '#f59e0b' : pct > 50 ? '#00d4ff' : '#10b981';
            ticks.push(
                <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={tc}
                    strokeWidth={isMajor ? 2 : 1}
                    opacity={isMajor ? 0.9 : 0.4}
                />
            );
        }

        return (
            <div
                ref={ref}
                className={`ark-speedometer-gauge ${className}`}
                data-testid={vm.model.testId}
            >
                <div style={{ width: cfg.size, height: cfg.size - 18 }}>
                    <svg
                        width={cfg.size}
                        height={cfg.size}
                        style={{ overflow: 'visible', marginTop: -10 }}
                    >
                        {/* Track arc */}
                        <path
                            d={`M ${cfg.center - cfg.radius} ${cfg.center} A ${cfg.radius} ${cfg.radius} 0 1 1 ${cfg.center + cfg.radius} ${cfg.center}`}
                            fill="none"
                            stroke={trackColor}
                            strokeWidth={3}
                            transform={`rotate(-45, ${cfg.center}, ${cfg.center})`}
                        />

                        {/* Tick marks */}
                        {ticks}

                        {/* Needle glow */}
                        <line
                            x1={cfg.center}
                            y1={cfg.center}
                            x2={cfg.tipX}
                            y2={cfg.tipY}
                            stroke={colorConfig.glow}
                            strokeWidth={4}
                            filter="blur(3px)"
                        />

                        {/* Needle */}
                        <line
                            x1={cfg.center}
                            y1={cfg.center}
                            x2={cfg.tipX}
                            y2={cfg.tipY}
                            stroke={colorConfig.start}
                            strokeWidth={2.5}
                            style={{ filter: `drop-shadow(0 0 5px ${colorConfig.glow})` }}
                        />

                        {/* Center circle */}
                        <circle
                            cx={cfg.center}
                            cy={cfg.center}
                            r={5}
                            fill={colorConfig.start}
                            style={{ filter: `drop-shadow(0 0 6px ${colorConfig.glow})` }}
                        />
                        <circle
                            cx={cfg.center}
                            cy={cfg.center}
                            r={2.5}
                            fill={centerDotColor}
                        />
                    </svg>
                </div>

                {/* Value and labels */}
                <div className="ark-speedometer-gauge__info">
                    <div
                        className="ark-speedometer-gauge__value"
                        style={{
                            color: colorConfig.start,
                            textShadow: isDark ? `0 0 12px ${colorConfig.glow}` : 'none'
                        }}
                    >
                        {vm.displayValue}{vm.model.unit || '%'}
                    </div>
                    <div className={`ark-speedometer-gauge__label ${labelTextColor}`}>
                        {vm.model.label}
                    </div>
                    {vm.model.subLabel && (
                        <div className={`ark-speedometer-gauge__sublabel ${subLabelTextColor}`}>
                            {vm.model.subLabel}
                        </div>
                    )}
                </div>
            </div>
        );
    }
));

SpeedometerGauge.displayName = 'SpeedometerGauge';

export default SpeedometerGauge;
