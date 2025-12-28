/**
 * @fileoverview DataGrid ViewModel Hook
 * @module components/Grids/DataGrid
 * 
 * Core headless grid logic providing UI-agnostic state management.
 * Follows MVVM pattern for React.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { GridModel } from './DataGrid.model';
import type { GridQueryState, GridSortState, GridFilterState, GridDataSource } from './GridState';
import type { FieldModel } from './FieldModel';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Configuration options for the useDataGrid hook.
 */
export interface UseDataGridOptions<T> {
    /** Grid model configuration */
    model: GridModel;
    /** Initial data for client-side mode */
    initialData?: T[];
    /** Data source for server-side mode */
    dataSource?: GridDataSource<T>;
    /** Initial page size */
    pageSize?: number;
    /** Dark mode */
    isDark?: boolean;
}

/**
 * Selection state using Map for O(1) lookups.
 */
export type SelectionState<T> = Map<string, T>;

/**
 * ViewModel result returned by the hook.
 */
export interface UseDataGridResult<T> {
    // Data
    rows: T[];
    totalCount: number;
    isLoading: boolean;
    error: Error | null;

    // Query State
    queryState: GridQueryState;

    // Sorting
    sorts: GridSortState[];
    toggleSort: (field: string) => void;

    // Filtering
    filters: GridFilterState[];
    addFilter: (filter: GridFilterState) => void;
    removeFilter: (field: string) => void;
    clearFilters: () => void;

    // Pagination
    pageIndex: number;
    pageSize: number;
    setPageIndex: (index: number) => void;
    setPageSize: (size: number) => void;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    goToNextPage: () => void;
    goToPreviousPage: () => void;

    // Selection
    selection: SelectionState<T>;
    selectedRows: T[];
    toggleRowSelection: (row: T) => void;
    selectAll: () => void;
    clearSelection: () => void;
    isRowSelected: (row: T) => boolean;

    // Columns
    visibleFields: FieldModel[];

    // Actions
    refresh: () => Promise<void>;

    // Theme
    isDark: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DataGrid ViewModel hook.
 * 
 * Provides all grid logic without any UI coupling.
 * 
 * @example
 * ```tsx
 * const grid = useDataGrid({
 *   model: orderGridModel,
 *   dataSource: orderService,
 *   isDark: true,
 * });
 * 
 * // Use grid.rows, grid.toggleSort, etc. in your UI
 * ```
 */
export function useDataGrid<T extends { id?: string | number }>(
    options: UseDataGridOptions<T>
): UseDataGridResult<T> {
    const {
        model,
        initialData = [],
        dataSource,
        pageSize: initialPageSize = 50,
        isDark = true,
    } = options;

    // ═══════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════

    const [rows, setRows] = useState<T[]>(initialData);
    const [totalCount, setTotalCount] = useState<number>(initialData.length);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const [queryState, setQueryState] = useState<GridQueryState>({
        pageIndex: 0,
        pageSize: model.paging?.pageSize ?? initialPageSize,
        sorts: [],
        filters: [],
    });

    const [selection, setSelection] = useState<SelectionState<T>>(new Map());

    // ═══════════════════════════════════════════════════════════════════════
    // DERIVED STATE
    // ═══════════════════════════════════════════════════════════════════════

    const visibleFields = useMemo(() => model.fields, [model.fields]);
    const selectedRows = useMemo(() => Array.from(selection.values()), [selection]);

    const hasNextPage = useMemo(() => {
        const maxPage = Math.ceil(totalCount / queryState.pageSize) - 1;
        return queryState.pageIndex < maxPage;
    }, [queryState.pageIndex, queryState.pageSize, totalCount]);

    const hasPreviousPage = useMemo(() => queryState.pageIndex > 0, [queryState.pageIndex]);

    // ═══════════════════════════════════════════════════════════════════════
    // DATA FETCHING
    // ═══════════════════════════════════════════════════════════════════════

    const fetchData = useCallback(async () => {
        if (!dataSource) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await dataSource.fetch(queryState);
            setRows(result.rows);
            setTotalCount(result.totalCount);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown fetch error'));
        } finally {
            setIsLoading(false);
        }
    }, [dataSource, queryState]);

    useEffect(() => {
        if (dataSource) {
            fetchData();
        }
    }, [fetchData, dataSource]);

    // ═══════════════════════════════════════════════════════════════════════
    // SORTING
    // ═══════════════════════════════════════════════════════════════════════

    const toggleSort = useCallback((field: string) => {
        setQueryState((prev) => {
            const existing = prev.sorts.find((s) => s.field === field);
            let newSorts: GridSortState[];

            if (!existing) {
                newSorts = [{ field, direction: 'asc' }];
            } else if (existing.direction === 'asc') {
                newSorts = [{ field, direction: 'desc' }];
            } else {
                newSorts = [];
            }

            return { ...prev, sorts: newSorts, pageIndex: 0 };
        });
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // FILTERING
    // ═══════════════════════════════════════════════════════════════════════

    const addFilter = useCallback((filter: GridFilterState) => {
        setQueryState((prev) => ({
            ...prev,
            filters: [...prev.filters.filter((f) => f.field !== filter.field), filter],
            pageIndex: 0,
        }));
    }, []);

    const removeFilter = useCallback((field: string) => {
        setQueryState((prev) => ({
            ...prev,
            filters: prev.filters.filter((f) => f.field !== field),
            pageIndex: 0,
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setQueryState((prev) => ({ ...prev, filters: [], pageIndex: 0 }));
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // PAGINATION
    // ═══════════════════════════════════════════════════════════════════════

    const setPageIndex = useCallback((index: number) => {
        setQueryState((prev) => ({ ...prev, pageIndex: index }));
    }, []);

    const setPageSize = useCallback((size: number) => {
        setQueryState((prev) => ({ ...prev, pageSize: size, pageIndex: 0 }));
    }, []);

    const goToNextPage = useCallback(() => {
        if (hasNextPage) {
            setQueryState((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
        }
    }, [hasNextPage]);

    const goToPreviousPage = useCallback(() => {
        if (hasPreviousPage) {
            setQueryState((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
        }
    }, [hasPreviousPage]);

    // ═══════════════════════════════════════════════════════════════════════
    // SELECTION
    // ═══════════════════════════════════════════════════════════════════════

    const getRowKey = useCallback((row: T): string => {
        const key = (row as Record<string, unknown>)[model.primaryKey];
        return String(key ?? row.id ?? Math.random());
    }, [model.primaryKey]);

    const toggleRowSelection = useCallback((row: T) => {
        setSelection((prev) => {
            const newMap = new Map(prev);
            const key = getRowKey(row);

            if (newMap.has(key)) {
                newMap.delete(key);
            } else {
                newMap.set(key, row);
            }

            return newMap;
        });
    }, [getRowKey]);

    const selectAll = useCallback(() => {
        const newMap = new Map<string, T>();
        rows.forEach((row) => {
            newMap.set(getRowKey(row), row);
        });
        setSelection(newMap);
    }, [rows, getRowKey]);

    const clearSelection = useCallback(() => {
        setSelection(new Map());
    }, []);

    const isRowSelected = useCallback((row: T): boolean => {
        return selection.has(getRowKey(row));
    }, [selection, getRowKey]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        // Data
        rows,
        totalCount,
        isLoading,
        error,

        // Query State
        queryState,

        // Sorting
        sorts: queryState.sorts,
        toggleSort,

        // Filtering
        filters: queryState.filters,
        addFilter,
        removeFilter,
        clearFilters,

        // Pagination
        pageIndex: queryState.pageIndex,
        pageSize: queryState.pageSize,
        setPageIndex,
        setPageSize,
        hasNextPage,
        hasPreviousPage,
        goToNextPage,
        goToPreviousPage,

        // Selection
        selection,
        selectedRows,
        toggleRowSelection,
        selectAll,
        clearSelection,
        isRowSelected,

        // Columns
        visibleFields,

        // Actions
        refresh: fetchData,

        // Theme
        isDark,
    };
}

export default useDataGrid;
