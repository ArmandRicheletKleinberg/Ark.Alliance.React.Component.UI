/**
 * @fileoverview StartMenu Component Model
 * @module components/Desktop/StartMenu
 * 
 * Defines the data structure, validation, and defaults for the StartMenu component.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';
import { DesktopVisualMode, AppConfigSchema } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * StartMenu app item schema (simplified from AppConfig)
 */
export const StartMenuAppSchema = z.object({
    id: z.string(),
    title: z.string(),
    icon: z.string().optional(),
    category: z.string().optional(),
    pinned: z.boolean().default(false),
});
export type StartMenuApp = z.infer<typeof StartMenuAppSchema>;

/**
 * StartMenu model schema extending base model
 */
export const StartMenuModelSchema = extendSchema({
    /** Whether menu is open */
    isOpen: z.boolean().default(false),

    /** Available applications */
    apps: z.array(StartMenuAppSchema).default([]),

    /** Whether to show search bar */
    showSearch: z.boolean().default(true),

    /** Whether to show power options */
    showPowerOptions: z.boolean().default(true),

    /** Whether to show user profile section */
    showUserProfile: z.boolean().default(true),

    /** Current search query */
    searchQuery: z.string().default(''),

    /** Visual mode */
    visualMode: DesktopVisualMode.default('neon'),

    /** Menu width */
    width: z.number().default(320),

    /** Menu height */
    height: z.number().default(450),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type StartMenuModel = z.infer<typeof StartMenuModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default start menu model values
 */
export const defaultStartMenuModel: StartMenuModel = StartMenuModelSchema.parse({});

/**
 * Create a start menu model with custom values
 */
export function createStartMenuModel(data: Partial<StartMenuModel> = {}): StartMenuModel {
    return StartMenuModelSchema.parse(data);
}
