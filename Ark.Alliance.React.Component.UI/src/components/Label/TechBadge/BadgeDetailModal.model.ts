/**
 * @fileoverview Badge Detail Modal Model
 * @module components/Label/TechBadge
 * 
 * Generic modal for displaying badge details. Works for technology badges,
 * skill badges, or any badge that needs a detail popup.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Link schema for detail modal
 */
export const BadgeDetailLinkSchema = z.object({
    /** Link label */
    label: z.string(),
    /** Link URL */
    url: z.string(),
    /** Icon class (optional) */
    icon: z.string().optional(),
});

/**
 * Badge detail data schema
 * Generic structure that works for any badge type
 */
export const BadgeDetailDataSchema = z.object({
    /** Display name/title */
    name: z.string(),
    /** Category or type label */
    category: z.string().optional(),
    /** Description text */
    description: z.string().optional(),
    /** Icon class (Font Awesome, Lucide, etc.) */
    icon: z.string().optional(),
    /** Brand/accent color */
    color: z.string().default('#3b82f6'),
    /** Related links (website, docs, etc.) */
    links: z.array(BadgeDetailLinkSchema).optional(),
    /** Additional metadata as key-value pairs */
    metadata: z.record(z.string()).optional(),
    /** Version or level info */
    version: z.string().optional(),
});

/**
 * Badge detail modal model schema
 */
export const BadgeDetailModalModelSchema = extendSchema({
    /** Whether modal is open */
    isOpen: z.boolean().default(false),

    /** Badge detail data to display */
    data: BadgeDetailDataSchema.optional(),

    /** Close handler */
    onClose: z.function().optional(),

    /** Show backdrop blur */
    showBackdrop: z.boolean().default(true),

    /** Allow close on overlay click */
    closeOnOverlayClick: z.boolean().default(true),

    /** Allow close on escape key */
    closeOnEscape: z.boolean().default(true),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type BadgeDetailLink = z.infer<typeof BadgeDetailLinkSchema>;
export type BadgeDetailData = z.infer<typeof BadgeDetailDataSchema>;
export type BadgeDetailModalModel = z.infer<typeof BadgeDetailModalModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default badge detail modal model values
 */
export const defaultBadgeDetailModalModel: BadgeDetailModalModel = BadgeDetailModalModelSchema.parse({});

/**
 * Create a badge detail modal model with custom values
 */
export function createBadgeDetailModalModel(data: Partial<BadgeDetailModalModel> = {}): BadgeDetailModalModel {
    return BadgeDetailModalModelSchema.parse({ ...defaultBadgeDetailModalModel, ...data });
}
