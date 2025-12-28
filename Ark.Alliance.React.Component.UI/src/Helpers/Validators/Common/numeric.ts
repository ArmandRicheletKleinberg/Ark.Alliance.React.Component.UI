/**
 * @fileoverview Numeric Validator
 * @module Helpers/Validators/Common/numeric
 * 
 * Validates numeric values with support for min/max range and decimal precision.
 * 
 * @example
 * ```typescript
 * validateNumeric(123.45, { min: 0, max: 1000, decimals: { max: 2 } });
 * // { isValid: true, normalizedValue: 123.45 }
 * ```
 */

import type { ValidationConfig, ValidationResult } from '../types';
import {
    isEmpty,
    parseToNumber,
    countDecimalPlaces,
    validResult,
    invalidResult,
} from '../utils';

/**
 * Validate a numeric value.
 * 
 * **Validations:**
 * - Type check (must be convertible to number)
 * - Range validation (min/max)
 * - Decimal precision (min/max decimal places)
 * 
 * @param value - Value to validate
 * @param config - Validation configuration
 * @returns ValidationResult with parsed number
 */
export function validateNumeric(
    value: unknown,
    config?: ValidationConfig
): ValidationResult {
    if (isEmpty(value)) {
        return invalidResult('Numeric value is required', config?.customErrorMessage);
    }

    const num = parseToNumber(value);

    if (isNaN(num)) {
        return invalidResult(
            'Invalid numeric value',
            config?.customErrorMessage
        );
    }

    if (!isFinite(num)) {
        return invalidResult(
            'Value must be a finite number',
            config?.customErrorMessage
        );
    }

    // Min value check
    if (config?.min !== undefined && num < config.min) {
        return invalidResult(
            `Value must be at least ${config.min}`,
            config?.customErrorMessage
        );
    }

    // Max value check
    if (config?.max !== undefined && num > config.max) {
        return invalidResult(
            `Value must be at most ${config.max}`,
            config?.customErrorMessage
        );
    }

    // Decimal places check
    if (config?.decimals) {
        const decimalPlaces = countDecimalPlaces(num);

        if (config.decimals.min !== undefined && decimalPlaces < config.decimals.min) {
            return invalidResult(
                `Must have at least ${config.decimals.min} decimal places`,
                config?.customErrorMessage
            );
        }

        if (config.decimals.max !== undefined && decimalPlaces > config.decimals.max) {
            return invalidResult(
                `Must have at most ${config.decimals.max} decimal places`,
                config?.customErrorMessage
            );
        }
    }

    return validResult(num);
}

export default validateNumeric;
