/**
 * @fileoverview Icon Component Model
 * @module components/Icon
 * 
 * Defines the data structure, validation, and defaults for the Icon component.
 * Uses Zod for runtime validation and type safety.
 */

import { z } from 'zod';
import { extendSchema } from '../../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Icon size variants
 */
export const IconSize = z.enum(['xs', 'sm', 'md', 'lg', 'xl', '2xl']);

/**
 * Icon rotation angles
 */
export const IconRotation = z.enum(['0', '90', '180', '270']);

/**
 * Icon flip directions
 */
export const IconFlip = z.enum(['none', 'horizontal', 'vertical', 'both']);

/**
 * Icon model schema extending base model
 */
export const IconModelSchema = extendSchema({
    /** Icon name (must exist in IconRegistry) */
    name: z.string(),

    /** Size of the icon */
    size: IconSize.default('md'),

    /** Custom color (CSS color value) */
    color: z.string().optional(),

    /** Rotation angle in degrees */
    rotation: IconRotation.default('0'),

    /** Flip direction */
    flip: IconFlip.default('none'),

    /** Whether the icon should spin (for loading states) */
    spin: z.boolean().default(false),

    /** Custom stroke width for SVG icons */
    strokeWidth: z.number().min(0.5).max(4).default(2),

    /** Whether the icon should be filled instead of stroked */
    filled: z.boolean().default(false),

    /** Custom viewBox for the SVG */
    viewBox: z.string().default('0 0 24 24'),

    /** Cursor style when interactive */
    cursor: z.enum(['default', 'pointer', 'not-allowed']).optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type IconSizeType = z.infer<typeof IconSize>;
export type IconRotationType = z.infer<typeof IconRotation>;
export type IconFlipType = z.infer<typeof IconFlip>;
export type IconModel = z.infer<typeof IconModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// ICON DEFINITION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Icon definition structure for registry
 */
export interface IconDefinition {
    /** Unique name for the icon */
    name: string;

    /** SVG path data (d attribute) */
    path: string;

    /** Optional multiple paths for complex icons */
    paths?: string[];

    /** Custom viewBox (defaults to "0 0 24 24") */
    viewBox?: string;

    /** Whether the icon should be filled by default */
    filled?: boolean;

    /** Category for organization */
    category?: string;

    /** Tags for searching */
    tags?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default icon model values
 */
export const defaultIconModel: Omit<IconModel, 'name'> & { name?: string } = {
    name: undefined,
    size: 'md',
    rotation: '0',
    flip: 'none',
    spin: false,
    strokeWidth: 2,
    filled: false,
    viewBox: '0 0 24 24',
    disabled: false,
    loading: false,
    focusable: false,
    clickable: false,
    doubleClickable: false,
    draggable: false,
    droppable: false,
    mouseOverEnabled: false,
    mouseMoveEnabled: false,
    mouseEnterEnabled: false,
    tooltipPosition: 'top',
    tooltipDelay: 300,
};

/**
 * Create an icon model with custom values
 */
export function createIconModel(data: Partial<IconModel> & { name: string }): IconModel {
    return IconModelSchema.parse(data);
}

// ═══════════════════════════════════════════════════════════════════════════
// SIZE MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Size to pixel mapping
 */
export const ICON_SIZE_MAP: Record<IconSizeType, number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 48,
};
