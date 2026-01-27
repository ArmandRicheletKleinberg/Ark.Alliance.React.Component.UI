/**
 * @fileoverview Positions Grid Component
 * @module components/Finance/Trading/PositionsGrid
 * 
 * View component for displaying open trading positions.
 */

import React, { memo, type ReactNode } from 'react';
import { usePositionsGrid, type UsePositionsGridOptions } from './PositionsGrid.viewmodel';
import type { FinancialPosition } from '../common';
import { TradingGridCard } from '../TradingGridCard';
import { FAIcon } from '../../../Icon';
import './PositionsGrid.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Props for PositionsGrid component.
 */
export interface PositionsGridProps extends UsePositionsGridOptions {
    /** Additional class name */
    className?: string;
    /** Custom header actions */
    headerActions?: ReactNode;
    /** Custom empty state */
    emptyState?: ReactNode;
    /** Loading state */
    isLoading?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * PositionsGrid - Trading positions display grid.
 * 
 * Features:
 * - Supports all instrument types (futures, options, spot, stocks)
 * - Inline close actions (Market/Limit)
 * - P&L summary with color coding
 * - Symbol and side filtering
 * - Sortable columns
 * 
 * @example
 * ```tsx
 * <PositionsGrid
 *     positions={openPositions}
 *     onClosePosition={handleClose}
 *     model={{ title: 'Open Positions', isDark: true }}
 * />
 * ```
 */
export const PositionsGrid = memo(function PositionsGrid(props: PositionsGridProps) {
    const {
        className = '',
        headerActions,
        emptyState,
        isLoading = false,
        ...options
    } = props;

    const vm = usePositionsGrid(options);

    // Render cell value with formatting
    const renderCellValue = (position: FinancialPosition, columnKey: string): ReactNode => {
        const value = (position as Record<string, unknown>)[columnKey];

        switch (columnKey) {
            case 'side':
                return (
                    <span className={`ark-positions-grid__side ark-positions-grid__side--${(value as string).toLowerCase()}`}>
                        {value as string}
                    </span>
                );

            case 'unrealizedPnl':
                return (
                    <span className={vm.getPnlClass(value as number)}>
                        {vm.formatPnl(value as number)}
                    </span>
                );

            case 'roe':
            case 'unrealizedPnlPercent':
                return (
                    <span className={vm.getPnlClass(value as number)}>
                        {value != null ? `${(value as number).toFixed(2)}%` : '-'}
                    </span>
                );

            case 'leverage':
                return <span className="ark-positions-grid__leverage">{value}x</span>;

            case 'marginType':
                return (
                    <span className={`ark-positions-grid__margin ark-positions-grid__margin--${(value as string).toLowerCase()}`}>
                        {value as string}
                    </span>
                );

            case 'optionType':
                return (
                    <span className={`ark-positions-grid__option-type ark-positions-grid__option-type--${(value as string).toLowerCase()}`}>
                        {value as string}
                    </span>
                );

            case 'delta':
            case 'gamma':
            case 'theta':
            case 'vega':
                return value != null ? (value as number).toFixed(4) : '-';

            case 'entryPrice':
            case 'markPrice':
            case 'liquidationPrice':
            case 'strikePrice':
                return value != null ? (value as number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 }) : '-';

            case 'quantity':
                return Math.abs(value as number).toLocaleString(undefined, { maximumFractionDigits: 8 });

            case 'actions':
                return (
                    <div className="ark-positions-grid__actions">
                        <button
                            className="ark-positions-grid__btn ark-positions-grid__btn--market"
                            onClick={(e) => { e.stopPropagation(); vm.handleOpenCloseModal(position, 'MARKET'); }}
                            title="Close at Market"
                        >
                            <FAIcon name="xmark" size="xs" />
                        </button>
                        <button
                            className="ark-positions-grid__btn ark-positions-grid__btn--limit"
                            onClick={(e) => { e.stopPropagation(); vm.handleOpenCloseModal(position, 'LIMIT'); }}
                            title="Close with Limit"
                        >
                            <FAIcon name="pen" size="xs" />
                        </button>
                    </div>
                );

            default:
                return value != null ? String(value) : '-';
        }
    };

    // Status based on total P&L
    const cardStatus = vm.totalPnl > 0 ? 'success' : vm.totalPnl < 0 ? 'error' : 'idle';

    return (
        <TradingGridCard
            title={vm.model.title}
            subtitle={vm.model.subtitle || `${vm.totalCount} position${vm.totalCount !== 1 ? 's' : ''}`}
            status={cardStatus}
            isDark={vm.model.isDark}
            className={`ark-positions-grid ${className}`}
            headerActions={
                <>
                    {vm.model.showTotalPnl && (
                        <div className={`ark-positions-grid__total-pnl ${vm.getPnlClass(vm.totalPnl)}`}>
                            {vm.formatPnl(vm.totalPnl)} USDT
                        </div>
                    )}
                    {headerActions}
                </>
            }
        >
            {/* Filter bar */}
            {vm.model.showSymbolFilter && (
                <div className="ark-positions-grid__filter-bar">
                    <input
                        type="text"
                        placeholder="Filter by symbol..."
                        value={vm.filter.symbol || ''}
                        onChange={(e) => vm.handleFilter({ symbol: e.target.value })}
                        className="ark-positions-grid__filter-input"
                    />
                </div>
            )}

            {/* Table */}
            {isLoading ? (
                <div className="ark-positions-grid__loading">
                    <FAIcon name="spinner" spin size="lg" />
                </div>
            ) : vm.filteredPositions.length === 0 ? (
                emptyState || (
                    <div className="ark-positions-grid__empty">
                        No open positions
                    </div>
                )
            ) : (
                <div className="ark-positions-grid__table-wrapper">
                    <table className="ark-positions-grid__table">
                        <thead>
                            <tr>
                                {vm.columns.filter(c => c.visible !== false).map((col) => (
                                    <th
                                        key={col.key}
                                        className={`ark-positions-grid__th ark-positions-grid__th--${col.align || 'right'}`}
                                        style={{ width: col.width, minWidth: col.minWidth, maxWidth: col.maxWidth }}
                                        onClick={col.sortable !== false ? () => vm.handleSort(col.key) : undefined}
                                    >
                                        <span className="ark-positions-grid__th-content">
                                            {col.label}
                                            {vm.sort.column === col.key && vm.sort.direction && (
                                                <FAIcon
                                                    name={vm.sort.direction === 'asc' ? 'arrow-up' : 'arrow-down'}
                                                    size="xs"
                                                />
                                            )}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {vm.filteredPositions.map((position, idx) => (
                                <tr
                                    key={position.positionId || `${position.symbol}-${position.side}-${idx}`}
                                    className="ark-positions-grid__row"
                                    onClick={() => vm.handleRowClick(position)}
                                >
                                    {vm.columns.filter(c => c.visible !== false).map((col) => (
                                        <td
                                            key={col.key}
                                            className={`ark-positions-grid__td ark-positions-grid__td--${col.align || 'right'}`}
                                        >
                                            {renderCellValue(position, col.key)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Close Modal */}
            {vm.closeModal.isOpen && vm.closeModal.position && (
                <div className="ark-positions-grid__modal-overlay" onClick={vm.handleCloseModalDismiss}>
                    <div className="ark-positions-grid__modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ark-positions-grid__modal-header">
                            <h4>Close Position</h4>
                            <button onClick={vm.handleCloseModalDismiss}>
                                <FAIcon name="xmark" />
                            </button>
                        </div>
                        <div className="ark-positions-grid__modal-body">
                            <p>
                                {vm.closeModal.position.symbol} {vm.closeModal.position.side}
                            </p>
                            <div className="ark-positions-grid__form-group">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    value={vm.closeModal.quantity}
                                    onChange={(e) => vm.handleCloseQuantityChange(e.target.value)}
                                    max={vm.closeModal.position.quantity}
                                    step="any"
                                />
                            </div>
                            {vm.closeModal.closeType === 'LIMIT' && (
                                <div className="ark-positions-grid__form-group">
                                    <label>Limit Price</label>
                                    <input
                                        type="number"
                                        value={vm.closeModal.price}
                                        onChange={(e) => vm.handleClosePriceChange(e.target.value)}
                                        step="any"
                                    />
                                </div>
                            )}
                            {vm.closeModal.errors.length > 0 && (
                                <div className="ark-positions-grid__errors">
                                    {vm.closeModal.errors.map((err, i) => (
                                        <div key={i} className="ark-positions-grid__error">{err}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="ark-positions-grid__modal-footer">
                            <button
                                className="ark-positions-grid__btn--cancel"
                                onClick={vm.handleCloseModalDismiss}
                            >
                                Cancel
                            </button>
                            <button
                                className="ark-positions-grid__btn--confirm"
                                onClick={vm.handleConfirmClose}
                                disabled={vm.closeModal.isSubmitting}
                            >
                                {vm.closeModal.isSubmitting ? 'Closing...' : `Close ${vm.closeModal.closeType}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </TradingGridCard>
    );
});

export default PositionsGrid;
