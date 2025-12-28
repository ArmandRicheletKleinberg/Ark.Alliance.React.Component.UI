/**
 * @fileoverview Tooltip Component Model
 * @module components/Tooltip
 * 
 * Defines the data structure, validation, and defaults for the Tooltip component.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';
import { PositionSchema, type Position } from '../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tooltip position variants
 * @deprecated Use PositionSchema from '@core/enums' instead
 */
export const TooltipPosition = PositionSchema;

/**
 * Tooltip model schema extending base model
 */
export const TooltipModelSchema = extendSchema({
    /** Tooltip content */
    content: z.union([z.string(), z.any()]).optional(),

    /** Position relative to trigger element */
    position: PositionSchema.default('top'),

    /** Delay in ms before showing tooltip */
    delay: z.number().min(0).default(300),

    /** Whether tooltip is visible */
    isVisible: z.boolean().default(false),

    /** Calculated coordinates for positioning */
    coords: z.object({
        x: z.number().default(0),
        y: z.number().default(0),
    }).default({ x: 0, y: 0 }),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type TooltipPositionType = Position;
export type TooltipModel = z.infer<typeof TooltipModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════



/**
 * Default Tooltip model values
 */
export const defaultTooltipModel: TooltipModel = {
    position: 'top',
    delay: 300,
    isVisible: false,
    coords: { x: 0, y: 0 },
    disabled: false,
    loading: false,
    clickable: false,
    doubleClickable: false,
    draggable: false,
    droppable: false,
    mouseOverEnabled: true, // Tooltips respond to hover
    mouseMoveEnabled: false,
    mouseEnterEnabled: true, // Tooltips respond to mouse enter/leave
    focusable: false,
    tooltipPosition: 'top',
    tooltipDelay: 300,
};

/**
 * Create a Tooltip model with custom values
 */
export function createTooltipModel(data: Partial<TooltipModel>): TooltipModel {
    return TooltipModelSchema.parse(data);
}
