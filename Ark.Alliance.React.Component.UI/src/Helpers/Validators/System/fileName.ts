/**
 * @fileoverview File Name Validator
 * @module Helpers/Validators/System/fileName
 * 
 * Validates file names for cross-platform compatibility.
 * Checks for forbidden characters, reserved names, and invalid patterns.
 * 
 * @example
 * ```typescript
 * validateFileName('document.pdf');
 * // { isValid: true, normalizedValue: 'document.pdf' }
 * 
 * validateFileName('my:file.txt');
 * // { isValid: false, errorMessage: 'File name contains forbidden character: :' }
 * 
 * validateFileName('CON.txt');
 * // { isValid: false, errorMessage: 'File name uses reserved Windows name: CON' }
 * ```
 */

import type { ValidationConfig, ValidationResult } from '../types';
import { isEmpty, validResult, invalidResult } from '../utils';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/** Characters forbidden in Windows file names */
const FORBIDDEN_CHARS = /[<>:"/\\|?*]/;

/** Control characters (0-31) */
const CONTROL_CHARS = /[\x00-\x1F]/;

/** 
 * Windows reserved file names (case-insensitive)
 * These names cannot be used for files or directories in Windows.
 */
const RESERVED_NAMES = new Set([
    'CON', 'PRN', 'AUX', 'NUL',
    'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
    'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9',
]);

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate a file name for cross-platform compatibility.
 * 
 * **Validations (Windows/Cross-platform safe):**
 * - Forbidden characters: < > : " / \ | ? *
 * - Control characters: ASCII 0-31
 * - Reserved names: CON, PRN, AUX, NUL, COM1-9, LPT1-9
 * - Cannot end with space or dot
 * - Maximum length (255 characters by default)
 * - Optional file extension validation
 * 
 * @param value - File name to validate
 * @param config - Optional validation configuration
 * @returns ValidationResult with trimmed file name
 */
export function validateFileName(
    value: unknown,
    config?: ValidationConfig
): ValidationResult {
    if (isEmpty(value)) {
        return invalidResult('File name is required', config?.customErrorMessage);
    }

    const fileName = String(value).trim();

    // Empty after trim
    if (fileName.length === 0) {
        return invalidResult(
            'File name cannot be empty or only whitespace',
            config?.customErrorMessage
        );
    }

    // Max length check (default 255)
    const maxLength = config?.maxLength ?? 255;
    if (fileName.length > maxLength) {
        return invalidResult(
            `File name too long (max ${maxLength} characters)`,
            config?.customErrorMessage
        );
    }

    // Min length check
    if (config?.minLength !== undefined && fileName.length < config.minLength) {
        return invalidResult(
            `File name too short (min ${config.minLength} characters)`,
            config?.customErrorMessage
        );
    }

    // Check for forbidden characters
    const forbiddenMatch = fileName.match(FORBIDDEN_CHARS);
    if (forbiddenMatch) {
        return invalidResult(
            `File name contains forbidden character: ${forbiddenMatch[0]}`,
            config?.customErrorMessage
        );
    }

    // Check for control characters
    if (CONTROL_CHARS.test(fileName)) {
        return invalidResult(
            'File name contains control characters',
            config?.customErrorMessage
        );
    }

    // Cannot end with space or dot
    if (fileName.endsWith(' ') || fileName.endsWith('.')) {
        return invalidResult(
            'File name cannot end with a space or dot',
            config?.customErrorMessage
        );
    }

    // Check for Windows reserved names
    const nameWithoutExtension = fileName.includes('.')
        ? fileName.substring(0, fileName.indexOf('.'))
        : fileName;

    if (RESERVED_NAMES.has(nameWithoutExtension.toUpperCase())) {
        return invalidResult(
            `File name uses reserved Windows name: ${nameWithoutExtension}`,
            config?.customErrorMessage
        );
    }

    // Optional: validate file extension
    if (config?.acceptedFileExtensions && config.acceptedFileExtensions.length > 0) {
        const extension = fileName.includes('.')
            ? fileName.substring(fileName.lastIndexOf('.')).toLowerCase()
            : '';

        const normalizedExtensions = config.acceptedFileExtensions.map(ext =>
            ext.toLowerCase().startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`
        );

        if (!normalizedExtensions.includes(extension)) {
            return invalidResult(
                `File extension not allowed. Accepted: ${normalizedExtensions.join(', ')}`,
                config?.customErrorMessage
            );
        }
    }

    return validResult(fileName);
}

export default validateFileName;
