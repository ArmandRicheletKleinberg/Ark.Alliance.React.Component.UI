/**
 * @fileoverview Input Component Model
 * @module components/Input
 * 
 * Defines the data structure, validation, and defaults for the Input component.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input type variants
 */
export const InputType = z.enum([
    'text', 'password', 'email', 'number', 'tel', 'url', 'search', 'date', 'time'
]);

/**
 * Input size variants
 */
export const InputSize = z.enum(['sm', 'md', 'lg']);

/**
 * Input variant styles
 */
export const InputVariant = z.enum(['default', 'filled', 'outlined', 'underlined']);

/**
 * Input model schema extending base model
 */
export const InputModelSchema = extendSchema({
    /** Input type */
    type: InputType.default('text'),

    /** Size variant */
    size: InputSize.default('md'),

    /** Style variant */
    variant: InputVariant.default('default'),

    /** Placeholder text */
    placeholder: z.string().optional(),

    /** Associated label text */
    label: z.string().optional(),

    /** Whether input is required */
    required: z.boolean().default(false),

    /** Error message */
    error: z.string().optional(),

    /** Helper text below input */
    helperText: z.string().optional(),

    /** Maximum length */
    maxLength: z.number().optional(),

    /** Pattern for validation */
    pattern: z.string().optional(),

    /** Prefix icon name */
    iconLeft: z.string().optional(),

    /** Suffix icon name */
    iconRight: z.string().optional(),

    /** Full width mode */
    fullWidth: z.boolean().default(false),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type InputTypeEnum = z.infer<typeof InputType>;
export type InputSizeType = z.infer<typeof InputSize>;
export type InputVariantType = z.infer<typeof InputVariant>;
export type InputModel = z.infer<typeof InputModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default input model values
 */
export const defaultInputModel: InputModel = InputModelSchema.parse({});

/**
 * Create an input model with custom values
 */
export function createInputModel(data: Partial<InputModel> = {}): InputModel {
    return InputModelSchema.parse(data);
}
