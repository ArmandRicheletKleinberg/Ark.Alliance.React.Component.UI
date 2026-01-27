/**
 * @fileoverview Badge Component Model
 * @module components/Label/Badge
 * 
 * Defines the data structure, validation, and defaults for status badges.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';
import { STATUS_COLORS, type StatusType } from '../../../core/constants';
import {
    BasicSizeSchema,
    ServiceStatusSchema,
    ProcessStatusSchema,
    SemanticStatusSchema,
    type BasicSize,
    type ServiceStatus,
    type ProcessStatus,
    type SemanticStatus,
} from '../../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Badge status variants (component-specific)
 * Includes both system statuses (running, stopped, etc.) and priority indicators (success, warning, etc.)
 */
export const BadgeStatus = z.union([
    ServiceStatusSchema,
    ProcessStatusSchema,
    SemanticStatusSchema,
    z.literal('danger'), // Backwards compatibility
]);

/**
 * Badge size variants
 * @deprecated Use BasicSizeSchema from '@core/enums' instead
 */
export const BadgeSize = BasicSizeSchema;

/**
 * Badge model schema extending base model
 */
export const BadgeModelSchema = extendSchema({
    /** Status type */
    status: BadgeStatus.default('idle'),

    /** Custom label (defaults to status label) */
    label: z.string().optional(),

    /** Size variant */
    size: BasicSizeSchema.default('md'),

    /** Show animated pulse for 'running' status */
    showPulse: z.boolean().default(true),

    /** Custom background color (overrides status) */
    bgColor: z.string().optional(),

    /** Custom text color (overrides status) */
    textColor: z.string().optional(),

    /** Custom border color (overrides status) */
    borderColor: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type BadgeStatusType = ServiceStatus | ProcessStatus | SemanticStatus | 'danger';
export type BadgeSizeType = BasicSize;
export type BadgeModel = z.infer<typeof BadgeModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// SIZE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Size classes for badges
 */
export const BADGE_SIZE_CLASSES = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get status color configuration
 */
export function getBadgeStatusConfig(status: StatusType) {
    return STATUS_COLORS[status];
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default badge model values
 */
export const defaultBadgeModel: BadgeModel = BadgeModelSchema.parse({});

/**
 * Create a badge model with custom values
 */
export function createBadgeModel(data: Partial<BadgeModel> = {}): BadgeModel {
    return BadgeModelSchema.parse(data);
}
