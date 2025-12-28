/**
 * @fileoverview Input Format Enums
 * @module core/enums/InputFormat
 * 
 * Defines input format types for validation.
 * Used by input components to specify expected data format.
 * Maps to validators in Helpers/Validators.
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// INPUT FORMAT SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input format types for validation.
 * 
 * - `none`: Free text, no validation
 * - Finance formats: iban, isin
 * - Logistics formats: gln, gtin
 * - Common formats: numeric, text, email, url, phone, date, age
 * - System formats: fileName
 * 
 * @example
 * ```typescript
 * <BaseInput validationFormat="email" />
 * <BaseInput validationFormat="iban" />
 * <BaseInput validationFormat="none" /> // Free text
 * ```
 */
export const InputFormatSchema = z.enum([
    // No validation (free text)
    'none',

    // ═══════════════════════════════════════════════════════════════════════
    // FINANCE FORMATS
    // ═══════════════════════════════════════════════════════════════════════

    /** IBAN - International Bank Account Number (ISO 13616) */
    'iban',
    /** ISIN - International Securities Identification Number (ISO 6166) */
    'isin',

    // ═══════════════════════════════════════════════════════════════════════
    // LOGISTICS FORMATS (GS1)
    // ═══════════════════════════════════════════════════════════════════════

    /** GLN - Global Location Number (13 digits) */
    'gln',
    /** GTIN - Global Trade Item Number (8/12/13/14 digits) */
    'gtin',

    // ═══════════════════════════════════════════════════════════════════════
    // COMMON FORMATS
    // ═══════════════════════════════════════════════════════════════════════

    /** Numeric values with optional range/decimal validation */
    'numeric',
    /** Text with optional length/character constraints */
    'text',
    /** Email address (RFC 5322) */
    'email',
    /** URL address */
    'url',
    /** Phone number (E.164 international format) */
    'phone',
    /** Date (ISO 8601) */
    'date',
    /** Age derived from birth date */
    'age',

    // ═══════════════════════════════════════════════════════════════════════
    // SYSTEM FORMATS
    // ═══════════════════════════════════════════════════════════════════════

    /** Cross-platform safe file name */
    'fileName',
]);

/**
 * Input format type derived from schema.
 */
export type InputFormat = z.infer<typeof InputFormatSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION CONFIG SCHEMA (for input components)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validation configuration for input components.
 * Mirrors the ValidationConfig from Helpers/Validators but as Zod schema.
 */
export const InputValidationConfigSchema = z.object({
    /** Minimum numeric value */
    min: z.number().optional(),
    /** Maximum numeric value */
    max: z.number().optional(),
    /** Minimum string length */
    minLength: z.number().optional(),
    /** Maximum string length */
    maxLength: z.number().optional(),
    /** Fixed/exact string length */
    fixLength: z.number().optional(),
    /** Decimal precision constraints */
    decimals: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
    }).optional(),
    /** Accepted file extensions (e.g., ['.pdf', '.doc']) */
    acceptedFileExtensions: z.array(z.string()).optional(),
    /** Allow special characters in text validation */
    allowSpecialChars: z.boolean().optional(),
    /** Custom error message to override default */
    customErrorMessage: z.string().optional(),
}).optional();

export type InputValidationConfig = z.infer<typeof InputValidationConfigSchema>;
