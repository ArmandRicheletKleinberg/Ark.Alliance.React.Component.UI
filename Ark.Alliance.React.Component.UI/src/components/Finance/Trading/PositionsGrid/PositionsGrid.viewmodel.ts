/**
 * @fileoverview Positions Grid ViewModel
 * @module components/Finance/Trading/PositionsGrid
 * 
 * Business logic hook for the positions trading grid.
 */

import { useState, useCallback, useMemo } from 'react';
import type {
    PositionsGridModel,
    PositionColumnConfig,
    ClosePositionRequest,
} from './PositionsGrid.model';
import {
    createPositionsGridModel,
    getDefaultColumnsForInstrument,
    validateClosePositionRequest,
} from './PositionsGrid.model';
import type { FinancialPosition } from '../common';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sort configuration.
 */
export interface PositionsGridSort {
    column: string;
    direction: 'asc' | 'desc' | null;
}

/**
 * Filter configuration.
 */
export interface PositionsGridFilter {
    symbol?: string;
    side?: 'LONG' | 'SHORT' | null;
    instrumentType?: string | null;
}

/**
 * Options for usePositionsGrid hook.
 */
export interface UsePositionsGridOptions {
    /** Grid model configuration */
    model?: Partial<PositionsGridModel>;
    /** Position data */
    positions: FinancialPosition[];
    /** Close position callback */
    onClosePosition?: (request: ClosePositionRequest) => Promise<void>;
    /** Row click callback */
    onRowClick?: (position: FinancialPosition) => void;
}

/**
 * Result of usePositionsGrid hook.
 */
export interface UsePositionsGridResult {
    // Model
    model: PositionsGridModel;
    columns: PositionColumnConfig[];

    // Data
    filteredPositions: FinancialPosition[];
    totalCount: number;

    // Sort/Filter state
    sort: PositionsGridSort;
    filter: PositionsGridFilter;

    // Summary
    totalPnl: number;
    totalPnlPercent: number;

    // Close modal state
    closeModal: {
        isOpen: boolean;
        position: FinancialPosition | null;
        closeType: 'MARKET' | 'LIMIT';
        quantity: string;
        price: string;
        errors: string[];
        isSubmitting: boolean;
    };

    // Handlers
    handleSort: (column: string) => void;
    handleFilter: (filter: Partial<PositionsGridFilter>) => void;
    handleClearFilters: () => void;
    handleRowClick: (position: FinancialPosition) => void;

    // Close handlers
    handleOpenCloseModal: (position: FinancialPosition, closeType: 'MARKET' | 'LIMIT') => void;
    handleCloseModalDismiss: () => void;
    handleCloseQuantityChange: (value: string) => void;
    handleClosePriceChange: (value: string) => void;
    handleConfirmClose: () => Promise<void>;

    // Utility
    formatPnl: (value: number) => string;
    getPnlClass: (value: number) => string;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * usePositionsGrid - ViewModel hook for PositionsGrid.
 */
export function usePositionsGrid(options: UsePositionsGridOptions): UsePositionsGridResult {
    const {
        model: modelConfig,
        positions,
        onClosePosition,
        onRowClick,
    } = options;

    // ═══════════════════════════════════════════════════════════════════════
    // MODEL
    // ═══════════════════════════════════════════════════════════════════════

    const model = useMemo(() => createPositionsGridModel(modelConfig), [modelConfig]);

    const columns = useMemo(() => {
        if (model.columns && model.columns.length > 0) {
            return model.columns;
        }
        // Auto-detect from first position
        const firstPosition = positions[0];
        if (firstPosition) {
            return getDefaultColumnsForInstrument(firstPosition.instrumentType);
        }
        return getDefaultColumnsForInstrument('CRYPTO_PERP');
    }, [model.columns, positions]);

    // ═══════════════════════════════════════════════════════════════════════
    // SORT & FILTER STATE
    // ═══════════════════════════════════════════════════════════════════════

    const [sort, setSort] = useState<PositionsGridSort>({
        column: 'unrealizedPnl',
        direction: 'desc',
    });

    const [filter, setFilter] = useState<PositionsGridFilter>({});

    // ═══════════════════════════════════════════════════════════════════════
    // CLOSE MODAL STATE
    // ═══════════════════════════════════════════════════════════════════════

    const [closeModal, setCloseModal] = useState<{
        isOpen: boolean;
        position: FinancialPosition | null;
        closeType: 'MARKET' | 'LIMIT';
        quantity: string;
        price: string;
        errors: string[];
        isSubmitting: boolean;
    }>({
        isOpen: false,
        position: null,
        closeType: 'MARKET',
        quantity: '',
        price: '',
        errors: [],
        isSubmitting: false,
    });

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED: FILTERED & SORTED DATA
    // ═══════════════════════════════════════════════════════════════════════

    const filteredPositions = useMemo(() => {
        let result = [...positions];

        // Symbol filter
        if (filter.symbol) {
            const searchLower = filter.symbol.toLowerCase();
            result = result.filter(p =>
                p.symbol.toLowerCase().includes(searchLower)
            );
        }

        // Side filter
        if (filter.side) {
            result = result.filter(p => p.side === filter.side);
        }

        // Instrument type filter
        if (filter.instrumentType) {
            result = result.filter(p => p.instrumentType === filter.instrumentType);
        }

        // Sort
        if (sort.column && sort.direction) {
            result.sort((a, b) => {
                const aVal = (a as Record<string, unknown>)[sort.column];
                const bVal = (b as Record<string, unknown>)[sort.column];

                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
                }

                const aStr = String(aVal ?? '');
                const bStr = String(bVal ?? '');
                return sort.direction === 'asc'
                    ? aStr.localeCompare(bStr)
                    : bStr.localeCompare(aStr);
            });
        }

        return result;
    }, [positions, filter, sort]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED: SUMMARY
    // ═══════════════════════════════════════════════════════════════════════

    const { totalPnl, totalPnlPercent } = useMemo(() => {
        let pnl = 0;
        let totalCost = 0;

        for (const pos of positions) {
            pnl += pos.unrealizedPnl;
            if (pos.cost) {
                totalCost += pos.cost;
            }
        }

        const percent = totalCost > 0 ? (pnl / totalCost) * 100 : 0;

        return { totalPnl: pnl, totalPnlPercent: percent };
    }, [positions]);

    // ═══════════════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleSort = useCallback((column: string) => {
        setSort(prev => {
            if (prev.column !== column) {
                return { column, direction: 'desc' };
            }
            if (prev.direction === 'desc') {
                return { column, direction: 'asc' };
            }
            if (prev.direction === 'asc') {
                return { column: '', direction: null };
            }
            return { column, direction: 'desc' };
        });
    }, []);

    const handleFilter = useCallback((newFilter: Partial<PositionsGridFilter>) => {
        setFilter(prev => ({ ...prev, ...newFilter }));
    }, []);

    const handleClearFilters = useCallback(() => {
        setFilter({});
    }, []);

    const handleRowClick = useCallback((position: FinancialPosition) => {
        onRowClick?.(position);
    }, [onRowClick]);

    // Close modal handlers
    const handleOpenCloseModal = useCallback((position: FinancialPosition, closeType: 'MARKET' | 'LIMIT') => {
        setCloseModal({
            isOpen: true,
            position,
            closeType,
            quantity: String(position.quantity),
            price: closeType === 'LIMIT' ? String(position.markPrice) : '',
            errors: [],
            isSubmitting: false,
        });
    }, []);

    const handleCloseModalDismiss = useCallback(() => {
        setCloseModal(prev => ({ ...prev, isOpen: false, errors: [] }));
    }, []);

    const handleCloseQuantityChange = useCallback((value: string) => {
        setCloseModal(prev => ({ ...prev, quantity: value, errors: [] }));
    }, []);

    const handleClosePriceChange = useCallback((value: string) => {
        setCloseModal(prev => ({ ...prev, price: value, errors: [] }));
    }, []);

    const handleConfirmClose = useCallback(async () => {
        if (!closeModal.position || !onClosePosition) return;

        const quantity = parseFloat(closeModal.quantity);
        const price = closeModal.closeType === 'LIMIT' ? parseFloat(closeModal.price) : undefined;

        const request: ClosePositionRequest = {
            symbol: closeModal.position.symbol,
            positionSide: closeModal.position.positionSide,
            quantity,
            closeType: closeModal.closeType,
            price,
        };

        const validation = validateClosePositionRequest(
            request,
            closeModal.position.quantity
        );

        if (!validation.valid) {
            setCloseModal(prev => ({ ...prev, errors: validation.errors }));
            return;
        }

        setCloseModal(prev => ({ ...prev, isSubmitting: true }));

        try {
            await onClosePosition(request);
            setCloseModal(prev => ({ ...prev, isOpen: false, isSubmitting: false }));
        } catch (error) {
            setCloseModal(prev => ({
                ...prev,
                isSubmitting: false,
                errors: [error instanceof Error ? error.message : 'Failed to close position'],
            }));
        }
    }, [closeModal, onClosePosition]);

    // ═══════════════════════════════════════════════════════════════════════
    // UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════

    const formatPnl = useCallback((value: number): string => {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(2)}`;
    }, []);

    const getPnlClass = useCallback((value: number): string => {
        if (value > 0) return 'ark-pnl--positive';
        if (value < 0) return 'ark-pnl--negative';
        return 'ark-pnl--neutral';
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        // Model
        model,
        columns,

        // Data
        filteredPositions,
        totalCount: positions.length,

        // Sort/Filter
        sort,
        filter,

        // Summary
        totalPnl,
        totalPnlPercent,

        // Close modal
        closeModal,

        // Handlers
        handleSort,
        handleFilter,
        handleClearFilters,
        handleRowClick,

        // Close handlers
        handleOpenCloseModal,
        handleCloseModalDismiss,
        handleCloseQuantityChange,
        handleClosePriceChange,
        handleConfirmClose,

        // Utility
        formatPnl,
        getPnlClass,
    };
}

export default usePositionsGrid;
