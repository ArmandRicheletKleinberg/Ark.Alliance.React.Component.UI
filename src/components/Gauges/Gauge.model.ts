/**
 * @fileoverview Gauge Component Model
 * @module components/Gauges/Gauge
 * 
 * Defines the data structure, validation, and defaults for gauge components.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';
import { GAUGE_COLORS, type GaugeColorType } from '../../core/constants';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gauge color variants
 */
export const GaugeColor = z.enum(['blue', 'green', 'red', 'cyan', 'yellow', 'purple']);

/**
 * Gauge size variants
 */
export const GaugeSize = z.enum(['sm', 'md', 'lg']);

/**
 * Gauge model schema extending base model
 */
export const GaugeModelSchema = extendSchema({
    /** Current value */
    value: z.number().default(0),

    /** Minimum value */
    min: z.number().default(0),

    /** Maximum value */
    max: z.number().default(100),

    /** Primary label */
    label: z.string(),

    /** Optional unit suffix (e.g., '%', 'MB', 'ms') */
    unit: z.string().optional(),

    /** Secondary label below the gauge */
    subLabel: z.string().optional(),

    /** Color theme */
    color: GaugeColor.default('blue'),

    /** Size variant */
    size: GaugeSize.default('md'),

    /** Show percentage instead of value */
    showPercentage: z.boolean().default(false),

    /** Decimal places for value display */
    decimals: z.number().min(0).max(4).default(0),

    /** Auto-calculate color based on value thresholds */
    autoColor: z.boolean().default(false),

    /** Warning threshold (percentage) */
    warningThreshold: z.number().min(0).max(100).default(75),

    /** Danger threshold (percentage) */
    dangerThreshold: z.number().min(0).max(100).default(90),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type GaugeColorEnum = z.infer<typeof GaugeColor>;
export type GaugeSizeType = z.infer<typeof GaugeSize>;
export type GaugeModel = z.infer<typeof GaugeModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// SIZE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Size configuration for circular gauges
 */
export const CIRCULAR_GAUGE_SIZE_CONFIG = {
    sm: { size: 80, stroke: 6, fontSize: 'text-lg' },
    md: { size: 120, stroke: 8, fontSize: 'text-2xl' },
    lg: { size: 160, stroke: 10, fontSize: 'text-3xl' },
} as const;

/**
 * Size configuration for speedometer gauges
 */
export const SPEEDOMETER_SIZE_CONFIG = {
    sm: { size: 100, radius: 40 },
    md: { size: 140, radius: 55 },
    lg: { size: 180, radius: 70 },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get auto-calculated color based on percentage value
 */
export function getAutoColor(
    percentage: number,
    warningThreshold: number,
    dangerThreshold: number
): GaugeColorType {
    if (percentage >= dangerThreshold) return 'red';
    if (percentage >= warningThreshold) return 'yellow';
    if (percentage > 50) return 'cyan';
    return 'green';
}

/**
 * Get color configuration for a gauge
 */
export function getGaugeColorConfig(color: GaugeColorType) {
    return GAUGE_COLORS[color];
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default gauge model values
 */
export const defaultGaugeModel: Omit<GaugeModel, 'label'> & { label?: string } = {
    value: 0,
    min: 0,
    max: 100,
    label: undefined,
    color: 'blue',
    size: 'md',
    showPercentage: false,
    decimals: 0,
    autoColor: false,
    warningThreshold: 75,
    dangerThreshold: 90,
    disabled: false,
    loading: false,
};

/**
 * Create a gauge model with custom values
 */
export function createGaugeModel(data: Partial<GaugeModel> & { label: string }): GaugeModel {
    return GaugeModelSchema.parse(data);
}
