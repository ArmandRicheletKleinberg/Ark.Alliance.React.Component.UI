/**
 * @fileoverview Orders Grid Model
 * @module components/Finance/Trading/OrdersGrid
 * 
 * Model definitions for the open orders trading grid.
 */

import { z } from 'zod';
import {
    InstrumentTypeSchema,
    OrderTypeSchema,
    OrderStatusSchema,
    OrderSideSchema,
    OrderCategorySchema,
    TimeInForceSchema,
} from '../common';

// ═══════════════════════════════════════════════════════════════════════════
// COLUMN DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Order grid column keys.
 */
export const OrderColumnKeySchema = z.enum([
    // Core columns
    'symbol',
    'type',
    'side',
    'price',
    'stopPrice',
    'quantity',
    'executedQty',
    'remainingQty',
    'status',
    'category',
    'timeInForce',
    'createdAt',
    'actions',

    // Futures columns
    'positionSide',
    'leverage',
    'reduceOnly',
    'closePosition',

    // Options columns
    'strikePrice',
    'optionType',
    'expirationDate',

    // Advanced columns
    'avgFillPrice',
    'takeProfitPrice',
    'stopLossPrice',
    'trailingDelta',
    'triggerCondition',

    // Identification
    'orderId',
    'clientOrderId',
]);

export type OrderColumnKey = z.infer<typeof OrderColumnKeySchema>;

/**
 * Column configuration.
 */
export const OrderColumnConfigSchema = z.object({
    key: OrderColumnKeySchema,
    label: z.string(),
    width: z.number().default(100),
    minWidth: z.number().optional(),
    maxWidth: z.number().optional(),
    sortable: z.boolean().default(true),
    visible: z.boolean().default(true),
    editable: z.boolean().default(false),
    align: z.enum(['left', 'center', 'right']).default('right'),
    formatPreset: z.enum([
        'text', 'number', 'currency', 'percent', 'date', 'datetime',
        'orderType', 'orderStatus', 'side', 'category', 'timeInForce'
    ]).optional(),
});

export type OrderColumnConfig = z.infer<typeof OrderColumnConfigSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// GRID MODEL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Orders grid model schema.
 */
export const OrdersGridModelSchema = z.object({
    gridId: z.string().default('orders-grid'),
    title: z.string().default('Open Orders'),
    subtitle: z.string().optional(),
    isDark: z.boolean().default(true),
    columns: z.array(OrderColumnConfigSchema).optional(),
    showTypeFilter: z.boolean().default(true),
    showSymbolFilter: z.boolean().default(true),
    showStatusFilter: z.boolean().default(false),
    enablePersistence: z.boolean().default(true),
    enableSelection: z.boolean().default(false),
    enableBatchCancel: z.boolean().default(true),
    compact: z.boolean().default(false),
    refreshInterval: z.number().default(0),
});

export type OrdersGridModel = z.infer<typeof OrdersGridModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// MODIFY/CANCEL REQUESTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Modify order request.
 */
export const ModifyOrderRequestSchema = z.object({
    orderId: z.union([z.string(), z.number()]),
    symbol: z.string(),
    newPrice: z.number().positive('Price must be positive').optional(),
    newQuantity: z.number().positive('Quantity must be positive').optional(),
    newStopPrice: z.number().positive('Stop price must be positive').optional(),
});

export type ModifyOrderRequest = z.infer<typeof ModifyOrderRequestSchema>;

/**
 * Cancel order request.
 */
export const CancelOrderRequestSchema = z.object({
    orderId: z.union([z.string(), z.number()]),
    symbol: z.string(),
});

export type CancelOrderRequest = z.infer<typeof CancelOrderRequestSchema>;

/**
 * Validate modify order request.
 */
export function validateModifyOrderRequest(
    request: ModifyOrderRequest,
    tickSize?: number,
    stepSize?: number
): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.newPrice && !request.newQuantity && !request.newStopPrice) {
        errors.push('At least one field must be modified');
    }

    if (request.newPrice !== undefined) {
        if (request.newPrice <= 0) {
            errors.push('Price must be positive');
        }
        if (tickSize && tickSize > 0) {
            const remainder = (request.newPrice * 1e8) % (tickSize * 1e8);
            if (remainder !== 0) {
                errors.push(`Price must be a multiple of ${tickSize}`);
            }
        }
    }

    if (request.newQuantity !== undefined) {
        if (request.newQuantity <= 0) {
            errors.push('Quantity must be positive');
        }
        if (stepSize && stepSize > 0) {
            const remainder = (request.newQuantity * 1e8) % (stepSize * 1e8);
            if (remainder !== 0) {
                errors.push(`Quantity must be a multiple of ${stepSize}`);
            }
        }
    }

    return { valid: errors.length === 0, errors };
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT COLUMNS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default columns for orders grid.
 */
export const defaultOrderColumns: OrderColumnConfig[] = [

    { key: 'symbol', label: 'Symbol', width: 100, align: 'left', formatPreset: 'text', sortable: true, visible: true, editable: false },
    { key: 'type', label: 'Type', width: 90, align: 'center', formatPreset: 'orderType', sortable: true, visible: true, editable: false },
    { key: 'side', label: 'Side', width: 60, align: 'center', formatPreset: 'side', sortable: true, visible: true, editable: false },
    { key: 'price', label: 'Price', width: 100, align: 'right', formatPreset: 'currency', editable: true, sortable: true, visible: true },
    { key: 'stopPrice', label: 'Trigger', width: 100, align: 'right', formatPreset: 'currency', visible: false, sortable: true, editable: false },
    { key: 'quantity', label: 'Qty', width: 80, align: 'right', formatPreset: 'number', editable: true, sortable: true, visible: true },
    { key: 'executedQty', label: 'Filled', width: 80, align: 'right', formatPreset: 'number', sortable: true, visible: true, editable: false },
    { key: 'status', label: 'Status', width: 100, align: 'center', formatPreset: 'orderStatus', sortable: true, visible: true, editable: false },
    { key: 'category', label: 'Category', width: 80, align: 'center', formatPreset: 'category', sortable: true, visible: true, editable: false },
    { key: 'createdAt', label: 'Time', width: 90, align: 'right', formatPreset: 'datetime', sortable: true, visible: true, editable: false },
    { key: 'actions', label: '', width: 130, align: 'center', sortable: false, visible: true, editable: false },
];

/**
 * Create an orders grid model with defaults.
 */
export function createOrdersGridModel(
    partial?: Partial<OrdersGridModel>
): OrdersGridModel {
    return OrdersGridModelSchema.parse({
        ...partial,
    });
}
