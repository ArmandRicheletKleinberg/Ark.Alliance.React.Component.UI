/**
 * @fileoverview Action Cell Model
 * @module components/Grids/DataGrid/Cell
 * 
 * Type definitions and schemas for ActionCell component.
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Action variant for styling.
 */
export const ActionVariantSchema = z.enum(['view', 'edit', 'delete', 'primary', 'default']);
export type ActionVariant = z.infer<typeof ActionVariantSchema>;

/**
 * Single row action schema.
 */
export const RowActionSchema = z.object({
    /** Unique action key */
    key: z.string(),
    /** Display label (used for tooltip) */
    label: z.string(),
    /** FontAwesome icon name */
    icon: z.string(),
    /** Action variant for styling */
    variant: ActionVariantSchema.default('default'),
    /** Whether action is disabled */
    disabled: z.boolean().default(false),
    /** Show confirmation before executing */
    confirmMessage: z.string().optional(),
});

/**
 * Row action type (without onClick - that's added at runtime).
 */
export type RowActionConfig = z.infer<typeof RowActionSchema>;

/**
 * Complete row action with onClick handler.
 */
export interface RowAction<T = unknown> extends RowActionConfig {
    /** Callback when action is clicked */
    onClick: (row: T) => void;
}

/**
 * Action cell model schema.
 */
export const ActionCellModelSchema = z.object({
    /** Maximum visible actions before overflow menu */
    maxVisible: z.number().min(1).default(4),
    /** Whether to show overflow menu for additional actions */
    showOverflow: z.boolean().default(true),
    /** Size variant */
    size: z.enum(['sm', 'md', 'lg']).default('sm'),
});

export type ActionCellModel = z.infer<typeof ActionCellModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default action cell model values.
 */
export const defaultActionCellModel: ActionCellModel = {
    maxVisible: 4,
    showOverflow: true,
    size: 'sm',
};

/**
 * Create an action cell model with defaults.
 */
export function createActionCellModel(
    partial: Partial<ActionCellModel>
): ActionCellModel {
    return ActionCellModelSchema.parse({
        ...defaultActionCellModel,
        ...partial,
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// PRESET ACTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create common preset actions.
 */
export function createPresetActions<T>(handlers: {
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
}): RowAction<T>[] {
    const actions: RowAction<T>[] = [];

    if (handlers.onView) {
        actions.push({
            key: 'view',
            label: 'View',
            icon: 'eye',
            variant: 'view',
            disabled: false,
            onClick: handlers.onView,
        });
    }

    if (handlers.onEdit) {
        actions.push({
            key: 'edit',
            label: 'Edit',
            icon: 'pen',
            variant: 'edit',
            disabled: false,
            onClick: handlers.onEdit,
        });
    }

    if (handlers.onDelete) {
        actions.push({
            key: 'delete',
            label: 'Delete',
            icon: 'trash',
            variant: 'delete',
            disabled: false,
            confirmMessage: 'Are you sure you want to delete this item?',
            onClick: handlers.onDelete,
        });
    }

    return actions;
}
