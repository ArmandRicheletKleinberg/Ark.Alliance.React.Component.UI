/**
 * @fileoverview Text Validator
 * @module Helpers/Validators/Common/text
 * 
 * Validates text values with support for length constraints and character filtering.
 * 
 * @example
 * ```typescript
 * validateText('Hello World', { minLength: 1, maxLength: 100 });
 * validateText('ABC123', { allowSpecialChars: false });
 * ```
 */

import type { ValidationConfig, ValidationResult } from '../types';
import { isEmpty, validResult, invalidResult } from '../utils';

/**
 * Validate a text value.
 * 
 * **Validations:**
 * - Type check (must be string)
 * - Length constraints (minLength, maxLength, fixLength)
 * - Character filtering (allowSpecialChars)
 * 
 * @param value - Value to validate
 * @param config - Validation configuration
 * @returns ValidationResult with trimmed string
 */
export function validateText(
    value: unknown,
    config?: ValidationConfig
): ValidationResult {
    if (isEmpty(value)) {
        return invalidResult('Text is required', config?.customErrorMessage);
    }

    const text = String(value).trim();

    // Fixed length check
    if (config?.fixLength !== undefined && text.length !== config.fixLength) {
        return invalidResult(
            `Text must be exactly ${config.fixLength} characters`,
            config?.customErrorMessage
        );
    }

    // Min length check
    if (config?.minLength !== undefined && text.length < config.minLength) {
        return invalidResult(
            `Text must be at least ${config.minLength} characters`,
            config?.customErrorMessage
        );
    }

    // Max length check
    if (config?.maxLength !== undefined && text.length > config.maxLength) {
        return invalidResult(
            `Text must be at most ${config.maxLength} characters`,
            config?.customErrorMessage
        );
    }

    // Special characters check (alphanumeric only if false)
    if (config?.allowSpecialChars === false) {
        // Only allow letters, numbers, and spaces
        if (!/^[a-zA-Z0-9\s]+$/.test(text)) {
            return invalidResult(
                'Text can only contain letters, numbers, and spaces',
                config?.customErrorMessage
            );
        }
    }

    return validResult(text);
}

/**
 * Validate alphabetic text only (letters and spaces).
 * 
 * @param value - Value to validate
 * @param config - Validation configuration
 * @returns ValidationResult with trimmed string
 */
export function validateAlpha(
    value: unknown,
    config?: ValidationConfig
): ValidationResult {
    if (isEmpty(value)) {
        return invalidResult('Text is required', config?.customErrorMessage);
    }

    const text = String(value).trim();

    // Only letters and spaces allowed
    if (!/^[a-zA-Z\s]+$/.test(text)) {
        return invalidResult(
            'Text can only contain letters and spaces',
            config?.customErrorMessage
        );
    }

    // Apply length validations
    return validateText(text, config);
}

/**
 * Validate alphanumeric text only (letters, numbers, spaces).
 * 
 * @param value - Value to validate
 * @param config - Validation configuration
 * @returns ValidationResult with trimmed string
 */
export function validateAlphanumeric(
    value: unknown,
    config?: ValidationConfig
): ValidationResult {
    return validateText(value, { ...config, allowSpecialChars: false });
}

export default validateText;
