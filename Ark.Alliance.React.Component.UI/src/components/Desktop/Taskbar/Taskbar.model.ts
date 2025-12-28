/**
 * @fileoverview Taskbar Component Model
 * @module components/Desktop/Taskbar
 * 
 * Defines the data structure, validation, and defaults for the Taskbar component.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';
import { DesktopVisualMode, WindowStateSchema } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Taskbar position options
 */
export const TaskbarPosition = z.enum(['bottom', 'top']);

/**
 * Simplified window info for taskbar display
 */
export const TaskbarWindowSchema = z.object({
    id: z.string(),
    title: z.string(),
    icon: z.string().optional(),
    isMinimized: z.boolean().default(false),
});
export type TaskbarWindow = z.infer<typeof TaskbarWindowSchema>;

/**
 * Taskbar model schema extending base model
 */
export const TaskbarModelSchema = extendSchema({
    /** Taskbar position */
    position: TaskbarPosition.default('bottom'),

    /** Taskbar height in pixels */
    height: z.number().min(32).default(48),

    /** Whether to show clock */
    showClock: z.boolean().default(true),

    /** Whether to show system tray */
    showTray: z.boolean().default(true),

    /** Start button icon (emoji or URL) */
    startButtonIcon: z.string().optional(),

    /** Currently active window ID */
    activeWindowId: z.string().nullable().default(null),

    /** Open windows to display */
    windows: z.array(TaskbarWindowSchema).default([]),

    /** Whether start menu is open */
    startMenuOpen: z.boolean().default(false),

    /** Visual mode */
    visualMode: DesktopVisualMode.default('neon'),

    /** Connection status text */
    statusText: z.string().default('Connected'),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type TaskbarPositionType = z.infer<typeof TaskbarPosition>;
export type TaskbarModel = z.infer<typeof TaskbarModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default taskbar model values
 */
export const defaultTaskbarModel: TaskbarModel = TaskbarModelSchema.parse({});

/**
 * Create a taskbar model with custom values
 */
export function createTaskbarModel(data: Partial<TaskbarModel> = {}): TaskbarModel {
    return TaskbarModelSchema.parse(data);
}
