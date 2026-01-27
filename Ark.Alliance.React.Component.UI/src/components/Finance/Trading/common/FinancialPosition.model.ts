/**
 * @fileoverview Universal Financial Position Model
 * @module components/Finance/Trading/common
 * 
 * Comprehensive position model for all instrument types with P&L calculations.
 */

import { z } from 'zod';
import { InstrumentTypeSchema } from './InstrumentType.model';
import { MarginTypeSchema, PositionSideSchema, OptionTypeSchema } from './FinancialOrder.model';

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const positiveNumber = z.number().positive();
const nonNegativeNumber = z.number().min(0);
const priceSchema = z.number().positive();
const percentageSchema = z.number();

// ═══════════════════════════════════════════════════════════════════════════
// POSITION SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Comprehensive financial position model.
 */
export const FinancialPositionSchema = z.object({
    // ═══════════════════════════════════════════════════════════════════════
    // IDENTIFICATION
    // ═══════════════════════════════════════════════════════════════════════

    /** Position ID (if available) */
    positionId: z.string().optional(),
    /** Trading symbol */
    symbol: z.string().min(1),
    /** Instrument type */
    instrumentType: InstrumentTypeSchema,
    /** Exchange */
    exchange: z.string().optional(),
    /** Account ID */
    accountId: z.string().optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // POSITION DETAILS
    // ═══════════════════════════════════════════════════════════════════════

    /** Position side */
    side: z.enum(['LONG', 'SHORT']),
    /** Position side (hedged mode) */
    positionSide: PositionSideSchema.default('BOTH'),
    /** Position quantity (absolute value) */
    quantity: nonNegativeNumber,
    /** Position amount (signed: positive=long, negative=short) */
    positionAmt: z.number(),
    /** Available quantity for trading */
    availableQty: nonNegativeNumber.optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // PRICING
    // ═══════════════════════════════════════════════════════════════════════

    /** Average entry price */
    entryPrice: priceSchema,
    /** Current mark/market price */
    markPrice: priceSchema,
    /** Break-even price (including fees) */
    breakEvenPrice: priceSchema.optional(),
    /** Liquidation price */
    liquidationPrice: priceSchema.optional(),
    /** Last trade price */
    lastPrice: priceSchema.optional(),
    /** Index price (for derivatives) */
    indexPrice: priceSchema.optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // P&L (with validation)
    // ═══════════════════════════════════════════════════════════════════════

    /** Unrealized P&L (current position) */
    unrealizedPnl: z.number(),
    /** Unrealized P&L percentage */
    unrealizedPnlPercent: percentageSchema.optional(),
    /** Realized P&L (closed trades) */
    realizedPnl: z.number().optional(),
    /** Return on equity (ROE) */
    roe: percentageSchema.optional(),
    /** Total P&L (unrealized + realized) */
    totalPnl: z.number().optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // MARGIN & LEVERAGE (Futures/CFD)
    // ═══════════════════════════════════════════════════════════════════════

    /** Leverage multiplier */
    leverage: z.number().min(1).max(125).optional(),
    /** Margin type */
    marginType: MarginTypeSchema.optional(),
    /** Initial margin */
    initialMargin: nonNegativeNumber.optional(),
    /** Maintenance margin */
    maintMargin: nonNegativeNumber.optional(),
    /** Margin balance */
    marginBalance: nonNegativeNumber.optional(),
    /** Isolated wallet (for isolated margin) */
    isolatedWallet: nonNegativeNumber.optional(),
    /** Cross wallet balance */
    crossWallet: nonNegativeNumber.optional(),
    /** Max notional (position limit) */
    maxNotional: positiveNumber.optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // VALUE & NOTIONAL
    // ═══════════════════════════════════════════════════════════════════════

    /** Position notional value */
    notional: z.number().optional(),
    /** Position cost basis */
    cost: nonNegativeNumber.optional(),
    /** Market value */
    marketValue: z.number().optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // OPTIONS-SPECIFIC
    // ═══════════════════════════════════════════════════════════════════════

    /** Strike price */
    strikePrice: priceSchema.optional(),
    /** Option type */
    optionType: OptionTypeSchema.optional(),
    /** Expiration date */
    expirationDate: z.string().optional(),
    /** Underlying asset */
    underlying: z.string().optional(),
    /** Days to expiration */
    daysToExpiry: z.number().int().min(0).optional(),

    // Greeks
    /** Delta */
    delta: z.number().min(-1).max(1).optional(),
    /** Gamma */
    gamma: nonNegativeNumber.optional(),
    /** Theta (daily) */
    theta: z.number().optional(),
    /** Vega */
    vega: z.number().optional(),
    /** Rho */
    rho: z.number().optional(),
    /** Implied volatility */
    impliedVolatility: percentageSchema.optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // FUTURES-SPECIFIC
    // ═══════════════════════════════════════════════════════════════════════

    /** Contract expiration */
    contractExpiry: z.string().optional(),
    /** Contract multiplier */
    contractMultiplier: positiveNumber.optional(),
    /** Funding rate (perpetuals) */
    fundingRate: z.number().optional(),
    /** Next funding time */
    nextFundingTime: z.number().optional(),
    /** Accumulated funding */
    accumulatedFunding: z.number().optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // STOCKS/BONDS
    // ═══════════════════════════════════════════════════════════════════════

    /** Dividend yield */
    dividendYield: percentageSchema.optional(),
    /** Coupon rate (bonds) */
    couponRate: percentageSchema.optional(),
    /** Maturity date (bonds) */
    maturityDate: z.string().optional(),
    /** Accrued interest (bonds) */
    accruedInterest: nonNegativeNumber.optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // TIME
    // ═══════════════════════════════════════════════════════════════════════

    /** Position open time */
    openTime: z.number().optional(),
    /** Last update time */
    updateTime: z.number().optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // METADATA
    // ═══════════════════════════════════════════════════════════════════════

    /** Auto-deleverage ranking */
    adlRanking: z.number().int().min(1).max(5).optional(),
    /** Is position auto-close enabled */
    autoCloseEnabled: z.boolean().optional(),
    /** Tags/labels */
    tags: z.array(z.string()).optional(),
});

export type FinancialPosition = z.infer<typeof FinancialPositionSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// FACTORY & UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a financial position with defaults.
 */
export function createFinancialPosition(
    data: Partial<FinancialPosition> & Pick<FinancialPosition, 'symbol' | 'instrumentType' | 'side' | 'quantity' | 'positionAmt' | 'entryPrice' | 'markPrice' | 'unrealizedPnl'>
): FinancialPosition {
    return FinancialPositionSchema.parse({
        positionSide: 'BOTH',
        ...data,
    });
}

/**
 * Calculate ROE (Return on Equity).
 */
export function calculateROE(
    unrealizedPnl: number,
    initialMargin: number
): number {
    if (initialMargin <= 0) return 0;
    return (unrealizedPnl / initialMargin) * 100;
}

/**
 * Calculate unrealized P&L.
 */
export function calculateUnrealizedPnl(
    side: 'LONG' | 'SHORT',
    quantity: number,
    entryPrice: number,
    markPrice: number,
    contractMultiplier: number = 1
): number {
    const priceDiff = markPrice - entryPrice;
    const multiplier = side === 'LONG' ? 1 : -1;
    return multiplier * quantity * priceDiff * contractMultiplier;
}

/**
 * Validate position quantity for modification.
 */
export function validatePositionQuantity(
    quantity: number,
    availableQty: number,
    minQty?: number
): { valid: boolean; message?: string } {
    if (quantity <= 0) {
        return { valid: false, message: 'Quantity must be positive' };
    }
    if (quantity > availableQty) {
        return { valid: false, message: `Cannot exceed available quantity (${availableQty})` };
    }
    if (minQty !== undefined && quantity < minQty) {
        return { valid: false, message: `Minimum quantity is ${minQty}` };
    }
    return { valid: true };
}
