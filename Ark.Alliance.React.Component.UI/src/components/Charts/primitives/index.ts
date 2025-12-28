/**
 * @fileoverview Chart Primitives Barrel Export
 * @module components/Charts/primitives
 * 
 * Exports all chart primitive components:
 * - CandlestickRenderer: OHLCV candlestick chart
 * - ConnectionIndicator: WebSocket status indicator
 */

// CandlestickRenderer
export { CandlestickRenderer } from './CandlestickRenderer';
export type { CandlestickRendererProps } from './CandlestickRenderer';
export { useCandlestickRenderer } from './CandlestickRenderer.viewmodel';
export type {
    UseCandlestickRendererOptions,
    UseCandlestickRendererResult,
    CandlestickScale,
    ComputedCandle,
} from './CandlestickRenderer.viewmodel';
export {
    CandlestickDataPointSchema,
    CandlestickColorsSchema,
    CandlestickRendererModelSchema,
    defaultCandlestickRendererModel,
    createCandlestickRendererModel,
} from './CandlestickRenderer.model';
export type {
    CandlestickDataPoint,
    CandlestickColors,
    CandlestickRendererModel,
} from './CandlestickRenderer.model';

// ConnectionIndicator
export { ConnectionIndicator } from './ConnectionIndicator';
export type { ConnectionIndicatorProps, ConnectionStatus } from './ConnectionIndicator';
