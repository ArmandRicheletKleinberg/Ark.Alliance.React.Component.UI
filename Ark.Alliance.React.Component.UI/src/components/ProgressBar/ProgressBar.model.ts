/**
 * @fileoverview ProgressBar Component Model
 * @module components/ProgressBar
 * 
 * Defines the data structure, validation, and defaults for the ProgressBar component.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Progress bar size variants
 */
export const ProgressBarSize = z.enum(['xs', 'sm', 'md', 'lg']);

/**
 * Progress bar visual variants
 */
export const ProgressBarVariant = z.enum(['default', 'neon', 'gradient', 'striped']);

/**
 * Progress bar color options
 */
export const ProgressBarColor = z.enum(['blue', 'green', 'red', 'cyan', 'purple', 'yellow']);

/**
 * Color zone for dynamic coloring based on percentage
 */
export const ColorZoneSchema = z.object({
    threshold: z.number().min(0).max(100),
    color: ProgressBarColor,
});

/**
 * ProgressBar model schema extending base model
 */
export const ProgressBarModelSchema = extendSchema({
    /** Current value */
    value: z.number().min(0).default(0),

    /** Maximum value */
    max: z.number().min(1).default(100),

    /** Label text */
    label: z.string().optional(),

    /** Show raw value */
    showValue: z.boolean().default(false),

    /** Show percentage */
    showPercentage: z.boolean().default(false),

    /** Size variant */
    size: ProgressBarSize.default('md'),

    /** Visual variant */
    variant: ProgressBarVariant.default('default'),

    /** Color */
    color: ProgressBarColor.default('cyan'),

    /** Whether to animate the progress bar */
    animated: z.boolean().default(false),

    /** Indeterminate mode (loading state) */
    indeterminate: z.boolean().default(false),

    /** Dark mode */
    isDark: z.boolean().default(true),

    /** Color zones for dynamic color based on percentage */
    colorZones: z.array(ColorZoneSchema).optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type ProgressBarSizeType = z.infer<typeof ProgressBarSize>;
export type ProgressBarVariantType = z.infer<typeof ProgressBarVariant>;
export type ProgressBarColorType = z.infer<typeof ProgressBarColor>;
export type ColorZone = z.infer<typeof ColorZoneSchema>;
export type ProgressBarModel = z.infer<typeof ProgressBarModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default ProgressBar model values
 */
export const defaultProgressBarModel: ProgressBarModel = {
    value: 0,
    max: 100,
    label: undefined,
    showValue: false,
    showPercentage: false,
    size: 'md',
    variant: 'default',
    color: 'cyan',
    animated: false,
    indeterminate: false,
    isDark: true,
    disabled: false,
    loading: false,
    clickable: false,
    doubleClickable: false,
    draggable: false,
    droppable: false,
    mouseOverEnabled: false,
    mouseMoveEnabled: false,
    mouseEnterEnabled: false,
    focusable: false,
    tooltipPosition: 'top',
    tooltipDelay: 300,
};

/**
 * Create a ProgressBar model with custom values
 */
export function createProgressBarModel(data: Partial<ProgressBarModel>): ProgressBarModel {
    return ProgressBarModelSchema.parse(data);
}
