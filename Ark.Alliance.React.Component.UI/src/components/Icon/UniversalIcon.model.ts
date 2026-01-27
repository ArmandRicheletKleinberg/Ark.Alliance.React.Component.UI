/**
 * @fileoverview Universal Icon Component Model
 * @module components/Icon/UniversalIcon
 * 
 * Unified model for the universal Icon component that supports both
 * internal SVG icons and Font Awesome icons.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';
import {
    ExtendedSizeSchema,
    RotationSchema,
    FlipSchema,
    HorizontalPositionSchema
} from '../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SHARED DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export const IconSourceSchema = z.enum(['auto', 'svg', 'font-awesome']);
export const IconStyleSchema = z.enum(['solid', 'regular', 'brands']);

/**
 * Unified size schema (includes FA large sizes)
 */
export const UniversalIconSizeSchema = z.union([
    ExtendedSizeSchema,
    z.enum(['3x', '4x', '5x'])
]);

// ═══════════════════════════════════════════════════════════════════════════
// UNIVERSAL ICON SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const UniversalIconModelSchema = extendSchema({
    /** Icon name (Registry key or FontAwesome name) */
    name: z.string(),

    /** 
     * Explicit source definition.
     * - 'auto': Try SVG registry first, fallback to FA (default)
     * - 'svg': Force SVG registry lookup
     * - 'font-awesome': Force Font Awesome lookup
     */
    source: IconSourceSchema.default('auto'),

    /** Icon style (for Font Awesome) */
    iconStyle: IconStyleSchema.default('solid'),

    /** Size of the icon */
    size: UniversalIconSizeSchema.default('md'),

    /** Custom color (CSS color value) */
    color: z.string().optional(),

    /** Rotation angle */
    rotation: RotationSchema.default('0'),

    /** Flip direction */
    flip: FlipSchema.default('none'),

    /** Spin animation */
    spin: z.boolean().default(false),

    /** Pulse animation (FA only) */
    pulse: z.boolean().default(false),

    /** Beat animation (FA only) */
    beat: z.boolean().default(false),

    /** Fade animation (FA only) */
    fade: z.boolean().default(false),

    /** Bounce animation (FA only) */
    bounce: z.boolean().default(false),

    /** Shake animation (FA only) */
    shake: z.boolean().default(false),

    /** Fixed width (FA only) */
    fixedWidth: z.boolean().default(false),

    /** Border (FA only) */
    border: z.boolean().default(false),

    /** Pull icon (FA only) */
    pull: HorizontalPositionSchema.optional(),

    /** Custom stroke width (SVG only) */
    strokeWidth: z.number().min(0.5).max(4).default(2),

    /** Filled state (SVG only, though FA implies with style) */
    filled: z.boolean().default(false),

    /** Custom viewBox (SVG only) */
    viewBox: z.string().optional(),

    /** Cursor style */
    cursor: z.enum(['default', 'pointer', 'not-allowed']).optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type IconSource = z.infer<typeof IconSourceSchema>;
export type IconStyle = z.infer<typeof IconStyleSchema>;
export type UniversalIconSize = z.infer<typeof UniversalIconSizeSchema>;
export type UniversalIconModel = z.infer<typeof UniversalIconModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

export const defaultUniversalIconModel: Omit<UniversalIconModel, 'name'> & { name?: string } = {
    name: undefined,
    variant: 'default',
    source: 'auto',
    iconStyle: 'solid',
    size: 'md',
    rotation: '0',
    flip: 'none',
    spin: false,
    pulse: false,
    beat: false,
    fade: false,
    bounce: false,
    shake: false,
    fixedWidth: false,
    border: false,
    strokeWidth: 2,
    filled: false,
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

export function createUniversalIconModel(data: Partial<UniversalIconModel> & { name: string }): UniversalIconModel {
    return UniversalIconModelSchema.parse(data);
}
