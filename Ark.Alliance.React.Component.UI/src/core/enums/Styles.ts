/**
 * @fileoverview Style Enum Definitions
 * @module core/enums/Styles
 * 
 * Centralized style-related enums for borders, padding, resize modes.
 * 
 * @example
 * ```typescript
 * import { LineStyleSchema, PaddingSchema } from '@core/enums';
 * 
 * const thresholdModel = z.object({
 *     style: LineStyleSchema.default('dashed'),
 * });
 * ```
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// STYLE SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Line/border style options.
 * 
 * Used for threshold lines, borders, dividers.
 */
export const LineStyleSchema = z.enum(['solid', 'dashed', 'dotted']);

/**
 * Padding options.
 * 
 * | Padding | Typical Value |
 * |---------|---------------|
 * | `none` | 0 |
 * | `sm` | 0.5rem (8px) |
 * | `md` | 1rem (16px) |
 * | `lg` | 1.5rem (24px) |
 */
export const PaddingSchema = z.enum(['none', 'sm', 'md', 'lg']);

/**
 * Resize mode options for textareas/panels.
 */
export const ResizeModeSchema = z.enum(['none', 'vertical', 'horizontal', 'both']);

/**
 * Background type options.
 */
export const BackgroundTypeSchema = z.enum([
    'solid',
    'gradient',
    'image',
    'animated',
    'pattern',
]);

/**
 * Animation type options for backgrounds.
 */
export const AnimationTypeSchema = z.enum([
    'waves',
    'particles',
    'gradient-shift',
    'aurora',
]);

/**
 * Layout mode options.
 */
export const LayoutModeSchema = z.enum(['default', 'centered', 'wide']);

/**
 * Visual mode options for components.
 * 
 * | Mode | Description |
 * |------|-------------|
 * | `normal` | Standard appearance |
 * | `neon` | Neon/Glowing appearance |
 * | `minimal` | Minimalist appearance |
 * | `glass` | Glassmorphism appearance |
 */
export const VisualModeSchema = z.enum(['normal', 'neon', 'minimal', 'glass']);

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/** Line style type */
export type LineStyle = z.infer<typeof LineStyleSchema>;

/** Padding type */
export type Padding = z.infer<typeof PaddingSchema>;

/** Resize mode type */
export type ResizeMode = z.infer<typeof ResizeModeSchema>;

/** Background type */
export type BackgroundType = z.infer<typeof BackgroundTypeSchema>;

/** Animation type */
export type AnimationType = z.infer<typeof AnimationTypeSchema>;

/** Layout mode type */
export type LayoutMode = z.infer<typeof LayoutModeSchema>;

/** Visual mode type */
export type VisualMode = z.infer<typeof VisualModeSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Padding to CSS value mapping.
 */
export const PADDING_VALUES: Record<Padding, string> = {
    none: '0',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
};

/**
 * Default line style.
 */
export const DEFAULT_LINE_STYLE: LineStyle = 'solid';

/**
 * Default padding.
 */
export const DEFAULT_PADDING: Padding = 'md';
