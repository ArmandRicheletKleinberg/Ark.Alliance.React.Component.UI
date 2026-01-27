/**
 * @fileoverview Positions Grid Model
 * @module components/Finance/Trading/PositionsGrid
 * 
 * Model definitions for the positions trading grid.
 */

import { z } from 'zod';
import {
    InstrumentTypeSchema,
    FinancialPositionSchema,
    MarginTypeSchema,
} from '../common';

// ═══════════════════════════════════════════════════════════════════════════
// COLUMN DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Position grid column keys.
 */
export const PositionColumnKeySchema = z.enum([
    // Core columns (all instruments)
    'symbol',
    'side',
    'quantity',
    'entryPrice',
    'markPrice',
    'unrealizedPnl',
    'unrealizedPnlPercent',
    'actions',

    // Futures/Perpetuals columns
    'leverage',
    'marginType',
    'liquidationPrice',
    'margin',
    'roe',
    'fundingRate',

    // Options columns
    'strikePrice',
    'optionType',
    'expirationDate',
    'delta',
    'gamma',
    'theta',
    'vega',
    'impliedVolatility',

    // Value columns
    'notional',
    'cost',
    'marketValue',

    // Time
    'openTime',
    'updateTime',
]);

export type PositionColumnKey = z.infer<typeof PositionColumnKeySchema>;

/**
 * Column configuration.
 */
export const PositionColumnConfigSchema = z.object({
    key: PositionColumnKeySchema,
    label: z.string(),
    width: z.number().default(100),
    minWidth: z.number().optional(),
    maxWidth: z.number().optional(),
    sortable: z.boolean().default(true),
    visible: z.boolean().default(true),
    align: z.enum(['left', 'center', 'right']).default('right'),
    /** Format preset for display */
    formatPreset: z.enum([
        'text', 'number', 'currency', 'percent', 'date', 'datetime',
        'pnl', 'side', 'leverage', 'margin', 'greeks'
    ]).optional(),
});

export type PositionColumnConfig = z.infer<typeof PositionColumnConfigSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// GRID MODEL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Positions grid model schema.
 */
export const PositionsGridModelSchema = z.object({
    /** Grid identifier for persistence */
    gridId: z.string().default('positions-grid'),
    /** Title */
    title: z.string().default('Positions'),
    /** Subtitle (e.g., position count) */
    subtitle: z.string().optional(),
    /** Dark mode */
    isDark: z.boolean().default(true),
    /** Columns to display */
    columns: z.array(PositionColumnConfigSchema).optional(),
    /** Show instrument type filter */
    showInstrumentFilter: z.boolean().default(false),
    /** Show symbol filter */
    showSymbolFilter: z.boolean().default(true),
    /** Enable column persistence */
    enablePersistence: z.boolean().default(true),
    /** Enable row selection */
    enableSelection: z.boolean().default(false),
    /** Show total P&L summary */
    showTotalPnl: z.boolean().default(true),
    /** Compact mode */
    compact: z.boolean().default(false),
    /** Refresh interval in ms (0 = no auto refresh) */
    refreshInterval: z.number().default(0),
});

export type PositionsGridModel = z.infer<typeof PositionsGridModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// CLOSE ACTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Close position request.
 */
export const ClosePositionRequestSchema = z.object({
    symbol: z.string(),
    positionSide: z.enum(['LONG', 'SHORT', 'BOTH']),
    quantity: z.number().positive('Quantity must be positive'),
    closeType: z.enum(['MARKET', 'LIMIT']),
    price: z.number().positive('Price must be positive').optional(),
});

export type ClosePositionRequest = z.infer<typeof ClosePositionRequestSchema>;

/**
 * Validate close position request.
 */
export function validateClosePositionRequest(
    request: ClosePositionRequest,
    availableQty: number,
    minQty?: number,
    tickSize?: number
): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Quantity validation
    if (request.quantity <= 0) {
        errors.push('Quantity must be positive');
    }
    if (request.quantity > availableQty) {
        errors.push(`Cannot close more than available (${availableQty})`);
    }
    if (minQty !== undefined && request.quantity < minQty) {
        errors.push(`Minimum quantity is ${minQty}`);
    }

    // Price validation for LIMIT orders
    if (request.closeType === 'LIMIT') {
        if (!request.price || request.price <= 0) {
            errors.push('Limit price is required for limit orders');
        }
        if (tickSize !== undefined && request.price) {
            const remainder = (request.price * 1e8) % (tickSize * 1e8);
            if (remainder !== 0) {
                errors.push(`Price must be a multiple of ${tickSize}`);
            }
        }
    }

    return { valid: errors.length === 0, errors };
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT COLUMNS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default columns for futures/perpetual positions.
 */
export const defaultFuturesColumns: PositionColumnConfig[] = [
    { key: 'symbol', label: 'Symbol', width: 100, align: 'left', formatPreset: 'text' },
    { key: 'side', label: 'Side', width: 70, align: 'center', formatPreset: 'side' },
    { key: 'quantity', label: 'Size', width: 90, align: 'right', formatPreset: 'number' },
    { key: 'leverage', label: 'Lev', width: 50, align: 'center', formatPreset: 'leverage' },
    { key: 'entryPrice', label: 'Entry', width: 100, align: 'right', formatPreset: 'currency' },
    { key: 'markPrice', label: 'Mark', width: 100, align: 'right', formatPreset: 'currency' },
    { key: 'liquidationPrice', label: 'Liq.', width: 100, align: 'right', formatPreset: 'currency' },
    { key: 'unrealizedPnl', label: 'PnL', width: 100, align: 'right', formatPreset: 'pnl' },
    { key: 'roe', label: 'ROE%', width: 80, align: 'right', formatPreset: 'percent' },
    { key: 'marginType', label: 'Margin', width: 70, align: 'center', formatPreset: 'margin' },
    { key: 'actions', label: '', width: 120, align: 'center', sortable: false },
];

/**
 * Default columns for options positions.
 */
export const defaultOptionsColumns: PositionColumnConfig[] = [
    { key: 'symbol', label: 'Contract', width: 150, align: 'left', formatPreset: 'text' },
    { key: 'optionType', label: 'Type', width: 60, align: 'center' },
    { key: 'strikePrice', label: 'Strike', width: 90, align: 'right', formatPreset: 'currency' },
    { key: 'expirationDate', label: 'Expiry', width: 100, align: 'center', formatPreset: 'date' },
    { key: 'side', label: 'Side', width: 70, align: 'center', formatPreset: 'side' },
    { key: 'quantity', label: 'Qty', width: 70, align: 'right', formatPreset: 'number' },
    { key: 'entryPrice', label: 'Entry', width: 90, align: 'right', formatPreset: 'currency' },
    { key: 'markPrice', label: 'Mark', width: 90, align: 'right', formatPreset: 'currency' },
    { key: 'delta', label: 'Δ', width: 60, align: 'right', formatPreset: 'greeks' },
    { key: 'gamma', label: 'Γ', width: 60, align: 'right', formatPreset: 'greeks' },
    { key: 'theta', label: 'Θ', width: 60, align: 'right', formatPreset: 'greeks' },
    { key: 'unrealizedPnl', label: 'PnL', width: 100, align: 'right', formatPreset: 'pnl' },
    { key: 'actions', label: '', width: 100, align: 'center', sortable: false },
];

/**
 * Default columns for spot/stock positions.
 */
export const defaultSpotColumns: PositionColumnConfig[] = [
    { key: 'symbol', label: 'Symbol', width: 100, align: 'left', formatPreset: 'text' },
    { key: 'quantity', label: 'Holdings', width: 100, align: 'right', formatPreset: 'number' },
    { key: 'entryPrice', label: 'Avg Cost', width: 100, align: 'right', formatPreset: 'currency' },
    { key: 'markPrice', label: 'Price', width: 100, align: 'right', formatPreset: 'currency' },
    { key: 'cost', label: 'Cost', width: 100, align: 'right', formatPreset: 'currency' },
    { key: 'marketValue', label: 'Value', width: 100, align: 'right', formatPreset: 'currency' },
    { key: 'unrealizedPnl', label: 'P&L', width: 100, align: 'right', formatPreset: 'pnl' },
    { key: 'unrealizedPnlPercent', label: 'P&L%', width: 80, align: 'right', formatPreset: 'percent' },
    { key: 'actions', label: '', width: 100, align: 'center', sortable: false },
];

// ═══════════════════════════════════════════════════════════════════════════
// FACTORY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a positions grid model with defaults.
 */
export function createPositionsGridModel(
    partial?: Partial<PositionsGridModel>
): PositionsGridModel {
    return PositionsGridModelSchema.parse({
        ...partial,
    });
}

/**
 * Get default columns for instrument type.
 */
export function getDefaultColumnsForInstrument(
    instrumentType: string
): PositionColumnConfig[] {
    switch (instrumentType) {
        case 'CRYPTO_PERP':
        case 'CRYPTO_FUTURES':
        case 'FUTURES':
            return defaultFuturesColumns;
        case 'OPTIONS':
        case 'CRYPTO_OPTIONS':
            return defaultOptionsColumns;
        case 'CRYPTO_SPOT':
        case 'STOCK':
        case 'ETF':
        default:
            return defaultSpotColumns;
    }
}
