/**
 * @fileoverview IBAN Validator
 * @module Helpers/Validators/Finance/iban
 * 
 * Implements ISO 13616 (IBAN) validation using the Mod 97-10 algorithm.
 * Uses BigInt for precise modulo calculation on large numbers.
 * 
 * @see https://en.wikipedia.org/wiki/International_Bank_Account_Number
 * 
 * @example
 * ```typescript
 * import { validateIban } from './iban';
 * 
 * validateIban('GB82 WEST 1234 5698 7654 32');
 * // { isValid: true, normalizedValue: 'GB82WEST12345698765432' }
 * 
 * validateIban('GB82WEST12345698765433');
 * // { isValid: false, errorMessage: 'Invalid IBAN checksum' }
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
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/** IBAN country code length mapping (ISO 13616) */
const IBAN_LENGTHS: Record<string, number> = {
    AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22,
    BR: 29, BY: 28, CH: 21, CR: 22, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28,
    EE: 20, EG: 29, ES: 24, FI: 18, FO: 18, FR: 27, GB: 22, GE: 22, GI: 23,
    GL: 18, GR: 27, GT: 28, HR: 21, HU: 28, IE: 22, IL: 23, IQ: 23, IS: 26,
    IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28, LC: 32, LI: 21, LT: 20, LU: 20,
    LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27, MT: 31, MU: 30, NL: 18,
    NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29, RO: 24, RS: 22, SA: 24,
    SC: 31, SE: 24, SI: 19, SK: 24, SM: 27, ST: 25, SV: 28, TL: 23, TN: 24,
    TR: 26, UA: 29, VA: 22, VG: 24, XK: 20,
};

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate an IBAN (International Bank Account Number).
 * 
 * **Algorithm (ISO 13616, Mod 97-10):**
 * 1. Sanitize: Remove spaces and convert to uppercase
 * 2. Validate format: 2-letter country code + 2 check digits + BBAN
 * 3. Validate length: Must match country-specific length
 * 4. Rearrange: Move first 4 characters to the end
 * 5. Convert: Replace letters with numbers (A=10, B=11, ..., Z=35)
 * 6. Mod 97: Calculate modulo 97 using BigInt - result must be 1
 * 
 * @param value - IBAN to validate (can include spaces)
 * @param config - Optional validation configuration
 * @returns ValidationResult with normalized IBAN (no spaces, uppercase)
 */
export function validateIban(
    value: unknown,
    config?: ValidationConfig
): ValidationResult {
    // Handle empty value
    if (isEmpty(value)) {
        return invalidResult('IBAN is required', config?.customErrorMessage);
    }

    // Sanitize: remove whitespace, uppercase
    const iban = sanitizeAlphanumeric(value);

    // Basic format validation: 2 letters + 2 digits + alphanumeric BBAN
    const formatRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/;
    if (!formatRegex.test(iban)) {
        return invalidResult(
            'Invalid IBAN format. Expected: 2-letter country code + 2 check digits + BBAN',
            config?.customErrorMessage
        );
    }

    // Extract country code
    const countryCode = iban.substring(0, 2);

    // Validate country code exists
    const expectedLength = IBAN_LENGTHS[countryCode];
    if (!expectedLength) {
        return invalidResult(
            `Unknown IBAN country code: ${countryCode}`,
            config?.customErrorMessage
        );
    }

    // Validate length for country
    if (iban.length !== expectedLength) {
        return invalidResult(
            `Invalid IBAN length for ${countryCode}. Expected ${expectedLength} characters, got ${iban.length}`,
            config?.customErrorMessage
        );
    }

    // Rearrange: move first 4 chars to end
    const rearranged = iban.substring(4) + iban.substring(0, 4);

    // Convert letters to numbers (A=10, B=11, ..., Z=35)
    const numericString = convertLettersToNumbers(rearranged);

    // Calculate mod 97 using BigInt for precision
    try {
        const remainder = BigInt(numericString) % 97n;

        if (remainder !== 1n) {
            return invalidResult(
                'Invalid IBAN checksum',
                config?.customErrorMessage
            );
        }
    } catch {
        return invalidResult(
            'Invalid IBAN format',
            config?.customErrorMessage
        );
    }

    return validResult(iban);
}

export default validateIban;
