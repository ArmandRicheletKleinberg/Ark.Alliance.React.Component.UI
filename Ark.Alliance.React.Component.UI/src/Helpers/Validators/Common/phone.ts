/**
 * @fileoverview Phone Number Validator
 * @module Helpers/Validators/Common/phone
 * 
 * Validates international phone numbers (E.164 format).
 * Supports optional separators (spaces, dashes) which are stripped for validation.
 * 
 * @example
 * ```typescript
 * validatePhone('+1 555 123 4567');
 * // { isValid: true, normalizedValue: '+15551234567' }
 * 
 * validatePhone('+33-1-23-45-67-89');
 * // { isValid: true, normalizedValue: '+33123456789' }
 * ```
 */

import type { ValidationConfig, ValidationResult } from '../types';
import { isEmpty, validResult, invalidResult } from '../utils';

/**
 * Validate an international phone number.
 * 
 * **Format (E.164):**
 * - Starts with + followed by country code
 * - 1-15 digits total (excluding +)
 * - Optional separators: spaces, dashes, dots, parentheses
 * 
 * @param value - Phone number to validate
 * @param config - Optional validation configuration
 * @returns ValidationResult with normalized phone (digits only with +)
 */
export function validatePhone(
    value: unknown,
    config?: ValidationConfig
): ValidationResult {
    if (isEmpty(value)) {
        return invalidResult('Phone number is required', config?.customErrorMessage);
    }

    const rawPhone = String(value).trim();

    // Must start with + for international format
    if (!rawPhone.startsWith('+')) {
        return invalidResult(
            'Phone number must start with + for international format',
            config?.customErrorMessage
        );
    }

    // Strip allowed separators (spaces, dashes, dots, parentheses)
    const normalized = rawPhone.replace(/[\s\-.()\[\]]/g, '');

    // After normalization: + followed by 1-15 digits
    const phoneRegex = /^\+[1-9][0-9]{0,14}$/;
    if (!phoneRegex.test(normalized)) {
        return invalidResult(
            'Invalid phone number format. Expected: + followed by 1-15 digits',
            config?.customErrorMessage
        );
    }

    // Extract digits (without +)
    const digits = normalized.substring(1);

    // Minimum length check (typically country code + some digits = at least 7)
    if (digits.length < 7) {
        return invalidResult(
            'Phone number too short (minimum 7 digits)',
            config?.customErrorMessage
        );
    }

    return validResult(normalized);
}

export default validatePhone;
