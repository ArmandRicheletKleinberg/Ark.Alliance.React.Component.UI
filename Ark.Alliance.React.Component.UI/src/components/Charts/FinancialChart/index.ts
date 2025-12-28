/**
 * @fileoverview FinancialChart Barrel Export
 * @module components/Charts/FinancialChart
 * 
 * Exports all FinancialChart components, hooks, and types.
 */

// Main Component
export { FinancialChart } from './FinancialChart';
export type { FinancialChartProps } from './FinancialChart';

// Controls Component
export { FinancialChartControls, AVAILABLE_INTERVALS } from './FinancialChartControls';
export type {
    FinancialChartControlsProps,
    ChartStyleSettings,
    Interval,
} from './FinancialChartControls';

// ViewModel
export { useFinancialChart } from './FinancialChart.viewmodel';
export type {
    UseFinancialChartOptions,
    UseFinancialChartResult,
    MADataPoint,
    FinancialChartScale,
} from './FinancialChart.viewmodel';

// Model
export {
    FinancialChartModelSchema,
    ChartTypeSchema,
    FinancialThresholdSchema,
    MovingAverageSchema,
    defaultFinancialChartModel,
    createFinancialChartModel,
    FINANCIAL_CHART_COLORS,
} from './FinancialChart.model';
export type {
    FinancialChartModel,
    ChartType,
    FinancialThreshold,
    MovingAverageConfig,
} from './FinancialChart.model';
