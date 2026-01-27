/**
 * @fileoverview Grid Header Cell Model
 * @module components/Grids/DataGrid/HeaderCell
 * 
 * Type definitions and schema for GridHeaderCell component.
 */

import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sort direction enum.
 */
export const SortDirectionSchema = z.enum(['asc', 'desc']).nullable();
export type SortDirection = z.infer<typeof SortDirectionSchema>;

/**
 * Grid header cell model schema.
 */
export const GridHeaderCellModelSchema = z.object({
    /** Column field key */
    fieldKey: z.string(),
    /** Display label */
    displayName: z.string(),
    /** Column width in pixels */
    width: z.number().min(30).default(100),
    /** Horizontal text alignment */
    horizontalAlign: z.enum(['left', 'center', 'right', 'justify']).default('left'),
    /** Current sort direction */
    sortDirection: SortDirectionSchema.default(null),
    /** Current filter value */
    filterValue: z.string().default(''),
    /** Whether sorting is enabled */
    sortable: z.boolean().default(true),
    /** Whether filtering is enabled */
    filterable: z.boolean().default(true),
    /** Whether resizing is enabled */
    resizable: z.boolean().default(true),
});

export type GridHeaderCellModel = z.infer<typeof GridHeaderCellModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default header cell model values.
 */
export const defaultGridHeaderCellModel: GridHeaderCellModel = {
    fieldKey: '',
    displayName: '',
    width: 100,
    horizontalAlign: 'left',
    sortDirection: null,
    filterValue: '',
    sortable: true,
    filterable: true,
    resizable: true,
};

/**
 * Create a header cell model with defaults.
 */
export function createGridHeaderCellModel(
    partial: Partial<GridHeaderCellModel>
): GridHeaderCellModel {
    return GridHeaderCellModelSchema.parse({
        ...defaultGridHeaderCellModel,
        ...partial,
    });
}
