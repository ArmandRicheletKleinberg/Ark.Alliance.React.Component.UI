/**
 * @fileoverview ISIN Validator
 * @module Helpers/Validators/Finance/isin
 * 
 * Implements ISO 6166 (ISIN) validation using the Luhn algorithm variant.
 * Used for identifying securities (stocks, bonds, derivatives).
 * 
 * @see https://en.wikipedia.org/wiki/International_Securities_Identification_Number
 * 
 * @example
 * ```typescript
 * import { validateIsin } from './isin';
 * 
 * validateIsin('US0378331005'); // Apple Inc.
 * // { isValid: true, normalizedValue: 'US0378331005' }
 * 
 * validateIsin('AU0000XVGZA3'); // Australian bond
 * // { isValid: true, normalizedValue: 'AU0000XVGZA3' }
 * ```
 */

import type { ValidationConfig, ValidationResult } from '../types';
import {
    sanitizeAlphanumeric,
    convertLettersToNumbers,
    isEmpty,
    validResult,
    invalidResult,
} from '../utils';

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate an ISIN (International Securities Identification Number).
 * 
 * **Algorithm (ISO 6166, Luhn variant):**
 * 1. Validate format: 2 letters (country) + 9 alphanumeric (NSIN) + 1 check digit
 * 2. Convert letters to numbers (A=10, B=11, ..., Z=35)
 * 3. Apply Luhn algorithm with RIGHT-TO-LEFT processing:
 *    - Start from rightmost digit (position 0)
 *    - Double every SECOND digit starting from position 1 (right to left)
 *    - If doubled value > 9, sum its digits (e.g., 16 → 1+6=7)
 * 4. Sum all resulting digits
 * 5. Check: (10 - (sum % 10)) % 10 === check digit
 * 
 * @param value - ISIN to validate
 * @param config - Optional validation configuration
 * @returns ValidationResult with normalized ISIN (uppercase, no spaces)
 */
export function validateIsin(
    value: unknown,
    config?: ValidationConfig
): ValidationResult {
    // Handle empty value
    if (isEmpty(value)) {
        return invalidResult('ISIN is required', config?.customErrorMessage);
    }

    // Sanitize: remove whitespace, uppercase
    const isin = sanitizeAlphanumeric(value);

    // Validate format: 2 letters + 9 alphanumeric + 1 digit
    // Format: CC + NNNNNNNNN + C where C=country, N=NSIN, C=check
    const formatRegex = /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/;
    if (!formatRegex.test(isin)) {
        return invalidResult(
            'Invalid ISIN format. Expected: 2-letter country code + 9 alphanumeric characters + 1 check digit',
            config?.customErrorMessage
        );
    }

    // Convert entire ISIN to numeric string (letters to A=10, B=11, etc.)
    const numericString = convertLettersToNumbers(isin);

    // Apply Luhn algorithm (right-to-left, double every second digit from right)
    const digits = numericString.split('').map(Number);
    const length = digits.length;
    let sum = 0;

    for (let i = 0; i < length; i++) {
        // Position from right (0 = rightmost)
        const posFromRight = length - 1 - i;
        let digit = digits[i];

        // Double every second digit from the right (positions 1, 3, 5, ...)
        // The check digit is at position 0 (not doubled)
        // The rightmost DATA digit is at position 1 (doubled)
        if (posFromRight % 2 === 1) {
            digit *= 2;
            // If > 9, sum the digits (equivalent to subtracting 9)
            if (digit > 9) {
                digit = digit - 9;
            }
        }

        sum += digit;
    }

    // Valid if sum is divisible by 10
    if (sum % 10 !== 0) {
        return invalidResult(
            'Invalid ISIN check digit',
            config?.customErrorMessage
        );
    }

    return validResult(isin);
}

export default validateIsin;
