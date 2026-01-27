/**
 * @fileoverview Orders Grid ViewModel
 * @module components/Finance/Trading/OrdersGrid
 * 
 * Business logic hook for the open orders trading grid.
 */

import { useState, useCallback, useMemo } from 'react';
import type {
    OrdersGridModel,
    OrderColumnConfig,
    ModifyOrderRequest,
    CancelOrderRequest,
} from './OrdersGrid.model';
import {
    createOrdersGridModel,
    defaultOrderColumns,
    validateModifyOrderRequest,
} from './OrdersGrid.model';
import type { FinancialOrder, OrderType, OrderStatus } from '../common';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface OrdersGridSort {
    column: string;
    direction: 'asc' | 'desc' | null;
}

export interface OrdersGridFilter {
    symbol?: string;
    type?: OrderType | null;
    status?: OrderStatus | null;
    side?: 'BUY' | 'SELL' | null;
}

export interface UseOrdersGridOptions {
    model?: Partial<OrdersGridModel>;
    orders: FinancialOrder[];
    onModifyOrder?: (request: ModifyOrderRequest) => Promise<void>;
    onCancelOrder?: (request: CancelOrderRequest) => Promise<void>;
    onCancelAll?: (symbol?: string) => Promise<void>;
    onShowDetails?: (order: FinancialOrder) => void;
    onRowClick?: (order: FinancialOrder) => void;
}

export interface UseOrdersGridResult {
    model: OrdersGridModel;
    columns: OrderColumnConfig[];
    filteredOrders: FinancialOrder[];
    totalCount: number;
    sort: OrdersGridSort;
    filter: OrdersGridFilter;
    selectedOrderIds: Set<string | number>;

    // Edit modal state
    editModal: {
        isOpen: boolean;
        order: FinancialOrder | null;
        newPrice: string;
        newQuantity: string;
        errors: string[];
        isSubmitting: boolean;
    };

    // Cancel state
    cancelConfirm: {
        isOpen: boolean;
        order: FinancialOrder | null;
        isSubmitting: boolean;
    };

    // Handlers
    handleSort: (column: string) => void;
    handleFilter: (filter: Partial<OrdersGridFilter>) => void;
    handleClearFilters: () => void;
    handleRowClick: (order: FinancialOrder) => void;
    handleSelectOrder: (orderId: string | number, selected: boolean) => void;
    handleSelectAll: (selected: boolean) => void;

    // Edit handlers
    handleOpenEditModal: (order: FinancialOrder) => void;
    handleEditModalDismiss: () => void;
    handleEditPriceChange: (value: string) => void;
    handleEditQuantityChange: (value: string) => void;
    handleConfirmEdit: () => Promise<void>;

    // Cancel handlers
    handleOpenCancelConfirm: (order: FinancialOrder) => void;
    handleCancelConfirmDismiss: () => void;
    handleConfirmCancel: () => Promise<void>;
    handleCancelSelected: () => Promise<void>;

    // Details
    handleShowDetails: (order: FinancialOrder) => void;

    // Utility
    formatOrderType: (type: OrderType) => string;
    formatOrderStatus: (status: OrderStatus) => string;
    getStatusClass: (status: OrderStatus) => string;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

export function useOrdersGrid(options: UseOrdersGridOptions): UseOrdersGridResult {
    const {
        model: modelConfig,
        orders,
        onModifyOrder,
        onCancelOrder,
        onCancelAll,
        onShowDetails,
        onRowClick,
    } = options;

    const model = useMemo(() => createOrdersGridModel(modelConfig), [modelConfig]);
    const columns = useMemo(() => model.columns || defaultOrderColumns, [model.columns]);

    // Sort & Filter
    const [sort, setSort] = useState<OrdersGridSort>({
        column: 'createdAt',
        direction: 'desc',
    });

    const [filter, setFilter] = useState<OrdersGridFilter>({});
    const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string | number>>(new Set());

    // Edit modal
    const [editModal, setEditModal] = useState<{
        isOpen: boolean;
        order: FinancialOrder | null;
        newPrice: string;
        newQuantity: string;
        errors: string[];
        isSubmitting: boolean;
    }>({
        isOpen: false,
        order: null,
        newPrice: '',
        newQuantity: '',
        errors: [],
        isSubmitting: false,
    });

    // Cancel confirmation
    const [cancelConfirm, setCancelConfirm] = useState<{
        isOpen: boolean;
        order: FinancialOrder | null;
        isSubmitting: boolean;
    }>({
        isOpen: false,
        order: null,
        isSubmitting: false,
    });

    // Filtered & sorted data
    const filteredOrders = useMemo(() => {
        let result = [...orders];

        if (filter.symbol) {
            const searchLower = filter.symbol.toLowerCase();
            result = result.filter(o => o.symbol.toLowerCase().includes(searchLower));
        }
        if (filter.type) {
            result = result.filter(o => o.type === filter.type);
        }
        if (filter.status) {
            result = result.filter(o => o.status === filter.status);
        }
        if (filter.side) {
            result = result.filter(o => o.side === filter.side);
        }

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
    }, [orders, filter, sort]);

    // Handlers
    const handleSort = useCallback((column: string) => {
        setSort(prev => {
            if (prev.column !== column) return { column, direction: 'desc' };
            if (prev.direction === 'desc') return { column, direction: 'asc' };
            if (prev.direction === 'asc') return { column: '', direction: null };
            return { column, direction: 'desc' };
        });
    }, []);

    const handleFilter = useCallback((newFilter: Partial<OrdersGridFilter>) => {
        setFilter(prev => ({ ...prev, ...newFilter }));
    }, []);

    const handleClearFilters = useCallback(() => {
        setFilter({});
    }, []);

    const handleRowClick = useCallback((order: FinancialOrder) => {
        onRowClick?.(order);
    }, [onRowClick]);

    const handleSelectOrder = useCallback((orderId: string | number, selected: boolean) => {
        setSelectedOrderIds(prev => {
            const next = new Set(prev);
            if (selected) next.add(orderId);
            else next.delete(orderId);
            return next;
        });
    }, []);

    const handleSelectAll = useCallback((selected: boolean) => {
        if (selected) {
            setSelectedOrderIds(new Set(filteredOrders.map(o => o.orderId)));
        } else {
            setSelectedOrderIds(new Set());
        }
    }, [filteredOrders]);

    // Edit modal handlers
    const handleOpenEditModal = useCallback((order: FinancialOrder) => {
        setEditModal({
            isOpen: true,
            order,
            newPrice: String(order.price || ''),
            newQuantity: String(order.quantity),
            errors: [],
            isSubmitting: false,
        });
    }, []);

    const handleEditModalDismiss = useCallback(() => {
        setEditModal(prev => ({ ...prev, isOpen: false, errors: [] }));
    }, []);

    const handleEditPriceChange = useCallback((value: string) => {
        setEditModal(prev => ({ ...prev, newPrice: value, errors: [] }));
    }, []);

    const handleEditQuantityChange = useCallback((value: string) => {
        setEditModal(prev => ({ ...prev, newQuantity: value, errors: [] }));
    }, []);

    const handleConfirmEdit = useCallback(async () => {
        if (!editModal.order || !onModifyOrder) return;

        const request: ModifyOrderRequest = {
            orderId: editModal.order.orderId,
            symbol: editModal.order.symbol,
            newPrice: editModal.newPrice ? parseFloat(editModal.newPrice) : undefined,
            newQuantity: editModal.newQuantity ? parseFloat(editModal.newQuantity) : undefined,
        };

        const validation = validateModifyOrderRequest(request);
        if (!validation.valid) {
            setEditModal(prev => ({ ...prev, errors: validation.errors }));
            return;
        }

        setEditModal(prev => ({ ...prev, isSubmitting: true }));

        try {
            await onModifyOrder(request);
            setEditModal(prev => ({ ...prev, isOpen: false, isSubmitting: false }));
        } catch (error) {
            setEditModal(prev => ({
                ...prev,
                isSubmitting: false,
                errors: [error instanceof Error ? error.message : 'Failed to modify order'],
            }));
        }
    }, [editModal, onModifyOrder]);

    // Cancel handlers
    const handleOpenCancelConfirm = useCallback((order: FinancialOrder) => {
        setCancelConfirm({ isOpen: true, order, isSubmitting: false });
    }, []);

    const handleCancelConfirmDismiss = useCallback(() => {
        setCancelConfirm({ isOpen: false, order: null, isSubmitting: false });
    }, []);

    const handleConfirmCancel = useCallback(async () => {
        if (!cancelConfirm.order || !onCancelOrder) return;

        setCancelConfirm(prev => ({ ...prev, isSubmitting: true }));

        try {
            await onCancelOrder({
                orderId: cancelConfirm.order.orderId,
                symbol: cancelConfirm.order.symbol,
            });
            setCancelConfirm({ isOpen: false, order: null, isSubmitting: false });
        } catch (error) {
            setCancelConfirm(prev => ({ ...prev, isSubmitting: false }));
        }
    }, [cancelConfirm, onCancelOrder]);

    const handleCancelSelected = useCallback(async () => {
        if (!onCancelAll || selectedOrderIds.size === 0) return;
        await onCancelAll();
        setSelectedOrderIds(new Set());
    }, [onCancelAll, selectedOrderIds]);

    const handleShowDetails = useCallback((order: FinancialOrder) => {
        onShowDetails?.(order);
    }, [onShowDetails]);

    // Utility
    const formatOrderType = useCallback((type: OrderType): string => {
        return type.replace(/_/g, ' ');
    }, []);

    const formatOrderStatus = useCallback((status: OrderStatus): string => {
        return status.replace(/_/g, ' ');
    }, []);

    const getStatusClass = useCallback((status: OrderStatus): string => {
        switch (status) {
            case 'FILLED': return 'ark-status--success';
            case 'PARTIALLY_FILLED': return 'ark-status--warning';
            case 'CANCELED':
            case 'REJECTED':
            case 'EXPIRED': return 'ark-status--error';
            default: return 'ark-status--pending';
        }
    }, []);

    return {
        model,
        columns,
        filteredOrders,
        totalCount: orders.length,
        sort,
        filter,
        selectedOrderIds,
        editModal,
        cancelConfirm,
        handleSort,
        handleFilter,
        handleClearFilters,
        handleRowClick,
        handleSelectOrder,
        handleSelectAll,
        handleOpenEditModal,
        handleEditModalDismiss,
        handleEditPriceChange,
        handleEditQuantityChange,
        handleConfirmEdit,
        handleOpenCancelConfirm,
        handleCancelConfirmDismiss,
        handleConfirmCancel,
        handleCancelSelected,
        handleShowDetails,
        formatOrderType,
        formatOrderStatus,
        getStatusClass,
    };
}

export default useOrdersGrid;
