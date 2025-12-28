/**
 * @fileoverview WindowPanel Component Model
 * @module components/Desktop/WindowPanel
 * 
 * Defines the data structure, validation, and defaults for the WindowPanel component.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';
import { PositionSchema, SizeSchema, DesktopVisualMode } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * WindowPanel model schema extending base model
 */
export const WindowPanelModelSchema = extendSchema({
    /** Window title */
    title: z.string().default(''),

    /** Window icon (emoji, URL, or component key) */
    icon: z.string().optional(),

    /** Whether window is minimized */
    isMinimized: z.boolean().default(false),

    /** Whether window is maximized */
    isMaximized: z.boolean().default(false),

    /** Window position when not maximized */
    position: PositionSchema.default({ x: 100, y: 100 }),

    /** Window size when not maximized */
    size: SizeSchema.default({ width: 800, height: 600 }),

    /** Minimum window size */
    minSize: SizeSchema.default({ width: 200, height: 150 }),

    /** Maximum window size (optional) */
    maxSize: SizeSchema.optional(),

    /** Whether window can be resized */
    resizable: z.boolean().default(true),

    /** Whether window can be moved */
    movable: z.boolean().default(true),

    /** Whether window has close button */
    closable: z.boolean().default(true),

    /** Whether window has minimize button */
    minimizable: z.boolean().default(true),

    /** Whether window has maximize button */
    maximizable: z.boolean().default(true),

    /** Z-index for stacking order */
    zIndex: z.number().default(10),

    /** Visual mode */
    visualMode: DesktopVisualMode.default('neon'),

    /** Whether to show title bar */
    showTitleBar: z.boolean().default(true),

    /** Whether window is currently focused */
    isFocused: z.boolean().default(false),

    /** Border radius in pixels */
    borderRadius: z.number().default(8),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type WindowPanelModel = z.infer<typeof WindowPanelModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default window panel model values
 */
export const defaultWindowPanelModel: WindowPanelModel = WindowPanelModelSchema.parse({});

/**
 * Create a window panel model with custom values
 */
export function createWindowPanelModel(data: Partial<WindowPanelModel> = {}): WindowPanelModel {
    return WindowPanelModelSchema.parse(data);
}
