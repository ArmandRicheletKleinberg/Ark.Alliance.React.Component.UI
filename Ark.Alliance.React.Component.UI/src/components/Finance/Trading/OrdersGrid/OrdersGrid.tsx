/**
 * @fileoverview Orders Grid Component
 * @module components/Finance/Trading/OrdersGrid
 */

import React, { memo, type ReactNode } from 'react';
import { useOrdersGrid, type UseOrdersGridOptions } from './OrdersGrid.viewmodel';
import type { FinancialOrder } from '../common';
import { TradingGridCard } from '../TradingGridCard';
import { FAIcon } from '../../../Icon';
import './OrdersGrid.scss';

export interface OrdersGridProps extends UseOrdersGridOptions {
    className?: string;
    headerActions?: ReactNode;
    emptyState?: ReactNode;
    isLoading?: boolean;
}

export const OrdersGrid = memo(function OrdersGrid(props: OrdersGridProps) {
    const {
        className = '',
        headerActions,
        emptyState,
        isLoading = false,
        ...options
    } = props;

    const vm = useOrdersGrid(options);

    const renderCellValue = (order: FinancialOrder, columnKey: string): ReactNode => {
        const value = (order as Record<string, unknown>)[columnKey];

        switch (columnKey) {
            case 'side':
                return (
                    <span className={`ark-orders-grid__side ark-orders-grid__side--${(value as string).toLowerCase()}`}>
                        {value as string}
                    </span>
                );

            case 'type':
                return (
                    <span className="ark-orders-grid__type">
                        {vm.formatOrderType(value as string)}
                    </span>
                );

            case 'status':
                return (
                    <span className={`ark-orders-grid__status ${vm.getStatusClass(value as string)}`}>
                        {vm.formatOrderStatus(value as string)}
                    </span>
                );

            case 'category':
                return value ? (
                    <span className={`ark-orders-grid__category ark-orders-grid__category--${(value as string).toLowerCase()}`}>
                        {value as string}
                    </span>
                ) : '-';

            case 'price':
            case 'stopPrice':
            case 'avgFillPrice':
                return value != null ? (value as number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 }) : '-';

            case 'quantity':
            case 'executedQty':
            case 'remainingQty':
                return value != null ? (value as number).toLocaleString(undefined, { maximumFractionDigits: 8 }) : '-';

            case 'createdAt':
                return value ? new Date(value as number).toLocaleTimeString() : '-';

            case 'actions':
                return (
                    <div className="ark-orders-grid__actions">
                        <button
                            className="ark-orders-grid__btn ark-orders-grid__btn--edit"
                            onClick={(e) => { e.stopPropagation(); vm.handleOpenEditModal(order); }}
                            title="Modify Order"
                        >
                            <FAIcon name="pen" size="xs" />
                        </button>
                        <button
                            className="ark-orders-grid__btn ark-orders-grid__btn--cancel"
                            onClick={(e) => { e.stopPropagation(); vm.handleOpenCancelConfirm(order); }}
                            title="Cancel Order"
                        >
                            <FAIcon name="xmark" size="xs" />
                        </button>
                        <button
                            className="ark-orders-grid__btn ark-orders-grid__btn--details"
                            onClick={(e) => { e.stopPropagation(); vm.handleShowDetails(order); }}
                            title="View Details"
                        >
                            <FAIcon name="ellipsis" size="xs" />
                        </button>
                    </div>
                );

            default:
                return value != null ? String(value) : '-';
        }
    };

    return (
        <TradingGridCard
            title={vm.model.title}
            subtitle={vm.model.subtitle || `${vm.totalCount} order${vm.totalCount !== 1 ? 's' : ''}`}
            status="info"
            isDark={vm.model.isDark}
            className={`ark-orders-grid ${className}`}
            headerActions={
                <>
                    {vm.model.enableBatchCancel && vm.selectedOrderIds.size > 0 && (
                        <button
                            className="ark-orders-grid__batch-cancel"
                            onClick={vm.handleCancelSelected}
                        >
                            Cancel Selected ({vm.selectedOrderIds.size})
                        </button>
                    )}
                    {headerActions}
                </>
            }
        >
            {vm.model.showSymbolFilter && (
                <div className="ark-orders-grid__filter-bar">
                    <input
                        type="text"
                        placeholder="Filter by symbol..."
                        value={vm.filter.symbol || ''}
                        onChange={(e) => vm.handleFilter({ symbol: e.target.value })}
                        className="ark-orders-grid__filter-input"
                    />
                </div>
            )}

            {isLoading ? (
                <div className="ark-orders-grid__loading">
                    <FAIcon name="spinner" spin size="lg" />
                </div>
            ) : vm.filteredOrders.length === 0 ? (
                emptyState || <div className="ark-orders-grid__empty">No open orders</div>
            ) : (
                <div className="ark-orders-grid__table-wrapper">
                    <table className="ark-orders-grid__table">
                        <thead>
                            <tr>
                                {vm.model.enableSelection && (
                                    <th className="ark-orders-grid__th ark-orders-grid__th--checkbox">
                                        <input
                                            type="checkbox"
                                            checked={vm.selectedOrderIds.size === vm.filteredOrders.length}
                                            onChange={(e) => vm.handleSelectAll(e.target.checked)}
                                        />
                                    </th>
                                )}
                                {vm.columns.filter(c => c.visible !== false).map((col) => (
                                    <th
                                        key={col.key}
                                        className={`ark-orders-grid__th ark-orders-grid__th--${col.align || 'right'}`}
                                        style={{ width: col.width }}
                                        onClick={col.sortable !== false ? () => vm.handleSort(col.key) : undefined}
                                    >
                                        <span className="ark-orders-grid__th-content">
                                            {col.label}
                                            {vm.sort.column === col.key && vm.sort.direction && (
                                                <FAIcon name={vm.sort.direction === 'asc' ? 'arrow-up' : 'arrow-down'} size="xs" />
                                            )}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {vm.filteredOrders.map((order) => (
                                <tr
                                    key={String(order.orderId)}
                                    className="ark-orders-grid__row"
                                    onClick={() => vm.handleRowClick(order)}
                                >
                                    {vm.model.enableSelection && (
                                        <td className="ark-orders-grid__td ark-orders-grid__td--checkbox">
                                            <input
                                                type="checkbox"
                                                checked={vm.selectedOrderIds.has(order.orderId)}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    vm.handleSelectOrder(order.orderId, e.target.checked);
                                                }}
                                            />
                                        </td>
                                    )}
                                    {vm.columns.filter(c => c.visible !== false).map((col) => (
                                        <td key={col.key} className={`ark-orders-grid__td ark-orders-grid__td--${col.align || 'right'}`}>
                                            {renderCellValue(order, col.key)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {vm.editModal.isOpen && vm.editModal.order && (
                <div className="ark-orders-grid__modal-overlay" onClick={vm.handleEditModalDismiss}>
                    <div className="ark-orders-grid__modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ark-orders-grid__modal-header">
                            <h4>Modify Order</h4>
                            <button onClick={vm.handleEditModalDismiss}><FAIcon name="xmark" /></button>
                        </div>
                        <div className="ark-orders-grid__modal-body">
                            <p>{vm.editModal.order.symbol} {vm.editModal.order.side} {vm.editModal.order.type}</p>
                            <div className="ark-orders-grid__form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    value={vm.editModal.newPrice}
                                    onChange={(e) => vm.handleEditPriceChange(e.target.value)}
                                    step="any"
                                />
                            </div>
                            <div className="ark-orders-grid__form-group">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    value={vm.editModal.newQuantity}
                                    onChange={(e) => vm.handleEditQuantityChange(e.target.value)}
                                    step="any"
                                />
                            </div>
                            {vm.editModal.errors.length > 0 && (
                                <div className="ark-orders-grid__errors">
                                    {vm.editModal.errors.map((err, i) => (
                                        <div key={i} className="ark-orders-grid__error">{err}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="ark-orders-grid__modal-footer">
                            <button className="ark-orders-grid__btn--secondary" onClick={vm.handleEditModalDismiss}>Cancel</button>
                            <button className="ark-orders-grid__btn--primary" onClick={vm.handleConfirmEdit} disabled={vm.editModal.isSubmitting}>
                                {vm.editModal.isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation */}
            {vm.cancelConfirm.isOpen && vm.cancelConfirm.order && (
                <div className="ark-orders-grid__modal-overlay" onClick={vm.handleCancelConfirmDismiss}>
                    <div className="ark-orders-grid__modal ark-orders-grid__modal--sm" onClick={(e) => e.stopPropagation()}>
                        <div className="ark-orders-grid__modal-header">
                            <h4>Cancel Order</h4>
                            <button onClick={vm.handleCancelConfirmDismiss}><FAIcon name="xmark" /></button>
                        </div>
                        <div className="ark-orders-grid__modal-body">
                            <p>Cancel {vm.cancelConfirm.order.symbol} {vm.cancelConfirm.order.side} order?</p>
                        </div>
                        <div className="ark-orders-grid__modal-footer">
                            <button className="ark-orders-grid__btn--secondary" onClick={vm.handleCancelConfirmDismiss}>Keep</button>
                            <button className="ark-orders-grid__btn--danger" onClick={vm.handleConfirmCancel} disabled={vm.cancelConfirm.isSubmitting}>
                                {vm.cancelConfirm.isSubmitting ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </TradingGridCard>
    );
});

export default OrdersGrid;
