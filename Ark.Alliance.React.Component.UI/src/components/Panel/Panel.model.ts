/**
 * @fileoverview Panel Component Model
 * @module components/Panel
 * 
 * Defines the data structure, validation, and defaults for the Panel component.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';
import { PanelVariantSchema, PaddingSchema, type PanelVariant, type Padding } from '../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Panel variant styles
 * @deprecated Use PanelVariantSchema from '@core/enums' instead
 */
export const PanelVariant = PanelVariantSchema;

/**
 * Panel model schema extending base model
 */
export const PanelModelSchema = extendSchema({
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
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type PanelVariantType = PanelVariant;
export type PanelModel = z.infer<typeof PanelModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default panel model values
 */
export const defaultPanelModel: PanelModel = PanelModelSchema.parse({});

/**
 * Create a panel model with custom values
 */
export function createPanelModel(data: Partial<PanelModel> = {}): PanelModel {
    return PanelModelSchema.parse(data);
}

