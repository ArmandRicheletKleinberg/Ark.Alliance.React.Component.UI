/**
 * @fileoverview CandlestickRenderer Model
 * @module components/Charts/primitives/CandlestickRenderer
 * 
 * Schema definitions for OHLCV candlestick data points and renderer configuration.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * OHLCV candlestick data point schema
 */
export const CandlestickDataPointSchema = z.object({
    /** Unix timestamp (milliseconds) */
    time: z.number(),
    /** Opening price */
    open: z.number(),
    /** Highest price */
    high: z.number(),
    /** Lowest price */
    low: z.number(),
    /** Closing price */
    close: z.number(),
    /** Trading volume (optional) */
    volume: z.number().optional(),
});

/**
 * Candlestick color configuration schema
 */
export const CandlestickColorsSchema = z.object({
    /** Bullish candle body color (close > open) */
    bullish: z.string().default('#22c55e'),
    /** Bearish candle body color (close < open) */
    bearish: z.string().default('#ef4444'),
    /** Doji candle color (close == open) */
    doji: z.string().default('#94a3b8'),
    /** Wick/shadow line color */
    wick: z.string().default('#64748b'),
});

/**
 * CandlestickRenderer model schema
 */
export const CandlestickRendererModelSchema = extendSchema({
    /** Array of candlestick data points */
    data: z.array(CandlestickDataPointSchema).default([]),

    /** Color configuration */
    colors: CandlestickColorsSchema.default({}),

    /** Width of each candle body in pixels */
    candleWidth: z.number().min(1).max(50).default(8),

    /** Gap between candles in pixels */
    candleGap: z.number().min(0).max(20).default(2),

    /** Whether to show volume bars */
    showVolume: z.boolean().default(false),

    /** Volume bar height as percentage of chart height */
    volumeHeightPercent: z.number().min(0).max(50).default(20),

    /** Whether to show wick/shadow lines */
    showWicks: z.boolean().default(true),

    /** Wick line width in pixels */
    wickWidth: z.number().min(0.5).max(3).default(1),

    /** Chart height in pixels */
    height: z.number().default(300),

    /** Chart width in pixels */
    width: z.number().default(600),

    /** Padding around chart area */
    padding: z.number().default(40),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type CandlestickDataPoint = z.infer<typeof CandlestickDataPointSchema>;
export type CandlestickColors = z.infer<typeof CandlestickColorsSchema>;
export type CandlestickRendererModel = z.infer<typeof CandlestickRendererModelSchema>;

/**
 * Default model values
 */
export const defaultCandlestickRendererModel: CandlestickRendererModel = CandlestickRendererModelSchema.parse({});

/**
 * Factory function to create CandlestickRenderer model
 * @param data - Partial model data
 * @returns Validated CandlestickRendererModel
 */
export function createCandlestickRendererModel(data: Partial<CandlestickRendererModel> = {}): CandlestickRendererModel {
    return CandlestickRendererModelSchema.parse(data);
}
