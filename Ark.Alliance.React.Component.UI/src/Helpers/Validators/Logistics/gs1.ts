/**
 * @fileoverview GS1 Validators (GLN, GTIN, EAN, SSCC)
 * @module Helpers/Validators/Logistics/gs1
 * 
 * Implements GS1 standard validation using the Modulo 10 algorithm.
 * Supports GLN (13 digits), GTIN-8/12/13/14, EAN-13, EAN-8, SSCC (18 digits).
 * 
 * @see https://www.gs1.org/standards/id-keys
 * 
 * @example
 * ```typescript
 * import { validateGln, validateGtin } from './gs1';
 * 
 * validateGln('5060012345678');  // Valid GLN
 * validateGtin('00012345600012'); // GTIN-14
 * validateGtin('5901234123457');  // EAN-13/GTIN-13
 * ```
 */

import type { ValidationConfig, ValidationResult } from '../types';
import {
    sanitizeAlphanumeric,
    isEmpty,
    validResult,
    invalidResult,
} from '../utils';

// ═══════════════════════════════════════════════════════════════════════════
// GS1 MODULO 10 CHECK DIGIT ALGORITHM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate GS1 Modulo 10 check digit.
 * 
 * **Algorithm:**
 * 1. Take all digits except the last (data digits)
 * 2. From RIGHT to LEFT, apply alternating weights of 3 and 1
 *    - Rightmost data digit gets weight 3
 *    - Next digit gets weight 1
 *    - Continue alternating...
 * 3. Sum all weighted products
 * 4. Check digit = (10 - (sum % 10)) % 10
 * 
 * @param dataDigits - String of data digits (without check digit)
 * @returns Calculated check digit (0-9)
 */
function calculateGs1CheckDigit(dataDigits: string): number {
    const digits = dataDigits.split('').map(Number);
    let sum = 0;

    // Process RIGHT to LEFT
    // Rightmost data digit gets weight 3
    for (let i = digits.length - 1; i >= 0; i--) {
        const positionFromRight = digits.length - 1 - i;
        // Alternating weights: 3, 1, 3, 1, ... (starting with 3 for rightmost)
        const weight = positionFromRight % 2 === 0 ? 3 : 1;
        sum += digits[i] * weight;
    }

    return (10 - (sum % 10)) % 10;
}

/**
 * Validate a GS1 code using Modulo 10 algorithm.
 * 
 * @param code - GS1 code to validate (digits only)
 * @param expectedLength - Expected length (0 = any valid GS1 length)
 * @returns True if valid, false otherwise
 */
function validateGs1Code(code: string, expectedLength: number = 0): boolean {
    // Must be all digits
    if (!/^\d+$/.test(code)) {
        return false;
    }

    // Validate length if specified
    if (expectedLength > 0 && code.length !== expectedLength) {
        return false;
    }

    // Valid GS1 lengths: 8, 12, 13, 14, 18 (SSCC)
    const validLengths = [8, 12, 13, 14, 18];
    if (!validLengths.includes(code.length)) {
        return false;
    }

    // Extract data digits and check digit
    const dataDigits = code.slice(0, -1);
    const checkDigit = parseInt(code.slice(-1), 10);

    // Calculate and compare check digit
    return calculateGs1CheckDigit(dataDigits) === checkDigit;
}

// ═══════════════════════════════════════════════════════════════════════════
// GLN VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate a GLN (Global Location Number).
 * 
 * GLN is a 13-digit GS1 identifier for locations/parties.
 * Uses the standard GS1 Modulo 10 check digit algorithm.
 * 
 * @param value - GLN to validate
 * @param config - Optional validation configuration
 * @returns ValidationResult with normalized GLN
 * 
 * @example
 * ```typescript
 * validateGln('5060012345678');
 * // { isValid: true, normalizedValue: '5060012345678' }
 * ```
 */
export function validateGln(
    value: unknown,
    config?: ValidationConfig
): ValidationResult {
    if (isEmpty(value)) {
        return invalidResult('GLN is required', config?.customErrorMessage);
    }

    // Sanitize: remove spaces, keep only digits
    const gln = sanitizeAlphanumeric(value).replace(/[^0-9]/g, '');

    // GLN must be exactly 13 digits
    if (gln.length !== 13) {
        return invalidResult(
            `Invalid GLN length. Expected 13 digits, got ${gln.length}`,
            config?.customErrorMessage
        );
    }

    if (!validateGs1Code(gln, 13)) {
        return invalidResult(
            'Invalid GLN check digit',
            config?.customErrorMessage
        );
    }

    return validResult(gln);
}

// ═══════════════════════════════════════════════════════════════════════════
// GTIN VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate a GTIN (Global Trade Item Number).
 * 
 * Supports multiple GTIN formats:
 * - GTIN-8 (EAN-8): 8 digits
 * - GTIN-12 (UPC-A): 12 digits
 * - GTIN-13 (EAN-13): 13 digits
 * - GTIN-14: 14 digits
 * 
 * Uses the standard GS1 Modulo 10 check digit algorithm.
 * 
 * @param value - GTIN to validate
 * @param config - Optional validation configuration
 * @returns ValidationResult with normalized GTIN
 * 
 * @example
 * ```typescript
 * validateGtin('5901234123457');  // EAN-13
 * validateGtin('00012345600012'); // GTIN-14
 * validateGtin('96385074');       // GTIN-8
 * ```
 */
export function validateGtin(
    value: unknown,
    config?: ValidationConfig
): ValidationResult {
    if (isEmpty(value)) {
        return invalidResult('GTIN is required', config?.customErrorMessage);
    }

    // Sanitize: remove spaces, keep only digits
    const gtin = sanitizeAlphanumeric(value).replace(/[^0-9]/g, '');

    // Valid GTIN lengths
    const validLengths = [8, 12, 13, 14];
    if (!validLengths.includes(gtin.length)) {
        return invalidResult(
            `Invalid GTIN length. Expected 8, 12, 13, or 14 digits, got ${gtin.length}`,
            config?.customErrorMessage
        );
    }

    if (!validateGs1Code(gtin)) {
        return invalidResult(
            'Invalid GTIN check digit',
            config?.customErrorMessage
        );
    }

    return validResult(gtin);
}

// ═══════════════════════════════════════════════════════════════════════════
// SSCC VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate an SSCC (Serial Shipping Container Code).
 * 
 * SSCC is an 18-digit GS1 identifier for logistics units.
 * Uses the standard GS1 Modulo 10 check digit algorithm.
 * 
 * @param value - SSCC to validate
 * @param config - Optional validation configuration
 * @returns ValidationResult with normalized SSCC
 */
export function validateSscc(
    value: unknown,
    config?: ValidationConfig
): ValidationResult {
    if (isEmpty(value)) {
        return invalidResult('SSCC is required', config?.customErrorMessage);
    }

    // Sanitize: remove spaces, keep only digits
    const sscc = sanitizeAlphanumeric(value).replace(/[^0-9]/g, '');

    // SSCC must be exactly 18 digits
    if (sscc.length !== 18) {
        return invalidResult(
            `Invalid SSCC length. Expected 18 digits, got ${sscc.length}`,
            config?.customErrorMessage
        );
    }

    if (!validateGs1Code(sscc, 18)) {
        return invalidResult(
            'Invalid SSCC check digit',
            config?.customErrorMessage
        );
    }

    return validResult(sscc);
}

export default { validateGln, validateGtin, validateSscc };
