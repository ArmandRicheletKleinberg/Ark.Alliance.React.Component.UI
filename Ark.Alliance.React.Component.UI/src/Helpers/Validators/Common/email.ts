/**
 * @fileoverview Email Validator
 * @module Helpers/Validators/Common/email
 * 
 * Validates email addresses using a simplified RFC 5322 pattern.
 * Balances strict validation with practical usability.
 * 
 * @example
 * ```typescript
 * validateEmail('user@example.com');
 * // { isValid: true, normalizedValue: 'user@example.com' }
 * ```
 */

import type { ValidationConfig, ValidationResult } from '../types';
import { isEmpty, validResult, invalidResult } from '../utils';

/**
 * RFC 5322 simplified email regex pattern.
 * Covers most practical email formats without over-complicating.
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Validate an email address.
 * 
 * **Validations:**
 * - Format check (RFC 5322 simplified)
 * - Maximum length (254 characters per RFC 5321)
 * - At least one @ symbol
 * - Valid domain structure
 * 
 * @param value - Email address to validate
 * @param config - Optional validation configuration
 * @returns ValidationResult with lowercase normalized email
 */
export function validateEmail(
    value: unknown,
    config?: ValidationConfig
): ValidationResult {
    if (isEmpty(value)) {
        return invalidResult('Email is required', config?.customErrorMessage);
    }

    const email = String(value).trim().toLowerCase();

    // Max email length per RFC 5321
    if (email.length > 254) {
        return invalidResult(
            'Email address is too long (max 254 characters)',
            config?.customErrorMessage
        );
    }

    // Must contain @ symbol
    if (!email.includes('@')) {
        return invalidResult(
            'Invalid email format: missing @ symbol',
            config?.customErrorMessage
        );
    }

    // Validate format
    if (!EMAIL_REGEX.test(email)) {
        return invalidResult(
            'Invalid email format',
            config?.customErrorMessage
        );
    }

    // Check local part length (before @)
    const [localPart, domain] = email.split('@');
    if (localPart.length > 64) {
        return invalidResult(
            'Email local part too long (max 64 characters)',
            config?.customErrorMessage
        );
    }

    // Domain must have at least one dot for TLD
    if (!domain.includes('.')) {
        return invalidResult(
            'Invalid email domain: missing top-level domain',
            config?.customErrorMessage
        );
    }

    return validResult(email);
}

export default validateEmail;
