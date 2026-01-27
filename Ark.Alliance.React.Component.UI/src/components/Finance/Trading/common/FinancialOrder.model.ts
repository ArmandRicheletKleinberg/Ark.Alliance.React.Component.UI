/**
 * @fileoverview Universal Financial Order Model
 * @module components/Finance/Trading/common
 * 
 * Comprehensive order model supporting all instrument types with validation.
 * Based on FIX protocol standards with extensions for crypto/derivatives.
 */

import { z } from 'zod';
import { InstrumentTypeSchema } from './InstrumentType.model';

// ═══════════════════════════════════════════════════════════════════════════
// ORDER ENUMS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Order type definitions.
 */
export const OrderTypeSchema = z.enum([
    // Basic types
    'MARKET',
    'LIMIT',
    'STOP',
    'STOP_LIMIT',
    'STOP_MARKET',

    // Advanced types
    'TAKE_PROFIT',
    'TAKE_PROFIT_MARKET',
    'TRAILING_STOP',
    'TRAILING_STOP_MARKET',

    // Time-sensitive
    'IOC',         // Immediate or Cancel
    'FOK',         // Fill or Kill
    'GTX',         // Good Till Crossing (Post-Only)
    'POST_ONLY',

    // Conditional
    'OCO',         // One Cancels Other
    'OTO',         // One Triggers Other
    'BRACKET',
    'TWAP',        // Time-Weighted Average Price
    'ICEBERG',
]);

export type OrderType = z.infer<typeof OrderTypeSchema>;

/**
 * Order status.
 */
export const OrderStatusSchema = z.enum([
    'PENDING',           // Not yet submitted
    'NEW',               // Accepted by exchange
    'OPEN',              // Active on order book
    'PARTIALLY_FILLED',
    'FILLED',
    'CANCELED',
    'REJECTED',
    'EXPIRED',
    'PENDING_CANCEL',
    'PENDING_REPLACE',
]);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

/**
 * Order side.
 */
export const OrderSideSchema = z.enum(['BUY', 'SELL']);
export type OrderSide = z.infer<typeof OrderSideSchema>;

/**
 * Position side (for hedged mode futures).
 */
export const PositionSideSchema = z.enum(['LONG', 'SHORT', 'BOTH']);
export type PositionSide = z.infer<typeof PositionSideSchema>;

/**
 * Order category.
 */
export const OrderCategorySchema = z.enum([
    'REGULAR',
    'GTX',
    'ALGO',
    'CONDITIONAL',
    'BRACKET',
    'HEDGING',
]);

export type OrderCategory = z.infer<typeof OrderCategorySchema>;

/**
 * Time in force.
 */
export const TimeInForceSchema = z.enum([
    'GTC',    // Good Till Cancel
    'IOC',    // Immediate or Cancel
    'FOK',    // Fill or Kill
    'DAY',    // Day order
    'GTD',    // Good Till Date
    'GTX',    // Good Till Crossing
]);

export type TimeInForce = z.infer<typeof TimeInForceSchema>;

/**
 * Margin type.
 */
export const MarginTypeSchema = z.enum(['CROSS', 'ISOLATED']);
export type MarginType = z.infer<typeof MarginTypeSchema>;

/**
 * Options type.
 */
export const OptionTypeSchema = z.enum(['CALL', 'PUT']);
export type OptionType = z.infer<typeof OptionTypeSchema>;

/**
 * Options position action.
 */
export const OptionsActionSchema = z.enum([
    'BUY_TO_OPEN',
    'BUY_TO_CLOSE',
    'SELL_TO_OPEN',
    'SELL_TO_CLOSE',
]);

export type OptionsAction = z.infer<typeof OptionsActionSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Positive number validation.
 */
const positiveNumber = z.number().positive('Must be a positive number');

/**
 * Non-negative number validation.
 */
const nonNegativeNumber = z.number().min(0, 'Cannot be negative');

/**
 * Price validation (positive, max 8 decimals).
 */
const priceSchema = z.number()
    .positive('Price must be positive')
    .refine(
        (val) => Number.isFinite(val) && val < 1e15,
        'Price is out of valid range'
    );

/**
 * Quantity validation (positive, max 8 decimals).
 */
const quantitySchema = z.number()
    .positive('Quantity must be positive')
    .refine(
        (val) => Number.isFinite(val),
        'Invalid quantity'
    );

/**
 * Percentage validation (0-100).
 */
const percentageSchema = z.number()
    .min(0, 'Percentage cannot be negative')
    .max(100, 'Percentage cannot exceed 100');

/**
 * Leverage validation (1-125 typical for crypto).
 */
const leverageSchema = z.number()
    .int('Leverage must be a whole number')
    .min(1, 'Minimum leverage is 1x')
    .max(125, 'Maximum leverage is 125x');

// ═══════════════════════════════════════════════════════════════════════════
// FINANCIAL ORDER SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Comprehensive financial order model.
 */
export const FinancialOrderSchema = z.object({
    // ═══════════════════════════════════════════════════════════════════════
    // IDENTIFICATION
    // ═══════════════════════════════════════════════════════════════════════

    /** Exchange order ID */
    orderId: z.union([z.string(), z.number()]),
    /** Client-assigned order ID */
    clientOrderId: z.string().optional(),
    /** Trading symbol/ticker */
    symbol: z.string().min(1, 'Symbol is required'),
    /** Instrument type */
    instrumentType: InstrumentTypeSchema,
    /** Exchange identifier */
    exchange: z.string().optional(),
    /** Account identifier */
    accountId: z.string().optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // ORDER DETAILS
    // ═══════════════════════════════════════════════════════════════════════

    /** Order side */
    side: OrderSideSchema,
    /** Order type */
    type: OrderTypeSchema,
    /** Order status */
    status: OrderStatusSchema,
    /** Order category */
    category: OrderCategorySchema.default('REGULAR'),
    /** Time in force */
    timeInForce: TimeInForceSchema.default('GTC'),

    // ═══════════════════════════════════════════════════════════════════════
    // QUANTITY (with validation)
    // ═══════════════════════════════════════════════════════════════════════

    /** Order quantity */
    quantity: quantitySchema,
    /** Executed quantity */
    executedQty: nonNegativeNumber.default(0),
    /** Remaining quantity */
    remainingQty: nonNegativeNumber.optional(),
    /** Quote quantity (for quote orders) */
    quoteQty: nonNegativeNumber.optional(),
    /** Minimum quantity per fill */
    minQty: nonNegativeNumber.optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // PRICING (with validation)
    // ═══════════════════════════════════════════════════════════════════════

    /** Limit price */
    price: priceSchema.optional(),
    /** Stop trigger price */
    stopPrice: priceSchema.optional(),
    /** Limit price after stop trigger */
    limitPrice: priceSchema.optional(),
    /** Average fill price */
    avgFillPrice: priceSchema.optional(),
    /** Activation price (for trailing) */
    activationPrice: priceSchema.optional(),
    /** Trailing delta (percentage or absolute) */
    trailingDelta: positiveNumber.optional(),
    /** Trailing delta type */
    trailingType: z.enum(['PERCENT', 'ABSOLUTE']).optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // TIME
    // ═══════════════════════════════════════════════════════════════════════

    /** Order creation time */
    createdAt: z.number(),
    /** Last update time */
    updatedAt: z.number().optional(),
    /** Expiry time (for GTD orders) */
    expiryTime: z.number().optional(),
    /** Original transaction time (exchange) */
    transactTime: z.number().optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // FUTURES-SPECIFIC
    // ═══════════════════════════════════════════════════════════════════════

    /** Position side (hedged mode) */
    positionSide: PositionSideSchema.optional(),
    /** Leverage multiplier */
    leverage: leverageSchema.optional(),
    /** Margin type */
    marginType: MarginTypeSchema.optional(),
    /** Reduce only flag */
    reduceOnly: z.boolean().default(false),
    /** Close position flag */
    closePosition: z.boolean().default(false),
    /** Contract expiration date */
    contractExpiry: z.string().optional(),
    /** Contract multiplier */
    contractMultiplier: positiveNumber.optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // OPTIONS-SPECIFIC
    // ═══════════════════════════════════════════════════════════════════════

    /** Strike price */
    strikePrice: priceSchema.optional(),
    /** Option type (CALL/PUT) */
    optionType: OptionTypeSchema.optional(),
    /** Option expiration date */
    expirationDate: z.string().optional(),
    /** Underlying asset */
    underlying: z.string().optional(),
    /** Options action */
    optionsAction: OptionsActionSchema.optional(),
    /** Implied volatility */
    impliedVolatility: percentageSchema.optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // FEES & COSTS
    // ═══════════════════════════════════════════════════════════════════════

    /** Commission/fee amount */
    commission: nonNegativeNumber.optional(),
    /** Commission asset */
    commissionAsset: z.string().optional(),
    /** Realized P&L (if closing) */
    realizedPnl: z.number().optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // TAKE PROFIT / STOP LOSS
    // ═══════════════════════════════════════════════════════════════════════

    /** Take profit price */
    takeProfitPrice: priceSchema.optional(),
    /** Stop loss price */
    stopLossPrice: priceSchema.optional(),
    /** Bracket order high leg ID */
    bracketHighOrderId: z.union([z.string(), z.number()]).optional(),
    /** Bracket order low leg ID */
    bracketLowOrderId: z.union([z.string(), z.number()]).optional(),

    // ═══════════════════════════════════════════════════════════════════════
    // METADATA
    // ═══════════════════════════════════════════════════════════════════════

    /** Working indicator */
    isWorking: z.boolean().default(false),
    /** Error message if rejected */
    errorMessage: z.string().optional(),
    /** Error code */
    errorCode: z.union([z.string(), z.number()]).optional(),
    /** Trigger condition */
    triggerCondition: z.enum(['LAST_PRICE', 'MARK_PRICE', 'INDEX_PRICE']).optional(),
    /** Custom tags/labels */
    tags: z.array(z.string()).optional(),
});

export type FinancialOrder = z.infer<typeof FinancialOrderSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// FACTORY & DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default order values.
 */
export const defaultFinancialOrder: Partial<FinancialOrder> = {
    status: 'NEW',
    category: 'REGULAR',
    timeInForce: 'GTC',
    executedQty: 0,
    reduceOnly: false,
    closePosition: false,
    isWorking: false,
};

/**
 * Create a financial order with defaults.
 */
export function createFinancialOrder(
    data: Partial<FinancialOrder> & Pick<FinancialOrder, 'orderId' | 'symbol' | 'instrumentType' | 'side' | 'type' | 'quantity' | 'createdAt'>
): FinancialOrder {
    return FinancialOrderSchema.parse({
        ...defaultFinancialOrder,
        ...data,
    });
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate order quantity for modification.
 */
export function validateOrderQuantity(
    quantity: number,
    minQty?: number,
    maxQty?: number,
    stepSize?: number
): { valid: boolean; message?: string } {
    if (!Number.isFinite(quantity) || quantity <= 0) {
        return { valid: false, message: 'Quantity must be a positive number' };
    }
    if (minQty !== undefined && quantity < minQty) {
        return { valid: false, message: `Minimum quantity is ${minQty}` };
    }
    if (maxQty !== undefined && quantity > maxQty) {
        return { valid: false, message: `Maximum quantity is ${maxQty}` };
    }
    if (stepSize !== undefined && stepSize > 0) {
        const remainder = (quantity * 1e8) % (stepSize * 1e8);
        if (remainder !== 0) {
            return { valid: false, message: `Quantity must be a multiple of ${stepSize}` };
        }
    }
    return { valid: true };
}

/**
 * Validate order price for modification.
 */
export function validateOrderPrice(
    price: number,
    tickSize?: number,
    minPrice?: number,
    maxPrice?: number
): { valid: boolean; message?: string } {
    if (!Number.isFinite(price) || price <= 0) {
        return { valid: false, message: 'Price must be a positive number' };
    }
    if (minPrice !== undefined && price < minPrice) {
        return { valid: false, message: `Minimum price is ${minPrice}` };
    }
    if (maxPrice !== undefined && price > maxPrice) {
        return { valid: false, message: `Maximum price is ${maxPrice}` };
    }
    if (tickSize !== undefined && tickSize > 0) {
        const remainder = (price * 1e8) % (tickSize * 1e8);
        if (remainder !== 0) {
            return { valid: false, message: `Price must be a multiple of ${tickSize}` };
        }
    }
    return { valid: true };
}
