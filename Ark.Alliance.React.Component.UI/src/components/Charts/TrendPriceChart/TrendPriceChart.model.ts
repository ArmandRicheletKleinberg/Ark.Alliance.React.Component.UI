/**
 * @fileoverview TrendPriceChart Component Model
 * @module components/Charts/TrendPriceChart
 * 
 * Model definitions for real-time price chart with trend prediction overlays.
 * Extends TestChart functionality for trading dashboard use cases.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Real-time price point with required timestamp
 */
export const RealTimePricePointSchema = z.object({
    /** Index in series */
    index: z.number(),
    /** Price value */
    price: z.number(),
    /** Unix timestamp (required for real-time) */
    timestamp: z.number(),
    /** Optional volume data */
    volume: z.number().optional(),
});

/**
 * Prediction direction enum (LONG, SHORT, WAIT)
 */
export const PredictionDirectionSchema = z.enum(['LONG', 'SHORT', 'WAIT']);

/**
 * Trend prediction overlay schema
 * Represents a prediction made at a specific point in time
 */
export const TrendPredictionSchema = z.object({
    /** Unique identifier */
    id: z.string(),
    /** Unix timestamp when prediction was made */
    timestamp: z.number(),
    /** Price at the time of prediction */
    priceAtPrediction: z.number(),
    /** Predicted direction */
    direction: PredictionDirectionSchema,
    /** Composite score from -1 to +1 */
    compositeScore: z.number().min(-1).max(1),
    /** Confidence level from 0 to 1 */
    confidence: z.number().min(0).max(1),

    // Validation state (filled after forecast horizon)
    /** Whether validation has completed */
    isValidated: z.boolean().default(false),
    /** Price at validation time */
    priceAtValidation: z.number().optional(),
    /** Actual direction observed */
    actualDirection: PredictionDirectionSchema.optional(),
    /** Whether prediction was correct */
    isCorrect: z.boolean().optional(),

    // Visual options
    /** Show forecast horizon shading */
    showHorizon: z.boolean().default(true),
    /** Forecast horizon in milliseconds */
    horizonMs: z.number().default(60000),
});

/**
 * TrendPriceChart model schema
 */
export const TrendPriceChartModelSchema = extendSchema({
    // Symbol selection
    /** Trading symbol (e.g., BTCUSDT) */
    symbol: z.string().default(''),
    /** Time precision for data points */
    precision: z.enum(['1s', '1m', '15m']).default('1s'),

    // Real-time data
    /** Price data points */
    priceData: z.array(RealTimePricePointSchema).default([]),
    /** Maximum data points to display */
    maxDataPoints: z.number().min(10).max(500).default(100),

    // Trend overlays
    /** Trend predictions to display */
    predictions: z.array(TrendPredictionSchema).default([]),

    // Display options
    /** Show grid lines */
    showGrid: z.boolean().default(true),
    /** Show volume bars */
    showVolume: z.boolean().default(false),
    /** Show forecast horizon shading */
    showForecastHorizon: z.boolean().default(true),
    /** Animate new points */
    animateNewPoints: z.boolean().default(true),
    /** Show legend */
    showLegend: z.boolean().default(true),

    // Axes
    /** Auto-scale Y-axis */
    autoScaleY: z.boolean().default(true),
    /** Y-axis padding percentage */
    yAxisPadding: z.number().min(0).max(0.5).default(0.05),

    // Streaming
    /** Whether streaming is active */
    isStreaming: z.boolean().default(false),

    // Chart dimensions
    /** Chart height in pixels */
    height: z.number().default(300),
    /** Chart title */
    title: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type RealTimePricePoint = z.infer<typeof RealTimePricePointSchema>;
export type PredictionDirection = z.infer<typeof PredictionDirectionSchema>;
export type TrendPrediction = z.infer<typeof TrendPredictionSchema>;
export type TrendPriceChartModel = z.infer<typeof TrendPriceChartModelSchema>;

/**
 * Default model values
 */
export const defaultTrendPriceChartModel: TrendPriceChartModel = TrendPriceChartModelSchema.parse({});

/**
 * Factory function to create TrendPriceChart model
 * @param data - Partial model data
 * @returns Validated TrendPriceChartModel
 */
export function createTrendPriceChartModel(data: Partial<TrendPriceChartModel> = {}): TrendPriceChartModel {
    return TrendPriceChartModelSchema.parse(data);
}

// ═══════════════════════════════════════════════════════════════════════════
// DIRECTION COLORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Color configuration for trend directions
 */
export const TREND_DIRECTION_COLORS = {
    LONG: {
        primary: '#22c55e',
        glow: 'rgba(34, 197, 94, 0.5)',
        background: 'rgba(34, 197, 94, 0.1)',
    },
    SHORT: {
        primary: '#ef4444',
        glow: 'rgba(239, 68, 68, 0.5)',
        background: 'rgba(239, 68, 68, 0.1)',
    },
    WAIT: {
        primary: '#eab308',
        glow: 'rgba(234, 179, 8, 0.5)',
        background: 'rgba(234, 179, 8, 0.1)',
    },
} as const;
