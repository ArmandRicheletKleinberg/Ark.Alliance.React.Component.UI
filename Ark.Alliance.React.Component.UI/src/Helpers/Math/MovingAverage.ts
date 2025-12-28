/**
 * @fileoverview Moving Average Calculations
 * @module Helpers/Math/MovingAverage
 * 
 * Mathematical functions for calculating various moving averages.
 * These are pure functions with no side effects or dependencies on UI/state.
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Data point with time and close price for MA calculation
 */
export interface PriceDataPoint {
    time: number;
    close: number;
}

/**
 * Result of moving average calculation
 */
export interface MADataPoint {
    time: number;
    value: number;
}

/**
 * Moving average type
 */
export type MAType = 'SMA' | 'EMA';

// ═══════════════════════════════════════════════════════════════════════════
// SIMPLE MOVING AVERAGE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate Simple Moving Average (SMA)
 * 
 * SMA = sum of closing prices over n periods / n
 * 
 * @param data - Array of price data points with time and close values
 * @param period - Number of periods for the moving average
 * @returns Array of MA data points with time and computed value
 * 
 * @example
 * ```ts
 * const prices = [{ time: 1, close: 100 }, { time: 2, close: 102 }, { time: 3, close: 101 }];
 * const sma = calculateSMA(prices, 2);
 * // Returns: [{ time: 2, value: 101 }, { time: 3, value: 101.5 }]
 * ```
 */
export function calculateSMA(data: PriceDataPoint[], period: number): MADataPoint[] {
    if (data.length < period || period < 1) {
        return [];
    }

    const result: MADataPoint[] = [];

    for (let i = period - 1; i < data.length; i++) {
        const slice = data.slice(i - period + 1, i + 1);
        const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
        result.push({
            time: data[i].time,
            value: sum / period,
        });
    }

    return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPONENTIAL MOVING AVERAGE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate Exponential Moving Average (EMA)
 * 
 * EMA = (Price(t) × k) + (EMA(t-1) × (1 – k))
 * where k = 2 / (period + 1) is the smoothing factor
 * 
 * @param data - Array of price data points with time and close values
 * @param period - Number of periods for the moving average
 * @returns Array of MA data points with time and computed value
 * 
 * @example
 * ```ts
 * const prices = [{ time: 1, close: 100 }, { time: 2, close: 102 }, { time: 3, close: 101 }];
 * const ema = calculateEMA(prices, 2);
 * // Returns EMA values starting from the period-th element
 * ```
 */
export function calculateEMA(data: PriceDataPoint[], period: number): MADataPoint[] {
    if (data.length < period || period < 1) {
        return [];
    }

    const multiplier = 2 / (period + 1);
    const result: MADataPoint[] = [];

    // Start with SMA for the first EMA value
    const initialSlice = data.slice(0, period);
    let ema = initialSlice.reduce((acc, curr) => acc + curr.close, 0) / period;
    result.push({ time: data[period - 1].time, value: ema });

    // Calculate EMA for remaining data points
    for (let i = period; i < data.length; i++) {
        ema = (data[i].close - ema) * multiplier + ema;
        result.push({ time: data[i].time, value: ema });
    }

    return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate moving average based on type
 * 
 * @param data - Array of price data points
 * @param period - Number of periods
 * @param type - Type of moving average ('SMA' or 'EMA')
 * @returns Array of MA data points
 */
export function calculateMA(data: PriceDataPoint[], period: number, type: MAType = 'SMA'): MADataPoint[] {
    return type === 'EMA' ? calculateEMA(data, period) : calculateSMA(data, period);
}

/**
 * Detect crossover between two moving averages
 * 
 * @param fastMA - Fast moving average data points
 * @param slowMA - Slow moving average data points
 * @returns 'BULLISH' if fast crosses above slow, 'BEARISH' if fast crosses below slow, null otherwise
 */
export function detectMACrossover(
    fastMA: MADataPoint[],
    slowMA: MADataPoint[]
): 'BULLISH' | 'BEARISH' | null {
    if (fastMA.length < 2 || slowMA.length < 2) {
        return null;
    }

    const currFast = fastMA[fastMA.length - 1].value;
    const currSlow = slowMA[slowMA.length - 1].value;
    const prevFast = fastMA[fastMA.length - 2].value;
    const prevSlow = slowMA[slowMA.length - 2].value;

    // Bullish crossover: fast crosses above slow
    if (prevFast <= prevSlow && currFast > currSlow) {
        return 'BULLISH';
    }

    // Bearish crossover: fast crosses below slow
    if (prevFast >= prevSlow && currFast < currSlow) {
        return 'BEARISH';
    }

    return null;
}
