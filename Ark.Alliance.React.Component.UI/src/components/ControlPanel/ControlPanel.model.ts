/**
 * @fileoverview ControlPanel Component Model
 * @module components/ControlPanel
 * 
 * Data model for the standardized ControlPanel primitive component.
 * Extends Panel model with control panel-specific features.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base/BaseComponentModel';
import {
    ExtendedPositionSchema,
    ConnectionStatusSchema,
    ButtonVariantSchema,
    type ExtendedPosition,
    type ConnectionStatus,
} from '../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Control panel position relative to target component.
 * @deprecated Use ExtendedPositionSchema from '@core/enums' instead
 */
export const ControlPanelPositionSchema = ExtendedPositionSchema;

/**
 * Control panel section schema
 */
export const ControlPanelSectionSchema = z.object({
    /** Unique section identifier */
    id: z.string(),
    /** Section title/label */
    title: z.string(),
    /** Whether section is initially collapsed */
    collapsed: z.boolean().default(false),
    /** Section icon (emoji or component) */
    icon: z.string().optional(),
});

/**
 * Header action button schema
 */
export const HeaderActionSchema = z.object({
    /** Unique action identifier */
    id: z.string(),
    /** Tooltip/title */
    label: z.string(),
    /** Icon (emoji or text) */
    icon: z.string(),
    /** Whether action is currently active */
    active: z.boolean().default(false),
    /** Button variant */
    variant: ButtonVariantSchema.default('default'),
});

/**
 * ControlPanel model schema
 */
export const ControlPanelModelSchema = extendSchema({
    // ─────────────────────────────────────────────────────────────────────────
    // VISIBILITY
    // ─────────────────────────────────────────────────────────────────────────

    /** Whether the control panel is visible */
    visible: z.boolean().default(true),

    /** Whether the control panel is collapsible */
    collapsible: z.boolean().default(true),

    /** Whether the control panel starts collapsed */
    defaultCollapsed: z.boolean().default(false),

    // ─────────────────────────────────────────────────────────────────────────
    // HEADER
    // ─────────────────────────────────────────────────────────────────────────

    /** Panel title */
    title: z.string().default('Control Panel'),

    /** Title icon (emoji or text) */
    titleIcon: z.string().default('⚙️'),

    /** Header actions (buttons in header) */
    headerActions: z.array(HeaderActionSchema).default([]),

    // ─────────────────────────────────════════════════════════════════════────
    // LAYOUT
    // ─────────────────────────────────────────════════════════════════════════

    /** Position relative to target */
    position: ExtendedPositionSchema.default('right'),

    /** Panel width (for left/right positions) */
    width: z.number().min(150).max(600).default(280),

    /** Panel height (for top/bottom positions) */
    height: z.number().min(100).max(400).optional(),

    // ─────────────────────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────────────────────

    /** Connection status (if applicable) */
    connectionStatus: ConnectionStatusSchema.optional(),

    /** Whether the panel is loading */
    isLoading: z.boolean().default(false),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type ControlPanelPosition = ExtendedPosition;
export type ControlPanelSection = z.infer<typeof ControlPanelSectionSchema>;
export type HeaderAction = z.infer<typeof HeaderActionSchema>;
export type ControlPanelModel = z.infer<typeof ControlPanelModelSchema>;

// Re-export ConnectionStatus for backwards compatibility
export type { ConnectionStatus };

/**
 * Default model values
 */
export const defaultControlPanelModel: ControlPanelModel = ControlPanelModelSchema.parse({});

/**
 * Factory function to create ControlPanel model
 * @param data - Partial model data
 * @returns Validated ControlPanelModel
 */
export function createControlPanelModel(data: Partial<ControlPanelModel> = {}): ControlPanelModel {
    return ControlPanelModelSchema.parse(data);
}
