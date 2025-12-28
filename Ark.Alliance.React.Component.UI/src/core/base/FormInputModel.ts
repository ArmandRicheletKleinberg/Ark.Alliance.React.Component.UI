/**
 * @fileoverview Form Input Model Schema
 * @module core/base/FormInputModel
 * 
 * Extended schema for form input components with input restriction capabilities.
 * This schema extends BaseModelSchema to provide form-specific properties
 * including copy/paste/cut restrictions, sanitization, and validation.
 * 
 * @remarks
 * **Accessibility Warning**: Disabling copy/paste can negatively impact users
 * who rely on assistive technologies or password managers. Use with caution
 * and only when absolutely necessary (e.g., regulatory compliance, typing tests).
 * 
 * @example
 * ```typescript
 * // Creating a form input schema
 * const MyInputSchema = FormInputModelSchema.extend({
 *     placeholder: z.string().optional(),
 * });
 * 
 * // Using input restrictions
 * <TextInput 
 *     inputRestriction={{ 
 *         disablePaste: true, 
 *         restrictionMessage: 'Please type your password manually' 
 *     }} 
 * />
 * ```
 */

import { z } from 'zod';
import { BaseModelSchema } from './BaseComponentModel';

// ═══════════════════════════════════════════════════════════════════════════
// INPUT RESTRICTION SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input restriction configuration schema
 * 
 * Controls clipboard operations (copy, cut, paste) and provides
 * alternative sanitization options for better UX.
 */
export const InputRestrictionSchema = z.object({
    /**
     * Prevent copying content from this input
     * @default false
     */
    disableCopy: z.boolean().default(false),

    /**
     * Prevent cutting content from this input
     * @default false
     */
    disableCut: z.boolean().default(false),

    /**
     * Prevent pasting content into this input
     * @default false
     */
    disablePaste: z.boolean().default(false),

    /**
     * Prevent drag-and-drop into this input
     * (Users can bypass paste restrictions via drag-drop)
     * @default false
     */
    disableDrop: z.boolean().default(false),

    /**
     * Custom message shown when a restricted action is attempted
     * If not provided, action is silently blocked
     */
    restrictionMessage: z.string().optional(),

    /**
     * Allow paste but sanitize/filter the content
     * Better UX alternative to blocking paste entirely
     * @default false
     */
    sanitizePaste: z.boolean().default(false),

    /**
     * Allowed characters pattern for sanitization (regex pattern)
     * Only used when sanitizePaste is true
     * @example '[0-9]' for numeric only
     * @example '[a-zA-Z0-9]' for alphanumeric
     */
    allowedPattern: z.string().optional(),

    /**
     * Maximum length to enforce on paste
     * Truncates pasted content if it exceeds this length
     */
    maxPasteLength: z.number().optional(),

    /**
     * Show visual indicator when restrictions are active
     * Helps users understand why actions are blocked
     * @default true
     */
    showRestrictionIndicator: z.boolean().default(true),
});

// ═══════════════════════════════════════════════════════════════════════════
// FORM INPUT MODEL SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Form Input Model Schema
 * 
 * Extends BaseModelSchema with form-specific properties including:
 * - Input restrictions (copy/paste/cut control)
 * - Validation state
 * - Label and help text
 * - Required field indicator
 * 
 * Use this schema as the base for all form input components.
 */
export const FormInputModelSchema = BaseModelSchema.extend({
    /**
     * Input restriction configuration
     * Optional - when undefined, all clipboard operations are allowed
     */
    inputRestriction: InputRestrictionSchema.optional(),

    /**
     * Field label displayed above/beside the input
     */
    label: z.string().optional(),

    /**
     * Help text displayed below the input
     */
    helpText: z.string().optional(),

    /**
     * Error message to display when validation fails
     */
    errorMessage: z.string().optional(),

    /**
     * Whether this field is required
     * @default false
     */
    required: z.boolean().default(false),

    /**
     * Whether the input has been touched (focused then blurred)
     * Used for validation display timing
     * @default false
     */
    touched: z.boolean().default(false),

    /**
     * Current validation state
     */
    validationState: z.enum(['valid', 'invalid', 'pending', 'none']).default('none'),

    /**
     * Input name attribute for form submission
     */
    name: z.string().optional(),

    /**
     * Whether the input is read-only
     * @default false
     */
    readOnly: z.boolean().default(false),

    /**
     * Autocomplete attribute value
     * @see https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
     */
    autoComplete: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input restriction configuration type
 */
export type InputRestriction = z.infer<typeof InputRestrictionSchema>;

/**
 * Form input model type
 */
export type FormInputModel = z.infer<typeof FormInputModelSchema>;

/**
 * Default input restriction (all operations allowed)
 */
export const defaultInputRestriction: InputRestriction = InputRestrictionSchema.parse({});

/**
 * Default form input model
 */
export const defaultFormInputModel: FormInputModel = FormInputModelSchema.parse({});

/**
 * Factory function to create a FormInputModel
 * @param data - Partial form input model data
 * @returns Validated FormInputModel
 */
export function createFormInputModel(data: Partial<FormInputModel> = {}): FormInputModel {
    return FormInputModelSchema.parse(data);
}

/**
 * Helper to extend FormInputModelSchema with additional fields
 * @param extension - Additional Zod shape to merge
 * @returns Extended schema
 */
export function extendFormInputSchema<T extends z.ZodRawShape>(
    extension: T
): z.ZodObject<typeof FormInputModelSchema.shape & T> {
    return FormInputModelSchema.extend(extension);
}

// ═══════════════════════════════════════════════════════════════════════════
// PRESET RESTRICTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Preset restriction configurations for common use cases
 */
export const InputRestrictionPresets = {
    /**
     * No restrictions (default behavior)
     */
    none: undefined,

    /**
     * Block all clipboard operations
     * Use case: Typing tests, CAPTCHA-like inputs
     */
    blockAll: {
        disableCopy: true,
        disableCut: true,
        disablePaste: true,
        disableDrop: true,
        restrictionMessage: 'Clipboard operations are disabled for this field',
    } as InputRestriction,

    /**
     * Block paste only
     * Use case: Password confirmation fields (though not recommended)
     */
    blockPaste: {
        disablePaste: true,
        disableDrop: true,
        restrictionMessage: 'Please type this value manually',
    } as InputRestriction,

    /**
     * Allow paste but sanitize to numbers only
     * Use case: Phone number, OTP, PIN inputs
     */
    numericOnly: {
        sanitizePaste: true,
        allowedPattern: '[0-9]',
        restrictionMessage: 'Only numeric characters are allowed',
    } as InputRestriction,

    /**
     * Allow paste but sanitize to alphanumeric
     * Use case: Usernames, codes
     */
    alphanumericOnly: {
        sanitizePaste: true,
        allowedPattern: '[a-zA-Z0-9]',
        restrictionMessage: 'Only letters and numbers are allowed',
    } as InputRestriction,

    /**
     * Bank account / financial fields
     * Use case: Account numbers with length limits
     */
    financialField: {
        sanitizePaste: true,
        allowedPattern: '[0-9]',
        maxPasteLength: 20,
        showRestrictionIndicator: true,
    } as InputRestriction,
} as const;
