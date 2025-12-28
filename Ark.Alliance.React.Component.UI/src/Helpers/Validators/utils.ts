/**
 * @fileoverview Shared Utility Functions for Validators
 * @module Helpers/Validators/utils
 * 
 * Pure utility functions used across multiple validators.
 * No external dependencies - uses native JavaScript/TypeScript.
 */

// ═══════════════════════════════════════════════════════════════════════════
// STRING UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sanitize string by removing whitespace and converting to uppercase.
 * Used for IBAN, ISIN, and GS1 code validation.
 * 
 * @param value - Input value to sanitize
 * @returns Sanitized uppercase string or empty string if invalid
 */
export function sanitizeAlphanumeric(value: unknown): string {
    if (value === null || value === undefined) return '';
    return String(value).replace(/\s+/g, '').toUpperCase();
}

/**
 * Sanitize string by removing all non-alphanumeric characters.
 * 
 * @param value - Input value to sanitize
 * @returns String containing only alphanumeric characters
 */
export function stripNonAlphanumeric(value: string): string {
    return value.replace(/[^A-Z0-9]/gi, '');
}

/**
 * Convert alphabetic characters to their numeric equivalents.
 * A=10, B=11, ..., Z=35 (ISO 7064 standard)
 * 
 * @param char - Single character to convert
 * @returns Numeric string representation
 */
export function letterToNumber(char: string): string {
    const code = char.charCodeAt(0);
    // Uppercase letters A-Z (65-90)
    if (code >= 65 && code <= 90) {
        return String(code - 55); // A=10, B=11, etc.
    }
    // Lowercase letters a-z (97-122)
    if (code >= 97 && code <= 122) {
        return String(code - 87); // a=10, b=11, etc.
    }
    // Already a digit
    return char;
}

/**
 * Convert all letters in a string to their numeric equivalents.
 * 
 * @param str - String containing letters and digits
 * @returns String with all letters replaced by numbers
 */
export function convertLettersToNumbers(str: string): string {
    return str.split('').map(letterToNumber).join('');
}

// ═══════════════════════════════════════════════════════════════════════════
// NUMERIC UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Count the number of decimal places in a numeric value.
 * 
 * @param value - Numeric value to analyze
 * @returns Number of decimal places (0 for integers)
 * 
 * @example
 * ```typescript
 * countDecimalPlaces(123.45) // 2
 * countDecimalPlaces(100) // 0
 * countDecimalPlaces(1.0) // 0
 * ```
 */
export function countDecimalPlaces(value: number): number {
    if (!isFinite(value)) return 0;

    const str = String(value);
    const decimalIndex = str.indexOf('.');

    if (decimalIndex === -1) return 0;

    // Handle scientific notation
    const eIndex = str.toLowerCase().indexOf('e');
    if (eIndex !== -1) {
        const mantissa = str.substring(0, eIndex);
        const exponent = parseInt(str.substring(eIndex + 1), 10);
        const mantissaDecimals = mantissa.indexOf('.') === -1
            ? 0
            : mantissa.length - mantissa.indexOf('.') - 1;
        return Math.max(0, mantissaDecimals - exponent);
    }

    return str.length - decimalIndex - 1;
}

/**
 * Parse a value to a number, handling various input types.
 * 
 * @param value - Input value to parse
 * @returns Parsed number or NaN if invalid
 */
export function parseToNumber(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        // Remove thousands separators and normalize decimal separator
        const normalized = value.trim().replace(/,/g, '');
        return parseFloat(normalized);
    }
    return NaN;
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if a value is null, undefined, or empty string.
 * 
 * @param value - Value to check
 * @returns True if the value is empty
 */
export function isEmpty(value: unknown): boolean {
    return value === null || value === undefined || value === '';
}

/**
 * Create a success validation result.
 * 
 * @param normalizedValue - Optional normalized value
 * @returns ValidationResult with isValid: true
 */
export function validResult(normalizedValue?: unknown): { isValid: true; normalizedValue?: unknown } {
    const result: { isValid: true; normalizedValue?: unknown } = { isValid: true };
    if (normalizedValue !== undefined) {
        result.normalizedValue = normalizedValue;
    }
    return result;
}

/**
 * Create a failure validation result.
 * 
 * @param errorMessage - Error message describing the failure
 * @param customMessage - Optional custom message to override default
 * @returns ValidationResult with isValid: false
 */
export function invalidResult(
    errorMessage: string,
    customMessage?: string
): { isValid: false; errorMessage: string } {
    return {
        isValid: false,
        errorMessage: customMessage || errorMessage,
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// DATE UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Parse a value to a Date object.
 * Handles Date objects, ISO strings, and timestamps.
 * 
 * @param value - Input value to parse
 * @returns Date object or null if invalid
 */
export function parseToDate(value: unknown): Date | null {
    if (value instanceof Date) {
        return isNaN(value.getTime()) ? null : value;
    }
    if (typeof value === 'string' || typeof value === 'number') {
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
    }
    return null;
}

/**
 * Calculate age in years from a birth date.
 * 
 * @param birthDate - Date of birth
 * @param referenceDate - Reference date for calculation (defaults to now)
 * @returns Age in complete years
 */
export function calculateAge(birthDate: Date, referenceDate: Date = new Date()): number {
    let age = referenceDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = referenceDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}
