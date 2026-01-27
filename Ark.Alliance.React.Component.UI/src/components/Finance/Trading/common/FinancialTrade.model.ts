/**
 * @fileoverview Universal Financial Trade Model
 * @module components/Finance/Trading/common
 * 
 * Trade history model with fee calculations and net profit.
 */

import { z } from 'zod';
import { InstrumentTypeSchema } from './InstrumentType.model';
import { OrderSideSchema, PositionSideSchema, OrderTypeSchema } from './FinancialOrder.model';

// ═══════════════════════════════════════════════════════════════════════════
// TRADE SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Trade execution role.
 */
export const TradeRoleSchema = z.enum(['MAKER', 'TAKER']);
export type TradeRole = z.infer<typeof TradeRoleSchema>;

/**
 * Comprehensive financial trade model.
 */
export const FinancialTradeSchema = z.object({
    // ═══════════════════════════════════════════════════════════════════════
    // IDENTIFICATION
    // ═══════════════════════════════════════════════════════════════════════

    /** Trade ID */
    tradeId: z.union([z.string(), z.number()]),
    /** Associated order ID */
    orderId: z.union([z.string(), z.number()]),
    /** Client order ID */
    clientOrderId: z.string().optional(),
    /** Trading symbol */
    symbol: z.string().min(1),
    /** Instrument type */
    instrumentType: InstrumentTypeSchema,
    /** Exchange */
    exchange: z.string().optional(),
    /** Account ID */
    accountId: z.string().optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // TRADE DETAILS
    // ═══════════════════════════════════════════════════════════════════════

    /** Trade side */
    side: OrderSideSchema,
    /** Position side (futures) */
    positionSide: PositionSideSchema.optional(),
    /** Order type that created this trade */
    orderType: OrderTypeSchema.optional(),
    /** Execution price */
    price: z.number().positive(),
    /** Trade quantity */
    quantity: z.number().positive(),
    /** Quote quantity (price × quantity) */
    quoteQty: z.number().positive().optional(),
    /** Trade timestamp */
    timestamp: z.number(),

    // ═══════════════════════════════════════════════════════════════════════
    // P&L & FEES
    // ═══════════════════════════════════════════════════════════════════════

    /** Realized P&L (for closing trades) */
    realizedPnl: z.number().optional(),
    /** Commission/fee amount */
    commission: z.number().min(0),
    /** Commission asset */
    commissionAsset: z.string(),
    /** Net profit (realizedPnl - commission) */
    netProfit: z.number().optional(),
    /** Fee rate (percentage) */
    feeRate: z.number().min(0).optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // EXECUTION INFO
    // ═══════════════════════════════════════════════════════════════════════

    /** Maker or taker */
    role: TradeRoleSchema.optional(),
    /** Is this a self-trade */
    isSelfTrade: z.boolean().optional(),
    /** Is this part of a liquidation */
    isLiquidation: z.boolean().optional(),
    /** Is this a funding payment */
    isFunding: z.boolean().optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // FUTURES-SPECIFIC
    // ═══════════════════════════════════════════════════════════════════════

    /** Leverage at time of trade */
    leverage: z.number().min(1).max(125).optional(),
    /** Is reduce-only trade */
    reduceOnly: z.boolean().optional(),
    /** Contract multiplier */
    contractMultiplier: z.number().positive().optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // OPTIONS-SPECIFIC
    // ═══════════════════════════════════════════════════════════════════════

    /** Strike price */
    strikePrice: z.number().positive().optional(),
    /** Option type */
    optionType: z.enum(['CALL', 'PUT']).optional(),
    /** Expiration date */
    expirationDate: z.string().optional(),
    /** Underlying asset */
    underlying: z.string().optional(),
    /** Premium paid/received */
    premium: z.number().optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // METADATA
    // ═══════════════════════════════════════════════════════════════════════

    /** Counterparty (if available) */
    counterpartyId: z.string().optional(),
    /** Settlement date */
    settlementDate: z.string().optional(),
    /** Tags/labels */
    tags: z.array(z.string()).optional(),
});

export type FinancialTrade = z.infer<typeof FinancialTradeSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// FACTORY & UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a financial trade.
 */
export function createFinancialTrade(
    data: Partial<FinancialTrade> & Pick<FinancialTrade, 'tradeId' | 'orderId' | 'symbol' | 'instrumentType' | 'side' | 'price' | 'quantity' | 'timestamp' | 'commission' | 'commissionAsset'>
): FinancialTrade {
    const trade = FinancialTradeSchema.parse(data);

    // Calculate net profit if realized PnL is available
    if (trade.realizedPnl !== undefined && trade.netProfit === undefined) {
        trade.netProfit = trade.realizedPnl - trade.commission;
    }

    // Calculate quote quantity if not provided
    if (trade.quoteQty === undefined) {
        trade.quoteQty = trade.price * trade.quantity;
    }

    return trade;
}

/**
 * Calculate net profit from trade.
 */
export function calculateNetProfit(
    realizedPnl: number,
    commission: number
): number {
    return realizedPnl - commission;
}

/**
 * Calculate total P&L from trades array.
 */
export function calculateTotalPnl(trades: FinancialTrade[]): {
    totalRealizedPnl: number;
    totalCommission: number;
    totalNetProfit: number;
    tradeCount: number;
    winCount: number;
    lossCount: number;
    winRate: number;
} {
    let totalRealizedPnl = 0;
    let totalCommission = 0;
    let winCount = 0;
    let lossCount = 0;

    for (const trade of trades) {
        totalCommission += trade.commission;
        if (trade.realizedPnl !== undefined) {
            totalRealizedPnl += trade.realizedPnl;
            if (trade.realizedPnl > 0) winCount++;
            else if (trade.realizedPnl < 0) lossCount++;
        }
    }

    const tradeCount = trades.length;
    const totalNetProfit = totalRealizedPnl - totalCommission;
    const winRate = tradeCount > 0 ? (winCount / tradeCount) * 100 : 0;

    return {
        totalRealizedPnl,
        totalCommission,
        totalNetProfit,
        tradeCount,
        winCount,
        lossCount,
        winRate,
    };
}
