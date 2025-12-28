/**
 * @fileoverview DataGrid Model
 * @module components/Grids/DataGrid
 * 
 * Root configuration model for the DataGrid component.
 * Follows MVVM pattern with Zod validation.
 */

import { z } from 'zod';
import type { FieldModel } from './FieldModel';

// ═══════════════════════════════════════════════════════════════════════════
// OPTION TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Grid header action configuration.
 */
export interface GridHeaderAction {
    key: string;
    label: string;
    icon?: string;
    action: 'refresh' | 'add' | 'exportExcel' | 'exportCsv' | 'custom';
    disabled?: boolean;
}

/**
 * Grid header configuration.
 */
export interface GridHeaderModel {
    title: string;
    subtitle?: string;
    icon?: string;
    actions?: GridHeaderAction[];
}

/**
 * Row-level actions configuration.
 */
export interface GridRowActions {
    view?: boolean;
    edit?: boolean;
    delete?: boolean;
    custom?: Array<{
        key: string;
        label: string;
        icon?: string;
    }>;
}

/**
 * Selection configuration.
 */
export interface GridSelectionModel {
    enabled?: boolean;
    multi?: boolean;
}

/**
 * Pagination configuration.
 */
export interface GridPagingModel {
    pageSize?: number;
    pageSizes?: number[];
    infiniteScroll?: boolean;
}

/**
 * Theme configuration.
 */
export interface GridTheme {
    header?: { background?: string; color?: string };
    row?: { hoverBackground?: string };
    cell?: { padding?: string };
}

// ═══════════════════════════════════════════════════════════════════════════
// GRID MODEL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Root configuration model for the DataGrid.
 */
export interface GridModel {
    /** Unique identifier for this grid */
    gridId: string;
    /** Field key used as unique row identifier */
    primaryKey: string;
    /** Column/field definitions */
    fields: FieldModel[];
    /** Header configuration */
    header: GridHeaderModel;
    /** Row-level actions */
    rowActions?: GridRowActions;
    /** Selection configuration */
    selection?: GridSelectionModel;
    /** Pagination configuration */
    paging?: GridPagingModel;
    /** Theme overrides */
    theme?: GridTheme;
}

// ═══════════════════════════════════════════════════════════════════════════
// ZOD SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

export const GridHeaderActionSchema = z.object({
    key: z.string(),
    label: z.string(),
    icon: z.string().optional(),
    action: z.enum(['refresh', 'add', 'exportExcel', 'exportCsv', 'custom']),
    disabled: z.boolean().optional(),
});

export const GridHeaderSchema = z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    icon: z.string().optional(),
    actions: z.array(GridHeaderActionSchema).optional(),
});

export const FieldModelSchema = z.object({
    fieldKey: z.string(),
    displayName: z.string(),
    dataType: z.string(),
    width: z.number().optional(),
    sortable: z.boolean().optional(),
    filterable: z.boolean().optional(),
    frozen: z.enum(['left', 'right']).optional(),
});

export const GridModelSchema = z.object({
    gridId: z.string(),
    primaryKey: z.string(),
    fields: z.array(FieldModelSchema),
    header: GridHeaderSchema,
});

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate grid model at runtime.
 */
export function validateGridModel(data: unknown): GridModel {
    return GridModelSchema.parse(data) as GridModel;
}
