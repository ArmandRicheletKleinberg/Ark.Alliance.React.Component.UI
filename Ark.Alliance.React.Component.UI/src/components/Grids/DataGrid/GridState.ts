/**
 * @fileoverview DataGrid State Models
 * @module components/Grids/DataGrid
 * 
 * Query state, sorting, filtering for grid operations.
 */

// ═══════════════════════════════════════════════════════════════════════════
// SORT STATE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Single sort operation on a column.
 */
export interface GridSortState {
    field: string;
    direction: 'asc' | 'desc';
}

// ═══════════════════════════════════════════════════════════════════════════
// FILTER STATE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Single filter operation on a column.
 */
export interface GridFilterState {
    field: string;
    operator: 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'contains' | 'startsWith';
    value: unknown;
}

// ═══════════════════════════════════════════════════════════════════════════
// QUERY STATE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Complete query state for server-side operations.
 */
export interface GridQueryState {
    pageIndex: number;
    pageSize: number;
    sorts: GridSortState[];
    filters: GridFilterState[];
}

// ═══════════════════════════════════════════════════════════════════════════
// DATA SOURCE CONTRACT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Contract for server-side data fetching.
 */
export interface GridDataSource<T> {
    fetch(query: GridQueryState): Promise<{
        rows: T[];
        totalCount: number;
    }>;
}
