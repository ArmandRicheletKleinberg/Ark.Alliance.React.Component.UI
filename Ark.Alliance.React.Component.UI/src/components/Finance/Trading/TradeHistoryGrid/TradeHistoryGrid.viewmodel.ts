/**
 * @fileoverview Trade History Grid ViewModel
 * @module components/Finance/Trading/TradeHistoryGrid
 */

import { useState, useCallback, useMemo } from 'react';
import type {
    TradeHistoryGridModel,
    TradeColumnConfig,
    DateRange,
    DateRangePreset,
} from './TradeHistoryGrid.model';
import { createTradeHistoryGridModel, defaultTradeColumns } from './TradeHistoryGrid.model';
import type { FinancialTrade } from '../common';
import { calculateTotalPnl } from '../common';

export interface TradeHistorySort {
    column: string;
    direction: 'asc' | 'desc' | null;
}

export interface TradeHistoryFilter {
    symbol?: string;
    side?: 'BUY' | 'SELL' | null;
    dateRange?: DateRange;
}

export interface UseTradeHistoryGridOptions {
    model?: Partial<TradeHistoryGridModel>;
    trades: FinancialTrade[];
    onRowClick?: (trade: FinancialTrade) => void;
    onExport?: (trades: FinancialTrade[]) => void;
}

export interface UseTradeHistoryGridResult {
    model: TradeHistoryGridModel;
    columns: TradeColumnConfig[];
    filteredTrades: FinancialTrade[];
    paginatedTrades: FinancialTrade[];
    totalCount: number;

    // Pagination
    currentPage: number;
    totalPages: number;

    // Sort/Filter
    sort: TradeHistorySort;
    filter: TradeHistoryFilter;

    // Summary
    summary: {
        totalRealizedPnl: number;
        totalCommission: number;
        totalNetProfit: number;
        tradeCount: number;
        winCount: number;
        lossCount: number;
        winRate: number;
    };

    // Handlers
    handleSort: (column: string) => void;
    handleFilter: (filter: Partial<TradeHistoryFilter>) => void;
    handleDatePreset: (preset: DateRangePreset) => void;
    handleClearFilters: () => void;
    handlePageChange: (page: number) => void;
    handleRowClick: (trade: FinancialTrade) => void;
    handleExport: () => void;

    // Utility
    formatPnl: (value: number) => string;
    getPnlClass: (value: number) => string;
}

function getDateRangeFromPreset(preset: DateRangePreset): DateRange {
    const now = Date.now();
    const startOfToday = new Date().setHours(0, 0, 0, 0);

    switch (preset) {
        case 'TODAY':
            return { start: startOfToday, end: now, preset };
        case 'YESTERDAY':
            return { start: startOfToday - 86400000, end: startOfToday - 1, preset };
        case 'LAST_7_DAYS':
            return { start: startOfToday - 7 * 86400000, end: now, preset };
        case 'LAST_30_DAYS':
            return { start: startOfToday - 30 * 86400000, end: now, preset };
        case 'THIS_MONTH':
            const thisMonth = new Date();
            thisMonth.setDate(1);
            thisMonth.setHours(0, 0, 0, 0);
            return { start: thisMonth.getTime(), end: now, preset };
        case 'LAST_MONTH':
            const lastMonthEnd = new Date();
            lastMonthEnd.setDate(0);
            lastMonthEnd.setHours(23, 59, 59, 999);
            const lastMonthStart = new Date(lastMonthEnd);
            lastMonthStart.setDate(1);
            lastMonthStart.setHours(0, 0, 0, 0);
            return { start: lastMonthStart.getTime(), end: lastMonthEnd.getTime(), preset };
        default:
            return { start: 0, end: now, preset };
    }
}

export function useTradeHistoryGrid(options: UseTradeHistoryGridOptions): UseTradeHistoryGridResult {
    const { model: modelConfig, trades, onRowClick, onExport } = options;

    const model = useMemo(() => createTradeHistoryGridModel(modelConfig), [modelConfig]);
    const columns = useMemo(() => model.columns || defaultTradeColumns, [model.columns]);

    const [sort, setSort] = useState<TradeHistorySort>({ column: 'timestamp', direction: 'desc' });
    const [filter, setFilter] = useState<TradeHistoryFilter>({});
    const [currentPage, setCurrentPage] = useState(1);

    const filteredTrades = useMemo(() => {
        let result = [...trades];

        if (filter.symbol) {
            const search = filter.symbol.toLowerCase();
            result = result.filter(t => t.symbol.toLowerCase().includes(search));
        }
        if (filter.side) {
            result = result.filter(t => t.side === filter.side);
        }
        if (filter.dateRange) {
            result = result.filter(t =>
                t.timestamp >= filter.dateRange!.start && t.timestamp <= filter.dateRange!.end
            );
        }

        if (sort.column && sort.direction) {
            result.sort((a, b) => {
                const aVal = (a as Record<string, unknown>)[sort.column];
                const bVal = (b as Record<string, unknown>)[sort.column];
                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
                }
                return sort.direction === 'asc'
                    ? String(aVal ?? '').localeCompare(String(bVal ?? ''))
                    : String(bVal ?? '').localeCompare(String(aVal ?? ''));
            });
        }

        return result;
    }, [trades, filter, sort]);

    const totalPages = Math.max(1, Math.ceil(filteredTrades.length / model.pageSize));

    const paginatedTrades = useMemo(() => {
        const start = (currentPage - 1) * model.pageSize;
        return filteredTrades.slice(start, start + model.pageSize);
    }, [filteredTrades, currentPage, model.pageSize]);

    const summary = useMemo(() => calculateTotalPnl(filteredTrades), [filteredTrades]);

    const handleSort = useCallback((column: string) => {
        setSort(prev => {
            if (prev.column !== column) return { column, direction: 'desc' };
            if (prev.direction === 'desc') return { column, direction: 'asc' };
            return { column: '', direction: null };
        });
    }, []);

    const handleFilter = useCallback((newFilter: Partial<TradeHistoryFilter>) => {
        setFilter(prev => ({ ...prev, ...newFilter }));
        setCurrentPage(1);
    }, []);

    const handleDatePreset = useCallback((preset: DateRangePreset) => {
        setFilter(prev => ({ ...prev, dateRange: getDateRangeFromPreset(preset) }));
        setCurrentPage(1);
    }, []);

    const handleClearFilters = useCallback(() => {
        setFilter({});
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    }, [totalPages]);

    const handleRowClick = useCallback((trade: FinancialTrade) => {
        onRowClick?.(trade);
    }, [onRowClick]);

    const handleExport = useCallback(() => {
        onExport?.(filteredTrades);
    }, [onExport, filteredTrades]);

    const formatPnl = useCallback((value: number): string => {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(2)}`;
    }, []);

    const getPnlClass = useCallback((value: number): string => {
        if (value > 0) return 'ark-pnl--positive';
        if (value < 0) return 'ark-pnl--negative';
        return 'ark-pnl--neutral';
    }, []);

    return {
        model,
        columns,
        filteredTrades,
        paginatedTrades,
        totalCount: trades.length,
        currentPage,
        totalPages,
        sort,
        filter,
        summary,
        handleSort,
        handleFilter,
        handleDatePreset,
        handleClearFilters,
        handlePageChange,
        handleRowClick,
        handleExport,
        formatPnl,
        getPnlClass,
    };
}

export default useTradeHistoryGrid;
