/**
 * @fileoverview Card Component Model
 * @module components/Cards/Card
 * 
 * Defines the data structure, validation, and defaults for the Card component.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';
import { SemanticStatusSchema } from '../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Card model schema extending base model
 * 
 * Uses consolidated enums from @core/enums:
 * - SemanticStatusSchema (replaces custom CardStatus)
 */
export const CardModelSchema = extendSchema({
    /** Card title */
    title: z.string(),

    /** Optional subtitle */
    subtitle: z.string().optional(),

    /** Status for border/glow coloring (from core/enums) */
    status: SemanticStatusSchema.default('info'),

    /** 
     * Visual variant 
     * Extending PanelVariantSchema with specific card variants
     */
    variant: z.enum(['default', 'glass', 'bordered', 'elevated', 'scanner', 'hologram']).default('default'),

    /** Whether card is compact (reduced padding) */
    compact: z.boolean().default(false),

    /** Whether to show header section */
    showHeader: z.boolean().default(true),

    /** Custom glow color (overrides status) */
    glowColor: z.string().optional(),

    /** Custom border color (overrides status) */
    borderColor: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type CardModel = z.infer<typeof CardModelSchema>;

// ═══════════════════════════════════STATUS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Status color configuration for dark/light themes
 * Note: 'info' is used as the default status (replaces 'idle')
 */
export const CARD_STATUS_CONFIG = {
    info: {
        borderDark: 'rgba(59, 130, 246, 0.3)',
        borderLight: 'rgba(147, 197, 253, 1)',
        glowDark: 'rgba(59, 130, 246, 0.20)',
        glowLight: 'rgba(59, 130, 246, 0.15)',
    },
    success: {
        borderDark: 'rgba(34, 197, 94, 0.3)',
        borderLight: 'rgba(134, 239, 172, 1)',
        glowDark: 'rgba(34, 197, 94, 0.15)',
        glowLight: 'rgba(34, 197, 94, 0.1)',
    },
    warning: {
        borderDark: 'rgba(234, 179, 8, 0.3)',
        borderLight: 'rgba(253, 224, 71, 1)',
        glowDark: 'rgba(234, 179, 8, 0.15)',
        glowLight: 'rgba(234, 179, 8, 0.1)',
    },
    error: {
        borderDark: 'rgba(239, 68, 68, 0.3)',
        borderLight: 'rgba(252, 165, 165, 1)',
        glowDark: 'rgba(239, 68, 68, 0.15)',
        glowLight: 'rgba(239, 68, 68, 0.1)',
    },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default card model values
 */
export const defaultCardModel: Omit<CardModel, 'title'> & { title?: string } = {
    title: undefined,
    status: 'idle',
    compact: false,
    showHeader: true,
    disabled: false,
    loading: false,
    clickable: false,
    doubleClickable: false,
    draggable: false,
    droppable: false,
    mouseOverEnabled: false,
    mouseMoveEnabled: false,
    mouseEnterEnabled: false,
    focusable: false,
    tooltipPosition: 'top',
    tooltipDelay: 300,
};

/**
 * Create a card model with custom values
 */
export function createCardModel(data: Partial<CardModel> & { title: string }): CardModel {
    return CardModelSchema.parse(data);
}
