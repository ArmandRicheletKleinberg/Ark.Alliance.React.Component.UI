/**
 * @fileoverview Editable Cell Model
 * @module components/Grids/DataGrid/Cell
 * 
 * Type definitions and schemas for EditableCell component.
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION PRESETS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Built-in validation preset names.
 */
export const ValidationPresetSchema = z.enum([
    'required',
    'email',
    'url',
    'number',
    'integer',
    'positive',
    'percentage',
    'date',
    'phone',
]);
export type ValidationPreset = z.infer<typeof ValidationPresetSchema>;

/**
 * Validation result.
 */
export interface ValidationResult {
    valid: boolean;
    message?: string;
}

/**
 * Custom validation rule.
 */
export interface ValidationRule<T = unknown> {
    /** Validation function */
    validate: (value: unknown, row?: T) => boolean;
    /** Error message when validation fails */
    message: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// FORMAT PRESETS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Built-in format preset names.
 */
export const FormatPresetSchema = z.enum([
    'currency',
    'percent',
    'number',
    'date',
    'datetime',
    'time',
    'boolean',
]);
export type FormatPreset = z.infer<typeof FormatPresetSchema>;

/**
 * Format options.
 */
export const FormatOptionsSchema = z.object({
    locale: z.string().optional(),
    currency: z.string().optional(),
    decimals: z.number().optional(),
    prefix: z.string().optional(),
    suffix: z.string().optional(),
});
export type FormatOptions = z.infer<typeof FormatOptionsSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// EDITABLE CELL MODEL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Editable cell model schema.
 */
export const EditableCellModelSchema = z.object({
    /** Field key for the cell */
    fieldKey: z.string(),
    /** Data type of the cell value */
    dataType: z.enum(['string', 'number', 'int', 'decimal', 'boolean', 'date', 'datetime']).default('string'),
    /** Current cell value */
    value: z.unknown(),
    /** Whether cell is currently in edit mode */
    isEditing: z.boolean().default(false),
    /** Validation presets to apply */
    validationPresets: z.array(ValidationPresetSchema).default([]),
    /** Format preset for display */
    formatPreset: FormatPresetSchema.optional(),
    /** Format options */
    formatOptions: FormatOptionsSchema.optional(),
    /** Whether cell is editable */
    editable: z.boolean().default(true),
    /** Placeholder text for empty values */
    placeholder: z.string().default('—'),
});

export type EditableCellModel = z.infer<typeof EditableCellModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default editable cell model values.
 */
export const defaultEditableCellModel: EditableCellModel = {
    fieldKey: '',
    dataType: 'string',
    value: null,
    isEditing: false,
    validationPresets: [],
    editable: true,
    placeholder: '—',
};

/**
 * Create an editable cell model with defaults.
 */
export function createEditableCellModel(
    partial: Partial<EditableCellModel>
): EditableCellModel {
    return EditableCellModelSchema.parse({
        ...defaultEditableCellModel,
        ...partial,
    });
}
