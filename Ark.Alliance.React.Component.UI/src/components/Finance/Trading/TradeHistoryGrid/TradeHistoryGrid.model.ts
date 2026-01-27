/**
 * @fileoverview Trade History Grid Model
 * @module components/Finance/Trading/TradeHistoryGrid
 */

import { z } from 'zod';
import { InstrumentTypeSchema, OrderSideSchema, TradeRoleSchema } from '../common';

// ═══════════════════════════════════════════════════════════════════════════
// COLUMN DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export const TradeColumnKeySchema = z.enum([
    'timestamp',
    'symbol',
    'side',
    'orderType',
    'price',
    'quantity',
    'quoteQty',
    'commission',
    'commissionAsset',
    'realizedPnl',
    'netProfit',
    'role',
    'positionSide',
    'tradeId',
    'orderId',
]);

export type TradeColumnKey = z.infer<typeof TradeColumnKeySchema>;

export const TradeColumnConfigSchema = z.object({
    key: TradeColumnKeySchema,
    label: z.string(),
    width: z.number().default(100),
    sortable: z.boolean().default(true),
    visible: z.boolean().default(true),
    align: z.enum(['left', 'center', 'right']).default('right'),
});

export type TradeColumnConfig = z.infer<typeof TradeColumnConfigSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// GRID MODEL
// ═══════════════════════════════════════════════════════════════════════════

export const TradeHistoryGridModelSchema = z.object({
    gridId: z.string().default('trade-history-grid'),
    title: z.string().default('Trade History'),
    subtitle: z.string().optional(),
    isDark: z.boolean().default(true),
    columns: z.array(TradeColumnConfigSchema).optional(),
    showSymbolFilter: z.boolean().default(true),
    showDateFilter: z.boolean().default(true),
    showSummary: z.boolean().default(true),
    enableExport: z.boolean().default(true),
    pageSize: z.number().default(50),
    compact: z.boolean().default(false),
});

export type TradeHistoryGridModel = z.infer<typeof TradeHistoryGridModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DATE FILTER
// ═══════════════════════════════════════════════════════════════════════════

export const DateRangePresetSchema = z.enum([
    'TODAY',
    'YESTERDAY',
    'LAST_7_DAYS',
    'LAST_30_DAYS',
    'THIS_MONTH',
    'LAST_MONTH',
    'CUSTOM',
]);

export type DateRangePreset = z.infer<typeof DateRangePresetSchema>;

export interface DateRange {
    start: number;
    end: number;
    preset?: DateRangePreset;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT COLUMNS
// ═══════════════════════════════════════════════════════════════════════════

export const defaultTradeColumns: TradeColumnConfig[] = [
    { key: 'timestamp', label: 'Time', width: 100, align: 'left', sortable: true, visible: true },
    { key: 'symbol', label: 'Symbol', width: 90, align: 'left', sortable: true, visible: true },
    { key: 'side', label: 'Side', width: 60, align: 'center', sortable: true, visible: true },
    { key: 'orderType', label: 'Type', width: 80, align: 'center', sortable: true, visible: true },
    { key: 'price', label: 'Price', width: 100, align: 'right', sortable: true, visible: true },
    { key: 'quantity', label: 'Qty', width: 80, align: 'right', sortable: true, visible: true },
    { key: 'commission', label: 'Fee', width: 80, align: 'right', sortable: true, visible: true },
    { key: 'realizedPnl', label: 'PnL', width: 90, align: 'right', sortable: true, visible: true },
    { key: 'netProfit', label: 'Net', width: 90, align: 'right', sortable: true, visible: true },
    { key: 'role', label: 'Role', width: 70, align: 'center', sortable: true, visible: true },
];

export function createTradeHistoryGridModel(partial?: Partial<TradeHistoryGridModel>): TradeHistoryGridModel {
    return TradeHistoryGridModelSchema.parse({ ...partial });
}
