/**
 * @fileoverview URL Validator
 * @module Helpers/Validators/Common/url
 * 
 * Validates URL addresses with support for various protocols.
 * 
 * @example
 * ```typescript
 * validateUrl('https://example.com/path?query=value');
 * // { isValid: true, normalizedValue: 'https://example.com/path?query=value' }
 * ```
 */

import type { ValidationConfig, ValidationResult } from '../types';
import { isEmpty, validResult, invalidResult } from '../utils';

/**
 * URL pattern supporting common protocols.
 * Matches http, https, ftp, and protocol-relative URLs.
 */
const URL_REGEX = /^(?:(?:https?|ftp):\/\/)?(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|localhost|\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?(?:\/[^\s]*)?$/;

/**
 * Validate a URL.
 * 
 * **Validations:**
 * - Format check (domain structure)
 * - Protocol validation (http, https, ftp)
 * - Optional port and path support
 * 
 * @param value - URL to validate
 * @param config - Optional validation configuration
 * @returns ValidationResult with normalized URL
 */
export function validateUrl(
    value: unknown,
    config?: ValidationConfig
): ValidationResult {
    if (isEmpty(value)) {
        return invalidResult('URL is required', config?.customErrorMessage);
    }

    const url = String(value).trim();

    // Max URL length (practical limit)
    if (url.length > 2048) {
        return invalidResult(
            'URL is too long (max 2048 characters)',
            config?.customErrorMessage
        );
    }

    // Try native URL parsing first (more accurate)
    try {
        // Add protocol if missing for URL constructor
        const urlWithProtocol = url.includes('://') ? url : `https://${url}`;
        new URL(urlWithProtocol);

        // If native parsing works, also validate with regex for stricter check
        if (!URL_REGEX.test(url)) {
            return invalidResult(
                'Invalid URL format',
                config?.customErrorMessage
            );
        }
    } catch {
        return invalidResult(
            'Invalid URL format',
            config?.customErrorMessage
        );
    }

    return validResult(url);
}

export default validateUrl;
