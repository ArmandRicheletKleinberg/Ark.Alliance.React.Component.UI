/**
 * @fileoverview Input Validation Types
 * @module Helpers/Validators
 * 
 * Core type definitions for the Input Validation Helper Library.
 * Provides strict typing for validation configuration and results.
 */

// ═══════════════════════════════════════════════════════════════════════════
// INPUT TYPE ENUM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Enumeration of supported input types for validation.
 * 
 * @example
 * ```typescript
 * validateInput('12345', InputType.Numeric, { min: 0, max: 99999 });
 * validateInput('GB82WEST12345698765432', InputType.Iban);
 * ```
 */
export enum InputType {
    /** Numeric values (integers or decimals) */
    Numeric = 'numeric',
    /** Text values (alpha or alphanumeric) */
    Text = 'text',
    /** Email addresses (RFC 5322 simplified) */
    Email = 'email',
    /** URL addresses */
    Url = 'url',
    /** Phone numbers (international format) */
    Phone = 'phone',
    /** IBAN - International Bank Account Number (ISO 13616) */
    Iban = 'iban',
    /** ISIN - International Securities Identification Number (ISO 6166) */
    Isin = 'isin',
    /** GLN - Global Location Number (GS1, 13 digits) */
    Gln = 'gln',
    /** GTIN - Global Trade Item Number (GS1, 8/12/13/14 digits) */
    Gtin = 'gtin',
    /** Date validation (ISO 8601 format) */
    Date = 'date',
    /** Age validation (derived from birth date, 0-130) */
    Age = 'age',
    /** File name validation (cross-platform safe) */
    FileName = 'fileName',
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Decimal precision constraints for numeric validation.
 */
export interface DecimalConfig {
    /** Minimum number of decimal places */
    min?: number;
    /** Maximum number of decimal places */
    max?: number;
}

/**
 * Configuration options for input validation.
 * All properties are optional and type-specific.
 * 
 * @example
 * ```typescript
 * // Numeric with range and decimal constraints
 * const numericConfig: ValidationConfig = {
 *     min: 0,
 *     max: 1000000,
 *     decimals: { min: 2, max: 4 }
 * };
 * 
 * // File name with extension filter
 * const fileConfig: ValidationConfig = {
 *     acceptedFileExtensions: ['.pdf', '.doc', '.docx'],
 *     maxLength: 255
 * };
 * ```
 */
export interface ValidationConfig {
    /** Minimum numeric value */
    min?: number;
    /** Maximum numeric value */
    max?: number;
    /** Minimum string length */
    minLength?: number;
    /** Maximum string length */
    maxLength?: number;
    /** Fixed/exact string length */
    fixLength?: number;
    /** Decimal precision constraints */
    decimals?: DecimalConfig;
    /** Accepted file extensions (e.g., ['.pdf', '.doc']) */
    acceptedFileExtensions?: string[];
    /** Allow special characters in text validation */
    allowSpecialChars?: boolean;
    /** Custom error message to override default */
    customErrorMessage?: string;
    /** For Age validation: reference birth date */
    birthDate?: Date | string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION RESULT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Standard result object returned by all validation functions.
 * Provides validation status, error messaging, and normalized value.
 * 
 * @example
 * ```typescript
 * const result: ValidationResult = {
 *     isValid: true,
 *     normalizedValue: 'GB82WEST12345698765432'
 * };
 * 
 * const errorResult: ValidationResult = {
 *     isValid: false,
 *     errorMessage: 'Invalid IBAN checksum'
 * };
 * ```
 */
export type ValidationResult = {
    /** Whether the input passed validation */
    isValid: boolean;
    /** Error message if validation failed */
    errorMessage?: string;
    /** Normalized/sanitized value (e.g., stripped whitespace, uppercase) */
    normalizedValue?: unknown;
};

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATOR FUNCTION TYPE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Type signature for individual validator functions.
 * All validators are pure functions with no side effects.
 */
export type ValidatorFn = (
    value: unknown,
    config?: ValidationConfig
) => ValidationResult;
