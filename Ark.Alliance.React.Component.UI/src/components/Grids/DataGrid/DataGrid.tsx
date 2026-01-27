/**
 * @fileoverview DataGrid View Component
 * @module components/Grids/DataGrid
 * 
 * Renders a data grid using the useDataGrid ViewModel.
 */

import { forwardRef, memo, type ReactNode } from 'react';
import { useDataGrid, type UseDataGridOptions } from './DataGrid.viewmodel';
import './DataGrid.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface DataGridProps<T> extends UseDataGridOptions<T> {
    /** Custom cell renderer */
    cellRenderer?: (field: string, value: unknown, row: T) => ReactNode;
    /** Row click handler */
    onRowClick?: (row: T) => void;
    /** Header action handler */
    onHeaderAction?: (action: string) => void;
    /** Additional CSS class */
    className?: string;
    /** Max height for scrollable body */
    maxHeight?: string;
    /** Optional filter UI renderer - allows custom filter controls */
    filterRenderer?: () => ReactNode;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DataGrid - Table component with sorting, filtering, pagination.
 * 
 * @example
 * ```tsx
 * <DataGrid
 *   model={orderGridModel}
 *   initialData={orders}
 *   onRowClick={(row) => openDetail(row)}
 *   isDark
 * />
 * ```
 */
function DataGridInner<T extends Record<string, unknown>>(
    props: DataGridProps<T>,
    ref: React.ForwardedRef<HTMLDivElement>
) {
    const {
        cellRenderer,
        onRowClick,
        onHeaderAction,
        className = '',
        maxHeight = '400px',
        filterRenderer,
        ...gridOptions
    } = props;

    const vm = useDataGrid(gridOptions);

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER HELPERS
    // ═══════════════════════════════════════════════════════════════════════

    const renderCell = (field: string, value: unknown, row: T): ReactNode => {
        if (cellRenderer) {
            return cellRenderer(field, value, row);
        }
        // Default rendering
        if (value === null || value === undefined) return '—';
        if (typeof value === 'boolean') return value ? '✓' : '✗';
        if (typeof value === 'number') return value.toLocaleString();
        return String(value);
    };

    /**
     * Get a unique key for a row, with fallback and warning for missing primaryKey
     * @param row - The data row
     * @param index - Row index (used only as fallback)
     * @returns Unique string key for React
     */
    const getRowKey = (row: T, index: number): string => {
        const pk = gridOptions.model.primaryKey;
        const key = pk ? row[pk] : undefined;
        if (key === undefined || key === null) {
            console.warn(`[DataGrid] Row at index ${index} missing primaryKey "${pk}"`);
            return `row-${index}-${Date.now()}`;
        }
        return String(key);
    };

    const getSortIndicator = (field: string): string => {
        const sort = vm.sorts.find((s) => s.field === field);
        if (!sort) return '';
        return sort.direction === 'asc' ? ' ↑' : ' ↓';
    };

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════════

    return (
        <div
            ref={ref}
            className={`ark-data-grid ${vm.isDark ? 'ark-data-grid--dark' : 'ark-data-grid--light'} ${className}`}
        >
            {/* Header */}
            <div className="ark-data-grid__header">
                <div className="ark-data-grid__header-title">
                    <h3>{vm.queryState.sorts.length > 0 ? `${gridOptions.model.header.title}` : gridOptions.model.header.title}</h3>
                    {gridOptions.model.header.subtitle && (
                        <span className="ark-data-grid__header-subtitle">{gridOptions.model.header.subtitle}</span>
                    )}
                </div>
                {gridOptions.model.header.actions && (
                    <div className="ark-data-grid__header-actions">
                        {gridOptions.model.header.actions.map((action) => (
                            <button
                                key={action.key}
                                onClick={() => onHeaderAction?.(action.action)}
                                disabled={action.disabled}
                                className="ark-data-grid__action-btn"
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Filter UI Slot */}
            {filterRenderer && (
                <div className="ark-data-grid__filters">
                    {filterRenderer()}
                </div>
            )}

            {/* Table */}
            <div className="ark-data-grid__table-wrapper" style={{ maxHeight }}>
                <table className="ark-data-grid__table">
                    <thead>
                        <tr>
                            {/* Selection checkbox */}
                            {gridOptions.model.selection?.enabled && (
                                <th className="ark-data-grid__th ark-data-grid__th--checkbox">
                                    <input
                                        type="checkbox"
                                        checked={vm.selectedRows.length === vm.rows.length && vm.rows.length > 0}
                                        onChange={() =>
                                            vm.selectedRows.length === vm.rows.length
                                                ? vm.clearSelection()
                                                : vm.selectAll()
                                        }
                                    />
                                </th>
                            )}
                            {vm.visibleFields.map((field) => (
                                <th
                                    key={field.fieldKey}
                                    className={`ark-data-grid__th ${field.sortable ? 'ark-data-grid__th--sortable' : ''}`}
                                    style={{ width: field.width, textAlign: field.horizontalAlign || 'left' }}
                                    onClick={() => field.sortable && vm.toggleSort(field.fieldKey)}
                                >
                                    {field.displayName}
                                    {field.sortable && <span>{getSortIndicator(field.fieldKey)}</span>}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {vm.isLoading ? (
                            <tr>
                                <td colSpan={vm.visibleFields.length + (gridOptions.model.selection?.enabled ? 1 : 0)} className="ark-data-grid__loading">
                                    Loading...
                                </td>
                            </tr>
                        ) : vm.rows.length === 0 ? (
                            <tr>
                                <td colSpan={vm.visibleFields.length + (gridOptions.model.selection?.enabled ? 1 : 0)} className="ark-data-grid__empty">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            vm.rows.map((row, rowIndex) => (
                                <tr
                                    key={getRowKey(row, rowIndex)}
                                    className={`ark-data-grid__tr ${vm.isRowSelected(row) ? 'ark-data-grid__tr--selected' : ''}`}
                                    onClick={() => onRowClick?.(row)}
                                >
                                    {gridOptions.model.selection?.enabled && (
                                        <td className="ark-data-grid__td ark-data-grid__td--checkbox">
                                            <input
                                                type="checkbox"
                                                checked={vm.isRowSelected(row)}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    vm.toggleRowSelection(row);
                                                }}
                                            />
                                        </td>
                                    )}
                                    {vm.visibleFields.map((field) => (
                                        <td
                                            key={field.fieldKey}
                                            className="ark-data-grid__td"
                                            style={{ textAlign: field.horizontalAlign || 'left' }}
                                        >
                                            {renderCell(field.fieldKey, (row as Record<string, unknown>)[field.fieldKey], row)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="ark-data-grid__footer">
                <span className="ark-data-grid__count">
                    {vm.totalCount} items
                </span>
                <div className="ark-data-grid__pagination">
                    <button
                        onClick={vm.goToPreviousPage}
                        disabled={!vm.hasPreviousPage}
                        className="ark-data-grid__page-btn"
                    >
                        ←
                    </button>
                    <span className="ark-data-grid__page-info">
                        Page {vm.pageIndex + 1} of {Math.max(1, Math.ceil(vm.totalCount / vm.pageSize))}
                    </span>
                    <button
                        onClick={vm.goToNextPage}
                        disabled={!vm.hasNextPage}
                        className="ark-data-grid__page-btn"
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
}

// Forward ref with generics
export const DataGrid = memo(forwardRef(DataGridInner)) as <T extends Record<string, unknown>>(
    props: DataGridProps<T> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement | null;

(DataGrid as React.FC).displayName = 'DataGrid';

export default DataGrid;
