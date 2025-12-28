/**
 * @fileoverview Input Validation Helper Library
 * @module Helpers/Validators
 * 
 * Comprehensive, strictly typed, pure-function based validation library.
 * Supports Finance, Logistics, Common, and System validation standards.
 * 
 * ## Features
 * - **Pure Functions**: No side effects, fully testable
 * - **Strict Typing**: Full TypeScript support with strict mode
 * - **No Dependencies**: Uses native Math, BigInt, and RegExp
 * - **Domain-Organized**: Finance, Logistics, Common, System categories
 * 
 * ## Supported Validators
 * 
 * ### Finance
 * - **IBAN** - ISO 13616 Mod 97-10 algorithm
 * - **ISIN** - ISO 6166 Luhn variant algorithm
 * 
 * ### Logistics (GS1)
 * - **GLN** - Global Location Number (13 digits)
 * - **GTIN** - Global Trade Item Number (8/12/13/14 digits)
 * - **SSCC** - Serial Shipping Container Code (18 digits)
 * 
 * ### Common
 * - **Numeric** - Range and decimal precision validation
 * - **Text** - Length and character constraints
 * - **Email** - RFC 5322 simplified validation
 * - **URL** - Protocol and domain validation
 * - **Phone** - E.164 international format
 * - **Date/Age** - Date parsing and age calculation
 * 
 * ### System
 * - **FileName** - Cross-platform safe file names
 * 
 * @example
 * ```typescript
 * import { validateInput, InputType } from '@/Helpers/Validators';
 * 
 * // Validate IBAN
 * const ibanResult = validateInput('GB82WEST12345698765432', InputType.Iban);
 * 
 * // Validate with config
 * const numResult = validateInput(123.45, InputType.Numeric, {
 *     min: 0,
 *     max: 1000,
 *     decimals: { max: 2 }
 * });
 * 
 * // Handle result
 * if (result.isValid) {
 *     console.log('Valid:', result.normalizedValue);
 * } else {
 *     console.error('Error:', result.errorMessage);
 * }
 * ```
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export {
    InputType,
    type ValidationConfig,
    type ValidationResult,
    type ValidatorFn,
    type DecimalConfig,
} from './types';

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATOR EXPORTS BY DOMAIN
// ═══════════════════════════════════════════════════════════════════════════

// Finance
export { validateIban, validateIsin } from './Finance';

// Logistics
export { validateGln, validateGtin, validateSscc } from './Logistics';

// Common
export {
    validateNumeric,
    validateText,
    validateAlpha,
    validateAlphanumeric,
    validateEmail,
    validateUrl,
    validatePhone,
    validateDate,
    validateBirthDate,
    validateAge,
} from './Common';

// System
export { validateFileName } from './System';

// ═══════════════════════════════════════════════════════════════════════════
// MASTER VALIDATOR FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

import { InputType, type ValidationConfig, type ValidationResult } from './types';
import { validateIban, validateIsin } from './Finance';
import { validateGln, validateGtin } from './Logistics';
import {
    validateNumeric,
    validateText,
    validateEmail,
    validateUrl,
    validatePhone,
    validateDate,
    validateAge,
} from './Common';
import { validateFileName } from './System';
import { invalidResult } from './utils';

/**
 * Master validation function that delegates to type-specific validators.
 * 
 * This is the primary entry point for the validation library.
 * It acts as a router, directing validation requests to the appropriate
 * specialized validator based on the InputType.
 * 
 * @param value - Value to validate (any type)
 * @param type - Type of validation to perform (from InputType enum)
 * @param config - Optional validation configuration
 * @returns Standardized ValidationResult object
 * 
 * @example
 * ```typescript
 * // Finance validation
 * validateInput('GB82WEST12345698765432', InputType.Iban);
 * validateInput('US0378331005', InputType.Isin);
 * 
 * // Logistics validation
 * validateInput('5060012345678', InputType.Gln);
 * validateInput('5901234123457', InputType.Gtin);
 * 
 * // Common validation
 * validateInput(99.99, InputType.Numeric, { min: 0, max: 100 });
 * validateInput('user@example.com', InputType.Email);
 * validateInput('+1 555 123 4567', InputType.Phone);
 * 
 * // System validation
 * validateInput('document.pdf', InputType.FileName, {
 *     acceptedFileExtensions: ['.pdf', '.doc']
 * });
 * ```
 */
export function validateInput(
    value: unknown,
    type: InputType,
    config?: ValidationConfig
): ValidationResult {
    switch (type) {
        // ═══════════════════════════════════════════════════════════════════
        // FINANCE
        // ═══════════════════════════════════════════════════════════════════
        case InputType.Iban:
            return validateIban(value, config);

        case InputType.Isin:
            return validateIsin(value, config);

        // ═══════════════════════════════════════════════════════════════════
        // LOGISTICS
        // ═══════════════════════════════════════════════════════════════════
        case InputType.Gln:
            return validateGln(value, config);

        case InputType.Gtin:
            return validateGtin(value, config);

        // ═══════════════════════════════════════════════════════════════════
        // COMMON
        // ═══════════════════════════════════════════════════════════════════
        case InputType.Numeric:
            return validateNumeric(value, config);

        case InputType.Text:
            return validateText(value, config);

        case InputType.Email:
            return validateEmail(value, config);

        case InputType.Url:
            return validateUrl(value, config);

        case InputType.Phone:
            return validatePhone(value, config);

        case InputType.Date:
            return validateDate(value, config);

        case InputType.Age:
            return validateAge(value, config);

        // ═══════════════════════════════════════════════════════════════════
        // SYSTEM
        // ═══════════════════════════════════════════════════════════════════
        case InputType.FileName:
            return validateFileName(value, config);

        // ═══════════════════════════════════════════════════════════════════
        // UNKNOWN TYPE
        // ═══════════════════════════════════════════════════════════════════
        default:
            return invalidResult(
                `Unknown input type: ${type}`,
                config?.customErrorMessage
            );
    }
}

export default validateInput;
