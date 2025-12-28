/**
 * @fileoverview GenericPanel Component Model
 * @module components/GenericPanel
 * 
 * Defines the data structure, validation, and defaults for the GenericPanel component.
 * This is a universal panel with dynamic theming, glassmorphism, gradients, and overlays.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';
import { PanelVariantSchema, PaddingSchema, type PanelVariant, type Padding } from '../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Panel layout mode
 */
export const PanelLayoutSchema = z.enum([
    'inline',        // Default inline flow
    'sidebar-left',  // Fixed left sidebar
    'sidebar-right', // Fixed right sidebar
    'fullscreen',    // Full viewport
]);

export type PanelLayout = z.infer<typeof PanelLayoutSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GenericPanel model schema extending base model
 */
export const GenericPanelModelSchema = extendSchema({
    // ─────────────────────────────────────────────────────────────────────────
    // BASIC PANEL FEATURES (backwards compatible with Panel)
    // ─────────────────────────────────────────────────────────────────────────

    /** Panel title */
    title: z.string().optional(),

    /** Style variant */
    variant: PanelVariantSchema.default('default'),

    /** Whether panel is collapsible */
    collapsible: z.boolean().default(false),

    /** Whether panel is initially collapsed */
    collapsed: z.boolean().default(false),

    /** Padding size */
    padding: PaddingSchema.default('md'),

    // ─────────────────────────────────────────────────────────────────────────
    // THEME CUSTOMIZATION
    // ─────────────────────────────────────────────────────────────────────────

    /** Glass blur intensity in pixels (0-40) */
    glassBlur: z.number().min(0).max(40).default(0),

    /** Shadow intensity percentage (0-100) */
    shadowIntensity: z.number().min(0).max(100).default(20),

    /** Border radius in pixels */
    borderRadius: z.number().min(0).max(50).default(8),

    /** Opacity percentage (0-100) */
    opacity: z.number().min(0).max(100).default(100),

    // ─────────────────────────────────────────────────────────────────────────
    // GRADIENT BACKGROUND
    // ─────────────────────────────────────────────────────────────────────────

    /** Enable gradient background */
    useGradient: z.boolean().default(false),

    /** Gradient start color (CSS color) */
    gradientStart: z.string().optional(),

    /** Gradient end color (CSS color) */
    gradientEnd: z.string().optional(),

    /** Gradient direction in degrees */
    gradientDirection: z.number().default(135),

    // ─────────────────────────────────────────────────────────────────────────
    // ACCENT & COLORS
    // ─────────────────────────────────────────────────────────────────────────

    /** Primary accent color */
    accentColor: z.string().optional(),

    /** Text color override */
    textColor: z.string().optional(),

    // ─────────────────────────────────────────────────────────────────────────
    // BACKGROUND IMAGE
    // ─────────────────────────────────────────────────────────────────────────

    /** Background image URL or data URI */
    backgroundImage: z.string().nullable().optional(),

    // ─────────────────────────────────────────────────────────────────────────
    // OVERLAYS & EFFECTS
    // ─────────────────────────────────────────────────────────────────────────

    /** Show tech-style grid overlay */
    showGrid: z.boolean().default(false),

    /** Grid color (CSS color) */
    gridColor: z.string().optional(),

    /** Grid cell size in pixels */
    gridSize: z.number().default(20),

    /** Show ambient glow effect */
    showGlow: z.boolean().default(false),

    /** Glow color (CSS color) */
    glowColor: z.string().optional(),

    // ─────────────────────────────────────────────────────────────────────────
    // EMPTY STATE
    // ─────────────────────────────────────────────────────────────────────────

    /** Show empty state when no children */
    showEmptyState: z.boolean().default(false),

    /** Empty state message */
    emptyMessage: z.string().default('No content available'),

    /** Empty state icon (emoji or component key) */
    emptyIcon: z.string().optional(),

    // ─────────────────────────────────────────────────────────────────────────
    // LAYOUT MODES
    // ─────────────────────────────────────────────────────────────────────────

    /** Layout mode */
    layout: PanelLayoutSchema.default('inline'),

    /** Fixed width for sidebar mode (pixels) */
    sidebarWidth: z.number().min(150).max(600).default(320),

    /** Scrollable body content */
    scrollable: z.boolean().default(false),

    /** Minimum height in pixels */
    minHeight: z.number().optional(),

    /** Maximum height in pixels */
    maxHeight: z.number().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type GenericPanelModel = z.infer<typeof GenericPanelModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default generic panel model values
 */
export const defaultGenericPanelModel: GenericPanelModel = GenericPanelModelSchema.parse({});

/**
 * Create a generic panel model with custom values
 * @param data - Partial model data
 * @returns Validated GenericPanelModel
 */
export function createGenericPanelModel(data: Partial<GenericPanelModel> = {}): GenericPanelModel {
    return GenericPanelModelSchema.parse(data);
}
