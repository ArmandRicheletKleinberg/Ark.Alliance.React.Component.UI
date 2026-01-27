/**
 * @fileoverview Grid Header Cell View Component
 * @module components/Grids/DataGrid/HeaderCell
 * 
 * View layer for GridHeaderCell - renders based on viewmodel state.
 */

import React, { memo } from 'react';
import type { GridHeaderCellModel, SortDirection } from './GridHeaderCell.model';
import { useGridHeaderCell } from './GridHeaderCell.viewmodel';
import { FAIcon } from '../../../Icon';
import './GridHeaderCell.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Props for the GridHeaderCell component.
 */
export interface GridHeaderCellProps {
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

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GridHeaderCell - Renders a single grid header cell.
 * 
 * Pure view component that delegates all logic to useGridHeaderCell viewmodel.
 * 
 * Features:
 * - Click to sort (ascending → descending → none cycle)
 * - Filter dropdown with apply/clear buttons
 * - Drag handle for column resize
 * - FAIcon integration for sort/filter indicators
 * 
 * @example
 * ```tsx
 * <GridHeaderCell
 *     model={{ fieldKey: 'price', displayName: 'Price', sortable: true }}
 *     onSort={(key, dir) => handleSort(key, dir)}
 * />
 * ```
 */
export const GridHeaderCell = memo<GridHeaderCellProps>(function GridHeaderCell(props) {
    const { model } = props;
    const vm = useGridHeaderCell(props);

    return (
        <div
            className={vm.containerClasses}
            style={{
                width: model.width,
                textAlign: model.horizontalAlign,
            }}
            onClick={vm.handleSortClick}
            role="columnheader"
            aria-sort={model.sortDirection === 'asc' ? 'ascending' : model.sortDirection === 'desc' ? 'descending' : 'none'}
        >
            {/* Label + Sort Icon */}
            <div className="ark-grid-header-cell__content">
                <span className="ark-grid-header-cell__label">
                    {model.displayName}
                </span>

                {vm.isSortable && model.sortDirection && (
                    <span className="ark-grid-header-cell__sort-icon">
                        <FAIcon
                            name={model.sortDirection === 'asc' ? 'sort-up' : 'sort-down'}
                            size="xs"
                        />
                    </span>
                )}
            </div>

            {/* Filter Button */}
            {vm.isFilterable && (
                <button
                    type="button"
                    className={`ark-grid-header-cell__filter-btn ${vm.hasActiveFilter ? 'ark-grid-header-cell__filter-btn--active' : ''}`}
                    onClick={vm.handleFilterToggle}
                    title="Filter"
                    aria-label={`Filter ${model.displayName}`}
                    aria-expanded={vm.showFilter}
                >
                    <FAIcon name="filter" size="xs" />
                </button>
            )}

            {/* Filter Dropdown */}
            {vm.showFilter && (
                <div
                    className="ark-grid-header-cell__filter-dropdown"
                    onClick={(e) => e.stopPropagation()}
                >
                    <input
                        type="text"
                        value={vm.localFilterValue}
                        onChange={vm.handleFilterChange}
                        onKeyDown={vm.handleFilterKeyDown}
                        placeholder={`Filter ${model.displayName}...`}
                        className="ark-grid-header-cell__filter-input"
                        autoFocus
                    />
                    <div className="ark-grid-header-cell__filter-actions">
                        <button
                            type="button"
                            className="ark-grid-header-cell__filter-btn-apply"
                            onClick={vm.handleFilterApply}
                        >
                            Apply
                        </button>
                        <button
                            type="button"
                            className="ark-grid-header-cell__filter-btn-clear"
                            onClick={vm.handleFilterClear}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            )}

            {/* Resize Handle */}
            {vm.isResizable && (
                <div
                    className={`ark-grid-header-cell__resize-handle ${vm.isResizing ? 'ark-grid-header-cell__resize-handle--active' : ''}`}
                    onMouseDown={vm.handleResizeStart}
                    onClick={(e) => e.stopPropagation()}
                    role="separator"
                    aria-label="Resize column"
                />
            )}
        </div>
    );
});

GridHeaderCell.displayName = 'GridHeaderCell';

export default GridHeaderCell;
