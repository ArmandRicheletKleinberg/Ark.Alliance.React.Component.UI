/**
 * @fileoverview Trade History Grid Component
 * @module components/Finance/Trading/TradeHistoryGrid
 */

import React, { memo, type ReactNode } from 'react';
import { useTradeHistoryGrid, type UseTradeHistoryGridOptions } from './TradeHistoryGrid.viewmodel';
import type { FinancialTrade } from '../common';
import { TradingGridCard } from '../TradingGridCard';
import { FAIcon } from '../../../Icon';
import './TradeHistoryGrid.scss';

export interface TradeHistoryGridProps extends UseTradeHistoryGridOptions {
    className?: string;
    headerActions?: ReactNode;
    emptyState?: ReactNode;
    isLoading?: boolean;
}

export const TradeHistoryGrid = memo(function TradeHistoryGrid(props: TradeHistoryGridProps) {
    const {
        className = '',
        headerActions,
        emptyState,
        isLoading = false,
        ...options
    } = props;

    const vm = useTradeHistoryGrid(options);

    const renderCellValue = (trade: FinancialTrade, columnKey: string): ReactNode => {
        const value = (trade as Record<string, unknown>)[columnKey];

        switch (columnKey) {
            case 'side':
                return (
                    <span className={`ark-trade-history__side ark-trade-history__side--${(value as string).toLowerCase()}`}>
                        {value as string}
                    </span>
                );

            case 'realizedPnl':
            case 'netProfit':
                return value != null ? (
                    <span className={vm.getPnlClass(value as number)}>{vm.formatPnl(value as number)}</span>
                ) : '-';

            case 'price':
            case 'commission':
                return value != null ? (value as number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 }) : '-';

            case 'quantity':
            case 'quoteQty':
                return value != null ? (value as number).toLocaleString(undefined, { maximumFractionDigits: 8 }) : '-';

            case 'timestamp':
                return value ? new Date(value as number).toLocaleString() : '-';

            case 'role':
                return value ? (
                    <span className={`ark-trade-history__role ark-trade-history__role--${(value as string).toLowerCase()}`}>
                        {value as string}
                    </span>
                ) : '-';

            default:
                return value != null ? String(value) : '-';
        }
    };

    return (
        <TradingGridCard
            title={vm.model.title}
            subtitle={vm.model.subtitle || `${vm.totalCount} trade${vm.totalCount !== 1 ? 's' : ''}`}
            status="info"
            isDark={vm.model.isDark}
            className={`ark-trade-history ${className}`}
            headerActions={
                <>
                    {vm.model.enableExport && (
                        <button className="ark-trade-history__export-btn" onClick={vm.handleExport}>
                            <FAIcon name="download" size="xs" /> Export
                        </button>
                    )}
                    {headerActions}
                </>
            }
        >
            {/* Summary */}
            {vm.model.showSummary && (
                <div className="ark-trade-history__summary">
                    <div className="ark-trade-history__stat">
                        <span className="ark-trade-history__stat-label">Net P&L</span>
                        <span className={`ark-trade-history__stat-value ${vm.getPnlClass(vm.summary.totalNetProfit)}`}>
                            {vm.formatPnl(vm.summary.totalNetProfit)}
                        </span>
                    </div>
                    <div className="ark-trade-history__stat">
                        <span className="ark-trade-history__stat-label">Win Rate</span>
                        <span className="ark-trade-history__stat-value">{vm.summary.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="ark-trade-history__stat">
                        <span className="ark-trade-history__stat-label">Trades</span>
                        <span className="ark-trade-history__stat-value">{vm.summary.tradeCount}</span>
                    </div>
                    <div className="ark-trade-history__stat">
                        <span className="ark-trade-history__stat-label">Fees</span>
                        <span className="ark-trade-history__stat-value ark-pnl--negative">-{vm.summary.totalCommission.toFixed(2)}</span>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="ark-trade-history__filter-bar">
                {vm.model.showSymbolFilter && (
                    <input
                        type="text"
                        placeholder="Symbol..."
                        value={vm.filter.symbol || ''}
                        onChange={(e) => vm.handleFilter({ symbol: e.target.value })}
                        className="ark-trade-history__filter-input"
                    />
                )}
                {vm.model.showDateFilter && (
                    <select
                        className="ark-trade-history__filter-select"
                        value={vm.filter.dateRange?.preset || ''}
                        onChange={(e) => vm.handleDatePreset(e.target.value as any)}
                    >
                        <option value="">All Time</option>
                        <option value="TODAY">Today</option>
                        <option value="YESTERDAY">Yesterday</option>
                        <option value="LAST_7_DAYS">Last 7 Days</option>
                        <option value="LAST_30_DAYS">Last 30 Days</option>
                        <option value="THIS_MONTH">This Month</option>
                    </select>
                )}
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="ark-trade-history__loading"><FAIcon name="spinner" spin size="lg" /></div>
            ) : vm.paginatedTrades.length === 0 ? (
                emptyState || <div className="ark-trade-history__empty">No trades found</div>
            ) : (
                <>
                    <div className="ark-trade-history__table-wrapper">
                        <table className="ark-trade-history__table">
                            <thead>
                                <tr>
                                    {vm.columns.filter(c => c.visible !== false).map((col) => (
                                        <th
                                            key={col.key}
                                            className={`ark-trade-history__th ark-trade-history__th--${col.align}`}
                                            style={{ width: col.width }}
                                            onClick={col.sortable !== false ? () => vm.handleSort(col.key) : undefined}
                                        >
                                            {col.label}
                                            {vm.sort.column === col.key && vm.sort.direction && (
                                                <FAIcon name={vm.sort.direction === 'asc' ? 'arrow-up' : 'arrow-down'} size="xs" />
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {vm.paginatedTrades.map((trade) => (
                                    <tr key={String(trade.tradeId)} className="ark-trade-history__row" onClick={() => vm.handleRowClick(trade)}>
                                        {vm.columns.filter(c => c.visible !== false).map((col) => (
                                            <td key={col.key} className={`ark-trade-history__td ark-trade-history__td--${col.align}`}>
                                                {renderCellValue(trade, col.key)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {vm.totalPages > 1 && (
                        <div className="ark-trade-history__pagination">
                            <button disabled={vm.currentPage === 1} onClick={() => vm.handlePageChange(vm.currentPage - 1)}>
                                <FAIcon name="chevron-left" size="xs" />
                            </button>
                            <span>{vm.currentPage} / {vm.totalPages}</span>
                            <button disabled={vm.currentPage === vm.totalPages} onClick={() => vm.handlePageChange(vm.currentPage + 1)}>
                                <FAIcon name="chevron-right" size="xs" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </TradingGridCard>
    );
});

export default TradeHistoryGrid;
