/**
 * @fileoverview Input Component Model
 * @module components/Input
 * 
 * Defines the data structure, validation, and defaults for the Input component.
 * Extends FormInputModelSchema to inherit input restriction capabilities.
 */

import { z } from 'zod';
<<<<<<<< HEAD:Ark.Alliance.React.Component.UI/src/components/Input/Base/Input/Input.model.ts
import { extendFormInputSchema } from '../../../../core/base';
import { BasicSizeSchema, InputVariantSchema, type BasicSize, type InputVariant } from '../../../../core/enums';
========
import { extendFormInputSchema } from '../../core/base';
>>>>>>>> 51dbefa49bdafb89d9b789ec953d0289844dbe85:Ark.Alliance.React.Component.UI/src/components/Input/Input.model.ts

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input type variants (component-specific, not centralized)
 */
export const InputType = z.enum([
    'text', 'password', 'email', 'number', 'tel', 'url', 'search', 'date', 'time'
]);

/**
 * Input size variants
 * @deprecated Use BasicSizeSchema from '@core/enums' instead
 */
export const InputSize = BasicSizeSchema;

/**
 * Input variant styles
 * @deprecated Use InputVariantSchema from '@core/enums' instead
 */
export const InputVariant = InputVariantSchema;

/**
 * Input model schema extending FormInputModel
 * 
 * @remarks
 * Inherits inputRestriction from FormInputModelSchema for copy/paste control.
 * 
 * @example
 * ```tsx
 * <Input 
 *     label="PIN Code"
 *     inputRestriction={InputRestrictionPresets.numericOnly}
 * />
 * ```
 */
export const InputModelSchema = extendFormInputSchema({
    /** Input type */
    type: InputType.default('text'),

    /** Size variant */
    size: BasicSizeSchema.default('md'),

    /** Style variant */
    variant: InputVariantSchema.default('default'),

    /** Placeholder text */
    placeholder: z.string().optional(),

    /** Error message (overrides base errorMessage) */
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
export type InputSizeType = BasicSize;
export type InputVariantType = InputVariant;
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
