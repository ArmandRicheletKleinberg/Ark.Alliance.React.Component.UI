/**
 * @fileoverview Grid Header Cell ViewModel
 * @module components/Grids/DataGrid/HeaderCell
 * 
 * Business logic hook for GridHeaderCell component.
 */

import { useState, useRef, useCallback, useMemo } from 'react';
import type { GridHeaderCellModel, SortDirection } from './GridHeaderCell.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Options for useGridHeaderCell hook.
 */
export interface UseGridHeaderCellOptions {
    /** Cell model configuration */
    model: GridHeaderCellModel;
    /** Callback when sort changes */
    onSort?: (fieldKey: string, direction: SortDirection) => void;
    /** Callback when filter changes */
    onFilter?: (fieldKey: string, value: string) => void;
    /** Callback when column is resized */
    onResize?: (fieldKey: string, width: number) => void;
    /** Global enable/disable sorting */
    enableSorting?: boolean;
    /** Global enable/disable filtering */
    enableFiltering?: boolean;
    /** Global enable/disable resizing */
    enableResize?: boolean;
}

/**
 * Result of useGridHeaderCell hook.
 */
export interface UseGridHeaderCellResult {
    // State
    showFilter: boolean;
    localFilterValue: string;
    isResizing: boolean;

    // Computed
    isSortable: boolean;
    isFilterable: boolean;
    isResizable: boolean;
    hasActiveFilter: boolean;
    containerClasses: string;

    // Handlers
    handleSortClick: () => void;
    handleFilterToggle: (e: React.MouseEvent) => void;
    handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFilterApply: () => void;
    handleFilterClear: () => void;
    handleFilterKeyDown: (e: React.KeyboardEvent) => void;
    handleResizeStart: (e: React.MouseEvent) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * useGridHeaderCell - ViewModel hook for GridHeaderCell.
 * 
 * Encapsulates all header cell logic including:
 * - Sort cycling (asc → desc → null)
 * - Filter dropdown state and application
 * - Column resize via mouse drag
 * 
 * @param options - Hook options
 * @returns ViewModel result with state, computed values, and handlers
 */
export function useGridHeaderCell(options: UseGridHeaderCellOptions): UseGridHeaderCellResult {
    const {
        model,
        onSort,
        onFilter,
        onResize,
        enableSorting = true,
        enableFiltering = true,
        enableResize = true,
    } = options;

    // ═══════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════

    const [showFilter, setShowFilter] = useState(false);
    const [localFilterValue, setLocalFilterValue] = useState(model.filterValue);
    const [isResizing, setIsResizing] = useState(false);
    const resizeStartX = useRef(0);
    const resizeStartWidth = useRef(0);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED
    // ═══════════════════════════════════════════════════════════════════════

    const isSortable = enableSorting && model.sortable;
    const isFilterable = enableFiltering && model.filterable;
    const isResizable = enableResize && model.resizable;
    const hasActiveFilter = model.filterValue.length > 0;

    const containerClasses = useMemo(() => {
        const classes = ['ark-grid-header-cell'];
        if (isSortable) classes.push('ark-grid-header-cell--sortable');
        if (isResizing) classes.push('ark-grid-header-cell--resizing');
        return classes.join(' ');
    }, [isSortable, isResizing]);

    // ═══════════════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleSortClick = useCallback(() => {
        if (!isSortable) return;

        let newDirection: SortDirection = 'asc';
        if (model.sortDirection === 'asc') newDirection = 'desc';
        else if (model.sortDirection === 'desc') newDirection = null;

        onSort?.(model.fieldKey, newDirection);
    }, [isSortable, model.fieldKey, model.sortDirection, onSort]);

    const handleFilterToggle = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (isFilterable) {
            setShowFilter(prev => !prev);
        }
    }, [isFilterable]);

    const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalFilterValue(e.target.value);
    }, []);

    const handleFilterApply = useCallback(() => {
        onFilter?.(model.fieldKey, localFilterValue);
        setShowFilter(false);
    }, [model.fieldKey, localFilterValue, onFilter]);

    const handleFilterClear = useCallback(() => {
        setLocalFilterValue('');
        onFilter?.(model.fieldKey, '');
        setShowFilter(false);
    }, [model.fieldKey, onFilter]);

    const handleFilterKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleFilterApply();
        if (e.key === 'Escape') setShowFilter(false);
    }, [handleFilterApply]);

    const handleResizeStart = useCallback((e: React.MouseEvent) => {
        if (!isResizable) return;
        e.preventDefault();
        e.stopPropagation();

        setIsResizing(true);
        resizeStartX.current = e.clientX;
        resizeStartWidth.current = model.width;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const delta = moveEvent.clientX - resizeStartX.current;
            const newWidth = Math.max(50, resizeStartWidth.current + delta);
            onResize?.(model.fieldKey, newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [isResizable, model.fieldKey, model.width, onResize]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        // State
        showFilter,
        localFilterValue,
        isResizing,

        // Computed
        isSortable,
        isFilterable,
        isResizable,
        hasActiveFilter,
        containerClasses,

        // Handlers
        handleSortClick,
        handleFilterToggle,
        handleFilterChange,
        handleFilterApply,
        handleFilterClear,
        handleFilterKeyDown,
        handleResizeStart,
    };
}

export default useGridHeaderCell;
