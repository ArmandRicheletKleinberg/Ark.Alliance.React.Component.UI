/**
 * @fileoverview Color Enum Definitions
 * @module core/enums/Color
 * 
 * Centralized color/theme enums used across the component library.
 * 
 * @example
 * ```typescript
 * import { ThemeColorSchema } from '@core/enums';
 * 
 * const sliderModel = z.object({
 *     color: ThemeColorSchema.default('cyan'),
 * });
 * ```
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// COLOR SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Theme accent color options.
 * 
 * | Color | Hex Value |
 * |-------|-----------|
 * | `cyan` | #06b6d4 |
 * | `blue` | #3b82f6 |
 * | `green` | #22c55e |
 * | `purple` | #a855f7 |
 * | `red` | #ef4444 |
 * | `yellow` | #eab308 |
 */
export const ThemeColorSchema = z.enum([
    'cyan',
    'blue',
    'green',
    'purple',
    'red',
    'yellow',
]);

/**
 * Extended theme colors with additional options.
 */
export const ExtendedColorSchema = z.enum([
    'cyan',
    'blue',
    'green',
    'purple',
    'red',
    'yellow',
    'orange',
    'pink',
    'indigo',
    'teal',
]);

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/** Theme color type */
export type ThemeColor = z.infer<typeof ThemeColorSchema>;

/** Extended color type */
export type ExtendedColor = z.infer<typeof ExtendedColorSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// COLOR VALUE MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Theme color to CSS hex value mapping.
 */
export const THEME_COLOR_VALUES: Record<ThemeColor, string> = {
    cyan: '#06b6d4',
    blue: '#3b82f6',
    green: '#22c55e',
    purple: '#a855f7',
    red: '#ef4444',
    yellow: '#eab308',
};

/**
 * Theme color to CSS RGB value mapping (for opacity).
 */
export const THEME_COLOR_RGB: Record<ThemeColor, string> = {
    cyan: '6, 182, 212',
    blue: '59, 130, 246',
    green: '34, 197, 94',
    purple: '168, 85, 247',
    red: '239, 68, 68',
    yellow: '234, 179, 8',
};

/**
 * Default theme color.
 */
export const DEFAULT_THEME_COLOR: ThemeColor = 'cyan';
