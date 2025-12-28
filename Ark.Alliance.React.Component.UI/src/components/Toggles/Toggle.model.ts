/**
 * @fileoverview Toggle Component Model
 * @module components/Toggles/Toggle
 * 
 * Defines the data structure, validation, and defaults for the Toggle component.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';
import { BasicSizeSchema, HorizontalPositionSchema, type BasicSize, type HorizontalPosition } from '../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Toggle size variants
 * @deprecated Use BasicSizeSchema from '@core/enums' instead
 */
export const ToggleSize = BasicSizeSchema;

/**
 * Toggle model schema extending base model
 */
export const ToggleModelSchema = extendSchema({
    /** Current checked state */
    checked: z.boolean().default(false),

    /** Color when ON (CSS color value) */
    onColor: z.string().default('#10b981'),

    /** Color when OFF (CSS color value) */
    offColor: z.string().default('#4b5563'),

    /** Track background color */
    backgroundColor: z.string().default('rgba(30, 41, 59, 0.8)'),

    /** Size of the toggle */
    size: BasicSizeSchema.default('md'),

    /** Optional label text */
    label: z.string().optional(),

    /** Label position relative to toggle */
    labelPosition: HorizontalPositionSchema.default('right'),

    /** Label shown when toggle is ON (e.g., "ENABLED") */
    onLabel: z.string().optional(),

    /** Label shown when toggle is OFF (e.g., "DISABLED") */
    offLabel: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type ToggleSizeType = BasicSize;
export type ToggleModel = z.infer<typeof ToggleModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// SIZE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Size configuration for toggle dimensions
 */
export const TOGGLE_SIZE_CONFIG = {
    sm: { width: 36, height: 20, knob: 14, translate: 16 },
    md: { width: 48, height: 26, knob: 20, translate: 22 },
    lg: { width: 60, height: 32, knob: 26, translate: 28 },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default toggle model values
 */
export const defaultToggleModel: ToggleModel = ToggleModelSchema.parse({});

/**
 * Create a toggle model with custom values
 */
export function createToggleModel(data: Partial<ToggleModel> = {}): ToggleModel {
    return ToggleModelSchema.parse(data);
}
