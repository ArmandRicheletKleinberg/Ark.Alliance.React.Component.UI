/**
 * @fileoverview Input Validation Module
 * @module core/validation
 * 
 * Centralized validation logic for input components.
 * Provides schema validation using Zod and helper utilities.
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ValidationResult = {
    isValid: boolean;
    errorMessage?: string;
};

export type Validator<T = any> = (value: T) => ValidationResult;

// ═══════════════════════════════════════════════════════════════════════════
// COMMON SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

export const EmailSchema = z.string().email('Invalid email address');

export const PhoneSchema = z.string().regex(
    /^\+?[1-9]\d{1,14}$/,
    'Invalid phone number'
);

export const PasswordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

export const UrlSchema = z.string().url('Invalid URL');

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATORS
// ═══════════════════════════════════════════════════════════════════════════

export const validateEmail: Validator<string> = (value) => {
    const result = EmailSchema.safeParse(value);
    return result.success
        ? { isValid: true }
        : { isValid: false, errorMessage: result.error.issues[0].message };
};

export const validatePhone: Validator<string> = (value) => {
    const result = PhoneSchema.safeParse(value);
    return result.success
        ? { isValid: true }
        : { isValid: false, errorMessage: result.error.issues[0].message };
};

export const validateRequired: Validator<any> = (value) => {
    const isValid = value !== undefined && value !== null && value !== '';
    return isValid
        ? { isValid: true }
        : { isValid: false, errorMessage: 'This field is required' };
};
