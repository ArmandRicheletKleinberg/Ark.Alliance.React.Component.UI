/**
 * @fileoverview DesktopPage Component Model
 * @module components/Desktop/DesktopPage
 * 
 * Defines the data structure for a full desktop environment page.
 * Extends the Page model with desktop-specific functionality.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';
import {
    WindowStateSchema,
    AppConfigSchema,
    DesktopIconConfigSchema,
    DesktopVisualMode,
    PositionSchema
} from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Desktop theme options
 */
export const DesktopTheme = z.enum(['dark', 'light', 'neon', 'glass']);

/**
 * Background type options
 */
export const BackgroundType = z.enum(['solid', 'gradient', 'image', 'animated']);

/**
 * Background configuration schema
 */
export const BackgroundConfigSchema = z.object({
    /** Background type */
    type: BackgroundType.default('gradient'),

    /** Solid color or gradient start color */
    color: z.string().default('#0a0e27'),

    /** Gradient end color */
    gradientEndColor: z.string().optional(),

    /** Image URL for image backgrounds */
    imageUrl: z.string().optional(),

    /** Whether to show animated stars/particles */
    showAnimation: z.boolean().default(true),

    /** Overlay opacity (0-1) */
    overlayOpacity: z.number().min(0).max(1).default(0.1),
});
export type BackgroundConfig = z.infer<typeof BackgroundConfigSchema>;

/**
 * Icon position with persisted coordinates
 */
export const IconPositionSchema = z.object({
    iconId: z.string(),
    position: PositionSchema,
});
export type IconPosition = z.infer<typeof IconPositionSchema>;

/**
 * DesktopPage model schema
 */
export const DesktopPageModelSchema = extendSchema({
    /** Desktop theme */
    theme: DesktopTheme.default('dark'),

    /** Visual mode for components */
    visualMode: DesktopVisualMode.default('neon'),

    /** Background configuration */
    background: BackgroundConfigSchema.default({
        type: 'gradient',
        color: '#0a0e27',
        showAnimation: true,
        overlayOpacity: 0.1,
    }),

    /** Registered applications */
    apps: z.array(AppConfigSchema).default([]),

    /** Desktop icons configuration */
    icons: z.array(DesktopIconConfigSchema).default([]),

    /** Current open windows */
    windows: z.array(WindowStateSchema).default([]),

    /** Currently active (focused) window ID */
    activeWindowId: z.string().nullable().default(null),

    /** Whether start menu is open */
    startMenuOpen: z.boolean().default(false),

    /** Current z-index counter for window stacking */
    zIndexCounter: z.number().default(10),

    /** Whether to persist icon positions to cookies */
    persistIconPositions: z.boolean().default(true),

    /** Cookie key prefix for storage */
    cookiePrefix: z.string().default('ark-desktop'),

    /** Grid size for icon snapping (0 = no grid) */
    iconGridSize: z.number().default(110),

    /** Whether to show taskbar */
    showTaskbar: z.boolean().default(true),

    /** Status text for taskbar */
    statusText: z.string().default('Connected'),

    /** Taskbar height */
    taskbarHeight: z.number().default(48),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type DesktopThemeType = z.infer<typeof DesktopTheme>;
export type BackgroundTypeValue = z.infer<typeof BackgroundType>;
export type DesktopPageModel = z.infer<typeof DesktopPageModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default desktop page model
 */
export const defaultDesktopPageModel: DesktopPageModel = DesktopPageModelSchema.parse({});

/**
 * Create a desktop page model with custom values
 */
export function createDesktopPageModel(data: Partial<DesktopPageModel> = {}): DesktopPageModel {
    return DesktopPageModelSchema.parse({ ...defaultDesktopPageModel, ...data });
}

// ═══════════════════════════════════════════════════════════════════════════
// THEME PRESETS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Theme preset configurations
 */
export const THEME_PRESETS: Record<DesktopThemeType, Partial<BackgroundConfig>> = {
    dark: {
        type: 'gradient',
        color: '#0a0e27',
        gradientEndColor: '#1a2342',
        showAnimation: true,
        overlayOpacity: 0.1,
    },
    light: {
        type: 'gradient',
        color: '#e2e8f0',
        gradientEndColor: '#f8fafc',
        showAnimation: false,
        overlayOpacity: 0.05,
    },
    neon: {
        type: 'gradient',
        color: '#020617',
        gradientEndColor: '#0f172a',
        showAnimation: true,
        overlayOpacity: 0.15,
    },
    glass: {
        type: 'gradient',
        color: '#1e293b',
        gradientEndColor: '#334155',
        showAnimation: true,
        overlayOpacity: 0.2,
    },
};
