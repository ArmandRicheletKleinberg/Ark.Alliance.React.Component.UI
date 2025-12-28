/**
 * @fileoverview Desktop Component Types
 * @module components/Desktop
 * 
 * Shared types and Zod schemas for all Desktop components.
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// POSITION & SIZE SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 2D position schema
 */
export const PositionSchema = z.object({
    x: z.number().default(0),
    y: z.number().default(0),
});
export type Position = z.infer<typeof PositionSchema>;

/**
 * Size schema
 */
export const SizeSchema = z.object({
    width: z.number().min(0).default(800),
    height: z.number().min(0).default(600),
});
export type Size = z.infer<typeof SizeSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// WINDOW STATE SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Window state tracking for desktop window management
 */
export const WindowStateSchema = z.object({
    /** Unique window identifier */
    id: z.string(),

    /** Associated application ID */
    appId: z.string(),

    /** Window title */
    title: z.string(),

    /** Whether window is open */
    isOpen: z.boolean().default(true),

    /** Whether window is minimized */
    isMinimized: z.boolean().default(false),

    /** Whether window is maximized */
    isMaximized: z.boolean().default(false),

    /** Z-index for stacking order */
    zIndex: z.number().default(10),

    /** Window position */
    position: PositionSchema.default({ x: 100, y: 100 }),

    /** Window size */
    size: SizeSchema.default({ width: 800, height: 600 }),
});
export type WindowState = z.infer<typeof WindowStateSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// APPLICATION CONFIG SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Application configuration for desktop apps
 */
export const AppConfigSchema = z.object({
    /** Unique application ID */
    id: z.string(),

    /** Application display title */
    title: z.string(),

    /** Icon (emoji, URL, or component key) */
    icon: z.string().optional(),

    /** Application category */
    category: z.string().optional(),

    /** Whether app is pinned to taskbar */
    pinned: z.boolean().default(false),

    /** Default window width */
    defaultWidth: z.number().default(800),

    /** Default window height */
    defaultHeight: z.number().default(600),

    /** Whether only one instance allowed */
    singleton: z.boolean().default(false),
});
export type AppConfig = z.infer<typeof AppConfigSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DESKTOP ICON CONFIG SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Desktop icon configuration
 */
export const DesktopIconConfigSchema = z.object({
    /** Unique icon ID */
    id: z.string(),

    /** Display label */
    label: z.string(),

    /** Icon visual (emoji, URL, or component key) */
    icon: z.string(),

    /** Associated application ID to open */
    appId: z.string(),

    /** Grid position on desktop */
    gridPosition: z.object({
        row: z.number().default(0),
        col: z.number().default(0),
    }).optional(),
});
export type DesktopIconConfig = z.infer<typeof DesktopIconConfigSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// VISUAL MODE ENUM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Visual mode for desktop components
 */
export const DesktopVisualMode = z.enum(['normal', 'neon', 'minimal', 'glass']);
export type DesktopVisualModeType = z.infer<typeof DesktopVisualMode>;

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT MENU SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Context menu item
 */
export const ContextMenuItemSchema = z.object({
    /** Item ID */
    id: z.string(),

    /** Display label */
    label: z.string(),

    /** Optional icon */
    icon: z.string().optional(),

    /** Whether item is disabled */
    disabled: z.boolean().default(false),

    /** Whether item is a separator */
    separator: z.boolean().default(false),

    /** Keyboard shortcut hint */
    shortcut: z.string().optional(),

    /** Sub-menu items */
    children: z.array(z.lazy(() => ContextMenuItemSchema)).optional(),
});
export type ContextMenuItem = z.infer<typeof ContextMenuItemSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// FACTORY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a new window state with defaults
 */
export function createWindowState(data: Partial<WindowState> & { id: string; appId: string; title: string }): WindowState {
    return WindowStateSchema.parse(data);
}

/**
 * Create an app config with defaults
 */
export function createAppConfig(data: Partial<AppConfig> & { id: string; title: string }): AppConfig {
    return AppConfigSchema.parse(data);
}

/**
 * Create a desktop icon config with defaults
 */
export function createDesktopIconConfig(data: Partial<DesktopIconConfig> & { id: string; label: string; icon: string; appId: string }): DesktopIconConfig {
    return DesktopIconConfigSchema.parse(data);
}
