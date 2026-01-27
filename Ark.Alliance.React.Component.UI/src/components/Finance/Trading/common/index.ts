/**
 * @fileoverview Common Trading Models Barrel Export
 * @module components/Finance/Trading/common
 */

// Instrument Types
export {
    InstrumentTypeSchema,
    InstrumentCategorySchema,
    QuoteCurrencySchema,
    getInstrumentCategory,
    getInstrumentFeatures,
    type InstrumentType,
    type InstrumentCategory,
    type InstrumentFeatures,
    type QuoteCurrency,
} from './InstrumentType.model';

// Financial Order
export {
    // Schemas
    OrderTypeSchema,
    OrderStatusSchema,
    OrderSideSchema,
    PositionSideSchema,
    OrderCategorySchema,
    TimeInForceSchema,
    MarginTypeSchema,
    OptionTypeSchema,
    OptionsActionSchema,
    FinancialOrderSchema,

    // Types
    type OrderType,
    type OrderStatus,
    type OrderSide,
    type PositionSide,
    type OrderCategory,
    type TimeInForce,
    type MarginType,
    type OptionType,
    type OptionsAction,
    type FinancialOrder,

    // Utilities
    defaultFinancialOrder,
    createFinancialOrder,
    validateOrderQuantity,
    validateOrderPrice,
} from './FinancialOrder.model';

// Financial Position
export {
    FinancialPositionSchema,
    type FinancialPosition,
    createFinancialPosition,
    calculateROE,
    calculateUnrealizedPnl,
    validatePositionQuantity,
} from './FinancialPosition.model';

// Financial Trade
export {
    TradeRoleSchema,
    FinancialTradeSchema,
    type TradeRole,
    type FinancialTrade,
    createFinancialTrade,
    calculateNetProfit,
    calculateTotalPnl,
} from './FinancialTrade.model';
