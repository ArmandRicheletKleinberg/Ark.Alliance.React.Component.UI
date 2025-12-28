/**
 * @fileoverview Date and Age Validators
 * @module Helpers/Validators/Common/date
 * 
 * Validates dates and calculates/validates ages from birth dates.
 * 
 * @example
 * ```typescript
 * validateDate('2024-01-15');
 * validateBirthDate('1990-05-20'); // Must be in past
 * validateAge('1990-05-20'); // Returns age, validates 0-130
 * ```
 */

import type { ValidationConfig, ValidationResult } from '../types';
import {
    isEmpty,
    parseToDate,
    calculateAge,
    validResult,
    invalidResult,
} from '../utils';

/**
 * Validate a date value.
 * 
 * **Validations:**
 * - Valid date format (ISO 8601 or Date object)
 * - Date is real (not Feb 30, etc.)
 * 
 * @param value - Date to validate (string, Date, or timestamp)
 * @param config - Optional validation configuration
 * @returns ValidationResult with Date object
 */
export function validateDate(
    value: unknown,
    config?: ValidationConfig
): ValidationResult {
    if (isEmpty(value)) {
        return invalidResult('Date is required', config?.customErrorMessage);
    }

    const date = parseToDate(value);

    if (date === null) {
        return invalidResult(
            'Invalid date format',
            config?.customErrorMessage
        );
    }

    // Additional range checks if configured
    if (config?.min !== undefined) {
        const minDate = new Date(config.min);
        if (!isNaN(minDate.getTime()) && date < minDate) {
            return invalidResult(
                `Date must be on or after ${minDate.toISOString().split('T')[0]}`,
                config?.customErrorMessage
            );
        }
    }

    if (config?.max !== undefined) {
        const maxDate = new Date(config.max);
        if (!isNaN(maxDate.getTime()) && date > maxDate) {
            return invalidResult(
                `Date must be on or before ${maxDate.toISOString().split('T')[0]}`,
                config?.customErrorMessage
            );
        }
    }

    return validResult(date);
}

/**
 * Validate a birth date.
 * 
 * **Validations:**
 * - Valid date format
 * - Cannot be in the future
 * - Cannot be more than 130 years in the past
 * 
 * @param value - Birth date to validate
 * @param config - Optional validation configuration
 * @returns ValidationResult with Date object
 */
export function validateBirthDate(
    value: unknown,
    config?: ValidationConfig
): ValidationResult {
    if (isEmpty(value)) {
        return invalidResult('Birth date is required', config?.customErrorMessage);
    }

    const date = parseToDate(value);

    if (date === null) {
        return invalidResult(
            'Invalid date format',
            config?.customErrorMessage
        );
    }

    const now = new Date();

    // Cannot be in the future
    if (date > now) {
        return invalidResult(
            'Birth date cannot be in the future',
            config?.customErrorMessage
        );
    }

    // Cannot be more than 130 years ago
    const age = calculateAge(date, now);
    if (age > 130) {
        return invalidResult(
            'Birth date is too far in the past (max 130 years)',
            config?.customErrorMessage
        );
    }

    return validResult(date);
}

/**
 * Validate an age derived from a birth date.
 * 
 * **Validations:**
 * - Valid birth date
 * - Age between 0 and 130 years
 * - Optional min/max age from config
 * 
 * @param value - Birth date to calculate age from
 * @param config - Optional validation configuration
 * @returns ValidationResult with calculated age
 */
export function validateAge(
    value: unknown,
    config?: ValidationConfig
): ValidationResult {
    // Use birthDate from config if provided, otherwise use value
    const birthDateValue = config?.birthDate ?? value;

    if (isEmpty(birthDateValue)) {
        return invalidResult('Birth date is required to calculate age', config?.customErrorMessage);
    }

    const birthDate = parseToDate(birthDateValue);

    if (birthDate === null) {
        return invalidResult(
            'Invalid birth date format',
            config?.customErrorMessage
        );
    }

    const now = new Date();

    // Cannot be in the future
    if (birthDate > now) {
        return invalidResult(
            'Birth date cannot be in the future',
            config?.customErrorMessage
        );
    }

    const age = calculateAge(birthDate, now);

    // Age range validation
    if (age < 0) {
        return invalidResult(
            'Invalid age (negative)',
            config?.customErrorMessage
        );
    }

    if (age > 130) {
        return invalidResult(
            'Invalid age (exceeds 130 years)',
            config?.customErrorMessage
        );
    }

    // Optional age range from config
    if (config?.min !== undefined && age < config.min) {
        return invalidResult(
            `Age must be at least ${config.min}`,
            config?.customErrorMessage
        );
    }

    if (config?.max !== undefined && age > config.max) {
        return invalidResult(
            `Age must be at most ${config.max}`,
            config?.customErrorMessage
        );
    }

    return validResult(age);
}

export default { validateDate, validateBirthDate, validateAge };
