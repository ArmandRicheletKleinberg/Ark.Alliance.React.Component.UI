/**
 * @fileoverview Toast Component Model
 * @module components/Toast
 * 
 * Defines the data structure, validation, and defaults for the Toast notification component.
 * Uses Zod for runtime validation and type safety.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';
import {
    ToastPositionSchema,
    SemanticStatusSchema,
    type ToastPosition,
    type SemanticStatus,
} from '../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Toast type/severity variants
 */
export const ToastType = SemanticStatusSchema;

/**
 * Toast position options
 */
export const ToastPosition = ToastPositionSchema;

/**
 * Individual toast item schema
 */
export const ToastItemSchema = z.object({
    /** Unique identifier */
    id: z.string(),
    /** Toast message */
    message: z.string(),
    /** Toast type/severity */
    type: ToastType.default('info'),
    /** Optional title */
    title: z.string().optional(),
    /** Duration in ms before auto-dismiss (0 = manual only) */
    duration: z.number().min(0).default(4000),
    /** Optional icon name (uses IconRegistry) */
    icon: z.string().optional(),
    /** Whether toast is dismissable */
    dismissible: z.boolean().default(true),
    /** Optional action button */
    action: z.object({
        label: z.string(),
        onClick: z.custom<() => void>((val) => typeof val === 'function', {
            message: 'onClick must be a function',
        }),
    }).optional(),
    /** Creation timestamp */
    createdAt: z.number().optional(),
});

/**
 * Toast container model schema extending base model
 */
export const ToastModelSchema = extendSchema({
    /** Position of toast container */
    position: ToastPosition.default('top-right'),
    /** Maximum number of toasts to display */
    maxToasts: z.number().min(1).default(5),
    /** Whether to stack toasts (vs replace) */
    stacked: z.boolean().default(true),
    /** Gap between toasts in pixels */
    gap: z.number().default(12),
    /** Animation duration in ms */
    animationDuration: z.number().default(300),
    /** Whether toasts pause on hover */
    pauseOnHover: z.boolean().default(true),
    /** Whether toasts pause on window blur */
    pauseOnFocusLoss: z.boolean().default(true),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type ToastTypeValue = SemanticStatus;
export type ToastPositionType = ToastPosition;
export type ToastItem = z.infer<typeof ToastItemSchema>;
export type ToastModel = z.infer<typeof ToastModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default toast model values
 */
export const defaultToastModel: ToastModel = ToastModelSchema.parse({});

/**
 * Default icons for toast types
 */
export const TOAST_TYPE_ICONS: Record<ToastTypeValue, string> = {
    success: 'check-circle',
    error: 'x-circle',
    warning: 'alert-triangle',
    info: 'info',
};

/**
 * Default colors for toast types (CSS custom property names)
 */
export const TOAST_TYPE_COLORS: Record<ToastTypeValue, string> = {
    success: 'var(--ark-success)',
    error: 'var(--ark-error)',
    warning: 'var(--ark-warning)',
    info: 'var(--ark-info)',
    neutral: 'var(--ark-text-secondary)', // Mapping neutral to secondary text color
};

// ═══════════════════════════════════════════════════════════════════════════
// FACTORY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a toast model with custom values
 */
export function createToastModel(data: Partial<ToastModel> = {}): ToastModel {
    return ToastModelSchema.parse(data);
}

/**
 * Create a toast item with auto-generated ID and timestamp
 */
export function createToastItem(data: Omit<ToastItem, 'id' | 'createdAt'> & { id?: string }): ToastItem {
    return ToastItemSchema.parse({
        ...data,
        id: data.id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
    });
}
