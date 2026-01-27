/**
 * @fileoverview Font Awesome Icon Component Model
 * @module components/Icon/FAIcon
 * 
 * Model definitions for Font Awesome icon component.
 * Extends the base icon model with Font Awesome specific properties.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';
import {
    ExtendedSizeSchema,
    RotationSchema,
    FlipSchema,
    HorizontalPositionSchema,
} from '../../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Font Awesome icon style variants
 */
export const FAIconStyle = z.enum(['solid', 'regular', 'brands']);

/**
 * Font Awesome icon prefix (internal use)
 */
export const FAIconPrefix = z.enum(['fas', 'far', 'fab']);

/**
 * Icon size variants (matching base Icon + FA specific 3x-5x)
 */
export const FAIconSize = z.union([
    ExtendedSizeSchema,
    z.enum(['3x', '4x', '5x']),
]);

/**
 * Icon rotation angles
 */
export const FAIconRotation = RotationSchema;

/**
 * Icon flip directions
 */
export const FAIconFlip = FlipSchema;

/**
 * Font Awesome Icon model schema
 */
export const FAIconModelSchema = extendSchema({
    /** Icon name (e.g., 'user', 'check', 'github') */
    name: z.string(),

    /** Icon style (solid, regular, or brands) */
    iconStyle: FAIconStyle.default('solid'),

    /** Size of the icon */
    size: FAIconSize.default('md'),

    /** Custom color (CSS color value) */
    color: z.string().optional(),

    /** Rotation angle in degrees */
    rotation: FAIconRotation.default('0'),

    /** Flip direction */
    flip: FAIconFlip.default('none'),

    /** Whether the icon should spin (for loading states) */
    spin: z.boolean().default(false),

    /** Pulse animation (8-step rotation) */
    pulse: z.boolean().default(false),

    /** Fixed width mode (useful for alignment in lists) */
    fixedWidth: z.boolean().default(false),

    /** Border around icon */
    border: z.boolean().default(false),

    /** Pull icon left or right (float behavior) */
    pull: HorizontalPositionSchema.optional(),

    /** Cursor style when interactive */
    cursor: z.enum(['default', 'pointer', 'not-allowed']).optional(),

    /** Beat animation */
    beat: z.boolean().default(false),

    /** Fade animation */
    fade: z.boolean().default(false),

    /** Bounce animation */
    bounce: z.boolean().default(false),

    /** Shake animation */
    shake: z.boolean().default(false),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type FAIconStyleType = z.infer<typeof FAIconStyle>;
export type FAIconPrefixType = z.infer<typeof FAIconPrefix>;
export type FAIconSizeType = z.infer<typeof FAIconSize>;
export type FAIconRotationType = z.infer<typeof FAIconRotation>;
export type FAIconFlipType = z.infer<typeof FAIconFlip>;
export type FAIconModel = z.infer<typeof FAIconModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default FAIcon model values
 */
export const defaultFAIconModel: Omit<FAIconModel, 'name'> & { name?: string } = {
    name: undefined,
    variant: 'default',
    iconStyle: 'solid',
    size: 'md',
    rotation: '0',
    flip: 'none',
    spin: false,
    pulse: false,
    fixedWidth: false,
    border: false,
    beat: false,
    fade: false,
    bounce: false,
    shake: false,
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
 * Create a FAIcon model with custom values
 */
export function createFAIconModel(data: Partial<FAIconModel> & { name: string }): FAIconModel {
    return FAIconModelSchema.parse(data);
}

// ═══════════════════════════════════════════════════════════════════════════
// SIZE MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Size to Font Awesome size class mapping
 */
export const FA_SIZE_MAP: Record<FAIconSizeType, string | undefined> = {
    xs: 'xs',
    sm: 'sm',
    md: undefined, // Default size, no class needed
    lg: 'lg',
    xl: 'xl',
    '2xl': '2xl',
    '3xl': '3xl',
    '3x': '3x',
    '4x': '4x',
    '5x': '5x',
};

/**
 * Style to prefix mapping
 */
export const STYLE_PREFIX_MAP: Record<FAIconStyleType, FAIconPrefixType> = {
    solid: 'fas',
    regular: 'far',
    brands: 'fab',
};
