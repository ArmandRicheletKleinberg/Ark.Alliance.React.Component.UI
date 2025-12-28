/**
 * @fileoverview Enhanced Header Component Model
 * @module components/Header
 * 
 * Enterprise-grade Header with visual modes, backgrounds, typography, icons.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SUB-SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Background configuration for animated/gradient/image backgrounds
 */
export const BackgroundConfigSchema = z.object({
    type: z.enum(['solid', 'gradient', 'image', 'animated', 'pattern']).default('solid'),
    color: z.string().optional(),
    gradientStart: z.string().optional(),
    gradientEnd: z.string().optional(),
    gradientAngle: z.number().default(135),
    imageUrl: z.string().optional(),
    imageOpacity: z.number().min(0).max(100).default(100),
    animationType: z.enum(['waves', 'particles', 'gradient-shift', 'aurora']).optional(),
    overlay: z.boolean().default(false),
    overlayColor: z.string().default('rgba(0, 0, 0, 0.5)'),
    overlayOpacity: z.number().min(0).max(100).default(50),
});

/**
 * Typography configuration for customizable fonts
 */
export const TypographyConfigSchema = z.object({
    titleFont: z.string().optional(),
    titleSize: z.enum(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']).default('md'),
    titleWeight: z.enum(['normal', 'medium', 'semibold', 'bold', 'extrabold']).default('semibold'),
    titleColor: z.string().optional(),
    subtitleFont: z.string().optional(),
    subtitleSize: z.enum(['xs', 'sm', 'md', 'lg']).default('sm'),
    subtitleColor: z.string().optional(),
    textAlign: z.enum(['left', 'center', 'right']).default('left'),
});

/**
 * Action button configuration
 */
export const ActionConfigSchema = z.object({
    id: z.string(),
    label: z.string().optional(),
    icon: z.string().optional(),
    variant: z.enum(['primary', 'secondary', 'ghost', 'danger']).default('secondary'),
    // onClick is handled by React, not validated by Zod
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Visual mode enum
 */
export const VisualMode = z.enum(['normal', 'neon', 'minimal', 'glass']);

/**
 * Header variant enum
 */
export const HeaderVariant = z.enum(['panel', 'page', 'section', 'card', 'grid']);

/**
 * Enhanced Header model schema
 */
export const HeaderModelSchema = extendSchema({
    // ─── Content ──────────────────────────────────────────────────────────
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),

    // ─── Icon ─────────────────────────────────────────────────────────────
    icon: z.string().optional(),
    iconPosition: z.enum(['left', 'right']).default('left'),
    iconSize: z.enum(['sm', 'md', 'lg', 'xl']).default('md'),

    // ─── Visual Mode ──────────────────────────────────────────────────────
    visualMode: VisualMode.default('normal'),
    variant: HeaderVariant.default('panel'),

    // ─── Theme ────────────────────────────────────────────────────────────
    isDark: z.boolean().default(true),

    // ─── Background ───────────────────────────────────────────────────────
    background: BackgroundConfigSchema.optional(),

    // ─── Typography ───────────────────────────────────────────────────────
    typography: TypographyConfigSchema.optional(),

    // ─── Border ───────────────────────────────────────────────────────────
    borderRadius: z.enum(['none', 'sm', 'md', 'lg', 'xl', 'full']).default('none'),

    // ─── Search (Grid integration) ────────────────────────────────────────
    showSearch: z.boolean().default(false),
    searchPlaceholder: z.string().default('Search...'),
    searchValue: z.string().optional(),

    // ─── Layout ───────────────────────────────────────────────────────────
    sticky: z.boolean().default(false),
    height: z.enum(['compact', 'normal', 'large']).default('normal'),
    alignment: z.enum(['left', 'center', 'right', 'space-between']).default('space-between'),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type BackgroundConfig = z.infer<typeof BackgroundConfigSchema>;
export type TypographyConfig = z.infer<typeof TypographyConfigSchema>;
export type ActionConfig = z.infer<typeof ActionConfigSchema>;
export type VisualModeType = z.infer<typeof VisualMode>;
export type HeaderVariantType = z.infer<typeof HeaderVariant>;
export type HeaderModel = z.infer<typeof HeaderModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

export const defaultHeaderModel: Omit<HeaderModel, 'title'> & { title?: string } = {
    title: undefined,
    subtitle: undefined,
    description: undefined,
    icon: undefined,
    iconPosition: 'left',
    iconSize: 'md',
    visualMode: 'normal',
    variant: 'panel',
    isDark: true,
    background: undefined,
    typography: undefined,
    borderRadius: 'none',
    showSearch: false,
    searchPlaceholder: 'Search...',
    searchValue: undefined,
    sticky: false,
    height: 'normal',
    alignment: 'space-between',
    disabled: false,
    loading: false,
    focusable: false,
    clickable: false,
    doubleClickable: false,
    draggable: false,
    droppable: false,
    mouseOverEnabled: false,
    mouseMoveEnabled: false,
    mouseEnterEnabled: false,
    tooltipPosition: 'top',
    tooltipDelay: 300,
};

export function createHeaderModel(data: Partial<HeaderModel> & { title: string }): HeaderModel {
    return HeaderModelSchema.parse(data);
}
