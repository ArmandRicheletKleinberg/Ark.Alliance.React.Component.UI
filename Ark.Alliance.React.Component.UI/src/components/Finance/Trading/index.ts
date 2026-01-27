/**
 * @fileoverview Finance/Trading Module Barrel Export
 * @module components/Finance/Trading
 * 
 * Financial trading grid components with comprehensive instrument support.
 * 
 * ## Structure
 * 
 * ```
 * Trading/
 * ├── common/           - Shared models (FinancialOrder, Position, Trade)
 * ├── TradingGridCard/  - Base trading card wrapper
 * ├── PositionsGrid/    - Open positions display
 * ├── OrdersGrid/       - Open orders with modify/cancel
 * └── TradeHistoryGrid/ - Completed trades with summary
 * ```
 * 
 * ## Features
 * 
 * - Supports all instrument types (futures, options, spot, stocks, bonds)
 * - Comprehensive Zod validation on editable fields
 * - MVVM architecture (Model, ViewModel, View)
 * - Dark/light theme support
 * 
 * @example
 * ```tsx
 * import { PositionsGrid, OrdersGrid, TradeHistoryGrid } from '@ark/components/Finance/Trading';
 * 
 * <PositionsGrid
 *     positions={positions}
 *     onClosePosition={handleClose}
 * />
 * ```
 */

// ═══════════════════════════════════════════════════════════════════════════
// COMMON MODELS
// ═══════════════════════════════════════════════════════════════════════════

export * from './common';

// ═══════════════════════════════════════════════════════════════════════════
// TRADING GRID CARD
// ═══════════════════════════════════════════════════════════════════════════

export {
    TradingGridCard,
    TradingGridCardModelSchema,
    useTradingGridCard,
    createTradingGridCardModel,
    type TradingGridCardModel,
    type TradingGridCardProps,
    type GridCardStatus,
} from './TradingGridCard';

// ═══════════════════════════════════════════════════════════════════════════
// POSITIONS GRID
// ═══════════════════════════════════════════════════════════════════════════

export {
    PositionsGrid,
    PositionsGridModelSchema,
    usePositionsGrid,
    createPositionsGridModel,
    getDefaultColumnsForInstrument,
    validateClosePositionRequest,
    defaultFuturesColumns,
    defaultOptionsColumns,
    defaultSpotColumns,
    type PositionsGridModel,
    type PositionsGridProps,
    type PositionColumnKey,
    type PositionColumnConfig,
    type ClosePositionRequest,
} from './PositionsGrid';

// ═══════════════════════════════════════════════════════════════════════════
// ORDERS GRID
// ═══════════════════════════════════════════════════════════════════════════

export {
    OrdersGrid,
    OrdersGridModelSchema,
    useOrdersGrid,
    createOrdersGridModel,
    validateModifyOrderRequest,
    defaultOrderColumns,
    type OrdersGridModel,
    type OrdersGridProps,
    type OrderColumnKey,
    type OrderColumnConfig,
    type ModifyOrderRequest,
    type CancelOrderRequest,
} from './OrdersGrid';

// ═══════════════════════════════════════════════════════════════════════════
// TRADE HISTORY GRID
// ═══════════════════════════════════════════════════════════════════════════

export {
    TradeHistoryGrid,
    TradeHistoryGridModelSchema,
    useTradeHistoryGrid,
    createTradeHistoryGridModel,
    defaultTradeColumns,
    type TradeHistoryGridModel,
    type TradeHistoryGridProps,
    type TradeColumnKey,
    type TradeColumnConfig,
    type DateRange,
    type DateRangePreset,
} from './TradeHistoryGrid';
