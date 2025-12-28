/**
 * @fileoverview Typography Enum Definitions
 * @module core/enums/Typography
 * 
 * Centralized typography enums for font weights, text transforms, alignments.
 * 
 * @example
 * ```typescript
 * import { FontWeightSchema, TextAlignmentSchema } from '@core/enums';
 * 
 * const labelModel = z.object({
 *     weight: FontWeightSchema.default('normal'),
 *     align: TextAlignmentSchema.default('left'),
 * });
 * ```
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Font weight options.
 * 
 * | Weight | CSS Value |
 * |--------|-----------|
 * | `normal` | 400 |
 * | `medium` | 500 |
 * | `semibold` | 600 |
 * | `bold` | 700 |
 * | `extrabold` | 800 |
 */
export const FontWeightSchema = z.enum([
    'normal',
    'medium',
    'semibold',
    'bold',
    'extrabold',
]);

/**
 * Basic font weight (3 values).
 */
export const BasicFontWeightSchema = z.enum(['normal', 'medium', 'bold']);

/**
 * Text transform options.
 */
export const TextTransformSchema = z.enum([
    'none',
    'uppercase',
    'lowercase',
    'capitalize',
]);

/**
 * Text alignment options.
 */
export const TextAlignmentSchema = z.enum(['left', 'center', 'right', 'justify']);

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/** Font weight type */
export type FontWeight = z.infer<typeof FontWeightSchema>;

/** Basic font weight type */
export type BasicFontWeight = z.infer<typeof BasicFontWeightSchema>;

/** Text transform type */
export type TextTransform = z.infer<typeof TextTransformSchema>;

/** Text alignment type */
export type TextAlignment = z.infer<typeof TextAlignmentSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Font weight to CSS numeric value mapping.
 */
export const FONT_WEIGHT_VALUES: Record<FontWeight, number> = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
};

/**
 * Default font weight.
 */
export const DEFAULT_FONT_WEIGHT: FontWeight = 'normal';

/**
 * Default text alignment.
 */
export const DEFAULT_TEXT_ALIGNMENT: TextAlignment = 'left';
