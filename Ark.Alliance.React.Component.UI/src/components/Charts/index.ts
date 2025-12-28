/**
 * @fileoverview Charts Barrel Export
 * @module components/Charts
 * 
 * Exports all chart components:
 * - TestChart: Base chart for test scenarios
 * - TrendPriceChart: Price chart with trend predictions
 * - FinancialChart: Complete financial chart with candlesticks
 * - primitives: Low-level chart rendering components
 */

// Base Chart
export * from './TestChart';

// Trend Price Chart
export * from './TrendPriceChart';

// Financial Chart (full-featured)
export * from './FinancialChart';

// Chart Primitives
export * from './primitives';
