/**
 * @fileoverview BaseInput Component Model
 * @module components/Input/BaseInput
 * 
 * Defines the data structure, validation, and defaults for the BaseInput primitive component.
 * Serves as the foundation model for all input variants in the library.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Size variants for input components
 */
export const InputSize = z.enum(['sm', 'md', 'lg']);

/**
 * Style variants for input components
 */
export const InputVariant = z.enum(['default', 'filled', 'outlined', 'underlined']);

/**
 * BaseInput model schema extending base model
 */
export const BaseInputModelSchema = extendSchema({
    /** Size variant */
    size: InputSize.default('md'),

    /** Style variant */
    variant: InputVariant.default('default'),

    /** Error state */
    hasError: z.boolean().default(false),

    /** Focus state */
    isFocused: z.boolean().default(false),

    /** Full width mode */
    fullWidth: z.boolean().default(false),

    /** Input value */
    value: z.string().default(''),

    /** Placeholder text */
    placeholder: z.string().optional(),

    /** Input type */
    type: z.string().default('text'),

    /** Name attribute for forms */
    name: z.string().optional(),

    /** Whether input is required */
    required: z.boolean().default(false),

    /** Maximum length */
    maxLength: z.number().optional(),

    /** Minimum length */
    minLength: z.number().optional(),

    /** Pattern for validation */
    pattern: z.string().optional(),

    /** Autocomplete hint */
    autoComplete: z.string().optional(),

    /** Auto focus on mount */
    autoFocus: z.boolean().default(false),

    /** Read-only state */
    readOnly: z.boolean().default(false),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type InputSizeType = z.infer<typeof InputSize>;
export type InputVariantType = z.infer<typeof InputVariant>;
export type BaseInputModel = z.infer<typeof BaseInputModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default BaseInput model values
 */
export const defaultBaseInputModel: BaseInputModel = {
    size: 'md',
    variant: 'default',
    hasError: false,
    isFocused: false,
    fullWidth: false,
    value: '',
    type: 'text',
    required: false,
    autoFocus: false,
    readOnly: false,
    disabled: false,
    loading: false,
    clickable: false,
    doubleClickable: false,
    draggable: false,
    droppable: false,
    mouseOverEnabled: false,
    mouseMoveEnabled: false,
    mouseEnterEnabled: false,
    focusable: true, // Inputs are focusable by default
    tooltipPosition: 'top',
    tooltipDelay: 300,
};

/**
 * Create a BaseInput model with custom values
 */
export function createBaseInputModel(data: Partial<BaseInputModel>): BaseInputModel {
    return BaseInputModelSchema.parse(data);
}
