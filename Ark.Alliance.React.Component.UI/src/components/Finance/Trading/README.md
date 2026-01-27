# Finance/Trading Module

Financial trading grid components with comprehensive instrument support.

## Components

| Component | Description |
|-----------|-------------|
| **TradingGridCard** | Base card wrapper for trading grids |
| **PositionsGrid** | Open positions with close actions (Market/Limit) |
| **OrdersGrid** | Open orders with modify, cancel, batch selection |
| **TradeHistoryGrid** | Completed trades with P&L summary, pagination, export |

## Supported Instruments

- **Crypto**: Spot, Perpetuals, Futures, Options
- **Traditional**: Stocks, ETFs, Bonds, SICAV, Warrants
- **Derivatives**: Futures, Options, CFDs
- **Forex**: Currency pairs

## Common Models

All grids use shared financial models with Zod validation:

- `FinancialOrder` - Universal order model with all field types
- `FinancialPosition` - Position model with P&L, margin, Greeks
- `FinancialTrade` - Trade history with fee calculations

## Usage

```tsx
import { 
    PositionsGrid, 
    OrdersGrid, 
    TradeHistoryGrid,
    type FinancialPosition,
    type FinancialOrder,
} from '@/components/Finance/Trading';

// Positions Grid
<PositionsGrid
    positions={positions}
    onClosePosition={async (req) => {
        await api.closePosition(req);
    }}
/>

// Orders Grid
<OrdersGrid
    orders={orders}
    onModifyOrder={handleModify}
    onCancelOrder={handleCancel}
/>

// Trade History Grid
<TradeHistoryGrid
    trades={trades}
    onExport={handleExportCSV}
/>
```

## Validation

Editable fields include validation for:
- Quantity (positive, step size, min/max)
- Price (positive, tick size, min/max)
- Close position requests
- Modify order requests
