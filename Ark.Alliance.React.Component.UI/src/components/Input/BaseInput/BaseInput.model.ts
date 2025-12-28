/**
 * @fileoverview BaseInput Component Model
 * @module components/Input/BaseInput
 * 
 * Defines the data structure, validation, and defaults for the BaseInput primitive component.
 * Serves as the foundation model for all input variants in the library.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';
import {
    BasicSizeSchema,
    InputVariantSchema,
    InputFormatSchema,
    InputValidationConfigSchema,
    type BasicSize,
    type InputVariant,
    type InputFormat,
    type InputValidationConfig,
} from '../../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Size variants for input components
 * @deprecated Use BasicSizeSchema from '@core/enums' instead
 */
export const InputSize = BasicSizeSchema;

/**
 * Style variants for input components
 * @deprecated Use InputVariantSchema from '@core/enums' instead
 */
export const InputVariant = InputVariantSchema;

/**
 * BaseInput model schema extending base model
 */
export const BaseInputModelSchema = extendSchema({
    /** Size variant */
    size: BasicSizeSchema.default('md'),

    /** Style variant */
    variant: InputVariantSchema.default('default'),

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

    // ═══════════════════════════════════════════════════════════════════════
    // VALIDATION PROPERTIES
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Expected input format for validation.
     * Set to 'none' for free text without format validation.
     * 
     * @example
     * ```tsx
     * <BaseInput validationFormat="email" />
     * <BaseInput validationFormat="iban" />
     * <BaseInput validationFormat="none" /> // Free text
     * ```
     */
    validationFormat: InputFormatSchema.default('none'),

    /**
     * Optional validation configuration.
     * Used to customize validation behavior (min/max, decimals, etc.)
     */
    validationConfig: InputValidationConfigSchema,

    /**
     * Whether to validate on blur (default) or on change.
     */
    validateOnBlur: z.boolean().default(true),

    /**
     * Whether to validate on each change.
     */
    validateOnChange: z.boolean().default(false),

    /**
     * Current validation error message (set after validation).
     */
    validationError: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type InputSizeType = BasicSize;
export type InputVariantType = InputVariant;
export type InputFormatType = InputFormat;
export type BaseInputModel = z.infer<typeof BaseInputModelSchema>;

// Re-export for convenience
export { type InputFormat, type InputValidationConfig };

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
    // Validation defaults
    validationFormat: 'none',
    validateOnBlur: true,
    validateOnChange: false,
};

/**
 * Create a BaseInput model with custom values
 */
export function createBaseInputModel(data: Partial<BaseInputModel>): BaseInputModel {
    return BaseInputModelSchema.parse(data);
}
