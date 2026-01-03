/**
 * @fileoverview TechBadge Component Model
 * @module components/Label/TechBadge
 * 
 * Defines the data structure, validation, and defaults for technology badges.
 * Used to display technology/framework badges with icons and colors.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';
import { BasicSizeSchema, type BasicSize } from '../../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Technology data schema for badge display
 */
export const TechnologyDataSchema = z.object({
    /** Unique key identifier (e.g., "react", "typescript") */
    key: z.string().optional(),
    /** Display name (e.g., "React", "TypeScript") */
    name: z.string(),
    /** Brief description of the technology */
    description: z.string().optional(),
    /** Icon class name (Font Awesome or Devicon) */
    icon: z.string().optional(),
    /** Brand color in hex format */
    color: z.string().default('#64748b'),
    /** Official website URL */
    website: z.string().optional(),
    /** Category (e.g., "frontend", "backend") */
    category: z.string().optional(),
});

/**
 * TechBadge model schema extending base model
 */
export const TechBadgeModelSchema = extendSchema({
    /** Technology key for lookup */
    techKey: z.string(),

    /** Technology data (when provided directly) */
    technology: TechnologyDataSchema.optional(),

    /** Size variant */
    size: BasicSizeSchema.default('md'),

    /** Show technology icon */
    showIcon: z.boolean().default(false),

    /** Active/selected state */
    active: z.boolean().default(false),

    /** Click handler - receives TechnologyData */
    onClick: z.function().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type TechnologyData = z.infer<typeof TechnologyDataSchema>;
export type TechBadgeSizeType = BasicSize;
export type TechBadgeModel = z.infer<typeof TechBadgeModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// SIZE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Size classes for tech badges
 */
export const TECH_BADGE_SIZE_CLASSES = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
    lg: 'text-sm px-4 py-1.5 gap-2',
} as const;

/**
 * Icon size by badge size
 */
export const TECH_BADGE_ICON_SIZES = {
    sm: '10px',
    md: '12px',
    lg: '14px',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default tech badge model values
 */
export const defaultTechBadgeModel: TechBadgeModel = TechBadgeModelSchema.parse({
    techKey: '',
});

/**
 * Create a tech badge model with custom values
 */
export function createTechBadgeModel(data: Partial<TechBadgeModel> = {}): TechBadgeModel {
    return TechBadgeModelSchema.parse({ ...defaultTechBadgeModel, ...data });
}
