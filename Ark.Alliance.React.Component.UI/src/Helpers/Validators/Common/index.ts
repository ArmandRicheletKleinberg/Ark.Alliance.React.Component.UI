/**
 * @fileoverview Common Validators Barrel Export
 * @module Helpers/Validators/Common
 * 
 * General-purpose validators for common input types:
 * - Numeric (with range and decimal precision)
 * - Text (with length and character constraints)
 * - Email (RFC 5322 simplified)
 * - URL (with protocol validation)
 * - Phone (E.164 international format)
 * - Date/Age (with birth date calculation)
 */

export { validateNumeric } from './numeric';
export { validateText, validateAlpha, validateAlphanumeric } from './text';
export { validateEmail } from './email';
export { validateUrl } from './url';
export { validatePhone } from './phone';
export { validateDate, validateBirthDate, validateAge } from './date';
