/**
 * @fileoverview Position Enum Definitions
 * @module core/enums/Position
 * 
 * Centralized position and orientation enums used across the component library.
 * 
 * @example
 * ```typescript
 * import { PositionSchema, OrientationSchema } from '@core/enums';
 * 
 * const tooltipModel = z.object({
 *     position: PositionSchema.default('top'),
 * });
 * ```
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// POSITION SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cardinal position options (4 directions).
 * 
 * Used for tooltips, popovers, and simple positioning.
 */
export const PositionSchema = z.enum(['left', 'right', 'top', 'bottom']);

/**
 * Extended position options including floating.
 * 
 * Used for control panels, sidebars, and complex layouts.
 */
export const ExtendedPositionSchema = z.enum([
    'left',
    'right',
    'top',
    'bottom',
    'floating',
]);

/**
 * Horizontal-only position (left/right).
 * 
 * Used for sidebar menus, label icons, etc.
 */
export const HorizontalPositionSchema = z.enum(['left', 'right']);

/**
 * Vertical-only position (top/bottom).
 * 
 * Used for toolbar positioning, etc.
 */
export const VerticalPositionSchema = z.enum(['top', 'bottom']);

/**
 * Toolbar position options including floating.
 */
export const ToolbarPositionSchema = z.enum(['top', 'bottom', 'floating']);

// ═══════════════════════════════════════════════════════════════════════════
// ORIENTATION SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Layout orientation options.
 * 
 * Used for timelines, progress bars, dividers.
 */
export const OrientationSchema = z.enum(['vertical', 'horizontal']);

/**
 * Flex/layout alignment options.
 * 
 * Used for tabs, buttons, content alignment.
 */
export const AlignmentSchema = z.enum(['start', 'center', 'end', 'stretch']);

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/** Cardinal position type */
export type Position = z.infer<typeof PositionSchema>;

/** Extended position type with floating */
export type ExtendedPosition = z.infer<typeof ExtendedPositionSchema>;

/** Horizontal position type */
export type HorizontalPosition = z.infer<typeof HorizontalPositionSchema>;

/** Vertical position type */
export type VerticalPosition = z.infer<typeof VerticalPositionSchema>;

/** Toolbar position type */
export type ToolbarPosition = z.infer<typeof ToolbarPositionSchema>;

/** Orientation type */
export type Orientation = z.infer<typeof OrientationSchema>;

/** Alignment type */
export type Alignment = z.infer<typeof AlignmentSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * All cardinal positions as constant array.
 */
export const POSITIONS = ['left', 'right', 'top', 'bottom'] as const;

/**
 * Default position for tooltips.
 */
export const DEFAULT_TOOLTIP_POSITION: Position = 'top';

/**
 * Default position for sidebars.
 */
export const DEFAULT_SIDEBAR_POSITION: HorizontalPosition = 'left';

/**
 * Default orientation for timelines.
 */
export const DEFAULT_ORIENTATION: Orientation = 'vertical';

/**
 * Default alignment.
 */
export const DEFAULT_ALIGNMENT: Alignment = 'start';

