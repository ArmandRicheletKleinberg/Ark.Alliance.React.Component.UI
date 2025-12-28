/**
 * @fileoverview TrendPriceChart Barrel Export
 * @module components/Charts/TrendPriceChart
 */

export { TrendPriceChart, type TrendPriceChartProps } from './TrendPriceChart';
export { useTrendPriceChart, type UseTrendPriceChartOptions, type UseTrendPriceChartResult } from './TrendPriceChart.viewmodel';
export {
    TrendPriceChartModelSchema,
    RealTimePricePointSchema,
    TrendPredictionSchema,
    PredictionDirectionSchema,
    TREND_DIRECTION_COLORS,
    defaultTrendPriceChartModel,
    createTrendPriceChartModel,
    type TrendPriceChartModel,
    type RealTimePricePoint,
    type TrendPrediction,
    type PredictionDirection,
} from './TrendPriceChart.model';
