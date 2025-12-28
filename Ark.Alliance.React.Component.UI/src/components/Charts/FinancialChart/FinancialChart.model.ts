/**
 * @fileoverview FinancialChart Component Model
 * @module components/Charts/FinancialChart
 * 
 * Extended model for financial price charts with candlesticks, styling, and controls.
 * Builds on TrendPriceChart model with additional features from Graph sample.
 */

import { z } from 'zod';
import { TrendPriceChartModelSchema } from '../TrendPriceChart/TrendPriceChart.model';
import { CandlestickDataPointSchema } from '../primitives/CandlestickRenderer.model';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Chart type enum
 */
export const ChartTypeSchema = z.enum(['line', 'candlestick', 'area']);

/**
 * Threshold line for horizontal price markers
 */
export const FinancialThresholdSchema = z.object({
    /** Unique identifier */
    id: z.string(),
    /** Price level */
    price: z.number(),
    /** Display label */
    label: z.string(),
    /** Line color */
    color: z.string().default('#f87171'),
    /** Line style */
    style: z.enum(['solid', 'dashed', 'dotted']).default('dashed'),
});

/**
 * Moving average configuration
 */
export const MovingAverageSchema = z.object({
    /** Whether to show this MA */
    enabled: z.boolean().default(false),
    /** Period in candles */
    period: z.number().min(2).max(200).default(7),
    /** Line color */
    color: z.string().default('#6366f1'),
    /** Line type */
    type: z.enum(['SMA', 'EMA']).default('SMA'),
});

/**
 * FinancialChart model schema
 * Extends TrendPriceChart with additional financial chart features
 */
export const FinancialChartModelSchema = TrendPriceChartModelSchema.extend({
    // ─────────────────────────────────────────────────────────────────────────
    // OHLCV DATA
    // ─────────────────────────────────────────────────────────────────────────

    /** Candlestick OHLCV data */
    candlestickData: z.array(CandlestickDataPointSchema).default([]),

    /** Chart rendering type */
    chartType: ChartTypeSchema.default('candlestick'),

    // ─────────────────────────────────────────────────────────────────────────
    // THRESHOLDS
    // ─────────────────────────────────────────────────────────────────────────

    /** Custom threshold lines */
    thresholdLines: z.array(FinancialThresholdSchema).default([]),

    // ─────────────────────────────────────────────────────────────────────────
    // MOVING AVERAGES
    // ─────────────────────────────────────────────────────────────────────────

    /** Fast moving average configuration */
    fastMA: MovingAverageSchema.default({ enabled: true, period: 7, color: '#22c55e' }),

    /** Slow moving average configuration */
    slowMA: MovingAverageSchema.default({ enabled: true, period: 25, color: '#ef4444' }),

    // ─────────────────────────────────────────────────────────────────────────
    // STYLING (from Graph sample)
    // ─────────────────────────────────────────────────────────────────────────

    /** Header title displayed on chart */
    headerTitle: z.string().default(''),

    /** Border color */
    borderColor: z.string().default('#475569'),

    /** Border width in pixels */
    borderWidth: z.number().min(0).max(10).default(1),

    /** Border radius in pixels */
    borderRadius: z.number().min(0).max(50).default(12),

    /** Box shadow intensity (0-50) */
    boxShadowIntensity: z.number().min(0).max(50).default(10),

    /** Background image URL or data URI */
    backgroundImage: z.string().nullable().default(null),

    /** Background image opacity (0-100) */
    bgImageOpacity: z.number().min(0).max(100).default(20),

    /** Background image zoom factor */
    bgImageZoom: z.number().min(0.5).max(3).default(1),

    /** Use logarithmic Y-axis scale */
    useLogScale: z.boolean().default(false),

    // ─────────────────────────────────────────────────────────────────────────
    // CONNECTION STATE
    // ─────────────────────────────────────────────────────────────────────────

    /** Whether WebSocket is connected */
    isConnected: z.boolean().default(false),

    /** Whether historical data is loading */
    isLoadingHistory: z.boolean().default(false),

    // ─────────────────────────────────────────────────────────────────────────
    // DATA BUFFER
    // ─────────────────────────────────────────────────────────────────────────

    /** Maximum candles to display */
    maxCandles: z.number().min(10).max(500).default(180),

    /** Current interval (1s, 1m, 15m, 1h, 4h) */
    interval: z.string().default('1m'),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type ChartType = z.infer<typeof ChartTypeSchema>;
export type FinancialThreshold = z.infer<typeof FinancialThresholdSchema>;
export type MovingAverageConfig = z.infer<typeof MovingAverageSchema>;
export type FinancialChartModel = z.infer<typeof FinancialChartModelSchema>;

/**
 * Default model values
 */
export const defaultFinancialChartModel: FinancialChartModel = FinancialChartModelSchema.parse({});

/**
 * Factory function to create FinancialChart model
 * @param data - Partial model data
 * @returns Validated FinancialChartModel
 */
export function createFinancialChartModel(data: Partial<FinancialChartModel> = {}): FinancialChartModel {
    return FinancialChartModelSchema.parse(data);
}

// ═══════════════════════════════════════════════════════════════════════════
// CHART COLORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default chart color palette
 */
export const FINANCIAL_CHART_COLORS = {
    /** Price line color */
    priceLine: '#6366f1',
    /** Price area fill gradient start */
    areaFillStart: 'rgba(99, 102, 241, 0.3)',
    /** Price area fill gradient end */
    areaFillEnd: 'rgba(99, 102, 241, 0.05)',
    /** Bullish candle color */
    bullish: '#22c55e',
    /** Bearish candle color */
    bearish: '#ef4444',
    /** Grid line color */
    grid: '#1e293b',
    /** Axis text color */
    axis: '#64748b',
    /** Current price line */
    currentPrice: '#ffffff',
} as const;
