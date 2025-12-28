/**
 * @fileoverview Scale Calculations
 * @module Helpers/Math/ScaleCalculations
 * 
 * Mathematical functions for calculating chart scales and coordinate transformations.
 * These are pure functions with no side effects or dependencies on UI/state.
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Data point with OHLC values for scale calculation
 */
export interface OHLCDataPoint {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

/**
 * Scale configuration for a chart axis
 */
export interface AxisScale {
    min: number;
    max: number;
    range: number;
}

/**
 * Complete chart scale with X (time) and Y (price) axes
 */
export interface ChartScale {
    x: AxisScale;
    y: AxisScale;
}

/**
 * SVG coordinate point
 */
export interface Point {
    x: number;
    y: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// SCALE CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate chart scale from OHLC data
 * 
 * @param data - Array of OHLC data points
 * @param paddingPercent - Percentage padding to add to Y axis (default: 5%)
 * @returns Chart scale with X and Y axis configurations
 * 
 * @example
 * ```ts
 * const data = [{ time: 1, open: 100, high: 105, low: 98, close: 103 }];
 * const scale = calculateChartScale(data, 0.05);
 * // Returns: { x: { min: 1, max: 1, range: 1 }, y: { min: 97.65, max: 105.35, range: 7.7 } }
 * ```
 */
export function calculateChartScale(
    data: OHLCDataPoint[],
    paddingPercent = 0.05
): ChartScale {
    if (data.length === 0) {
        return {
            x: { min: 0, max: 1, range: 1 },
            y: { min: 0, max: 1, range: 1 },
        };
    }

    const times = data.map(d => d.time);
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);

    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    let minPrice = Math.min(...lows);
    let maxPrice = Math.max(...highs);

    // Add padding to price range
    const pricePad = (maxPrice - minPrice) * paddingPercent;
    minPrice -= pricePad;
    maxPrice += pricePad;

    return {
        x: {
            min: minTime,
            max: maxTime,
            range: Math.max(maxTime - minTime, 1),
        },
        y: {
            min: minPrice,
            max: maxPrice,
            range: Math.max(maxPrice - minPrice, 1),
        },
    };
}

/**
 * Extend Y axis scale to include additional price values (e.g., thresholds)
 * 
 * @param scale - Current chart scale
 * @param additionalPrices - Additional price values to include in the Y axis
 * @param paddingPercent - Percentage padding to add (default: 5%)
 * @returns Updated chart scale
 */
export function extendScaleForPrices(
    scale: ChartScale,
    additionalPrices: number[],
    paddingPercent = 0.05
): ChartScale {
    if (additionalPrices.length === 0) {
        return scale;
    }

    let minY = scale.y.min;
    let maxY = scale.y.max;

    for (const price of additionalPrices) {
        minY = Math.min(minY, price);
        maxY = Math.max(maxY, price);
    }

    // Add padding
    const range = maxY - minY;
    const pad = range * paddingPercent;

    return {
        ...scale,
        y: {
            min: minY - pad,
            max: maxY + pad,
            range: range + pad * 2,
        },
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// COORDINATE TRANSFORMATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a function to convert data coordinates to SVG coordinates
 * 
 * @param scale - Chart scale configuration
 * @param svgWidth - SVG viewport width
 * @param svgHeight - SVG viewport height
 * @param padding - Chart padding from SVG edges
 * @returns Function that converts (time, price) to SVG (x, y) coordinates
 */
export function createCoordinateTransform(
    scale: ChartScale,
    svgWidth: number,
    svgHeight: number,
    padding: number
): (time: number, price: number) => Point {
    const chartWidth = svgWidth - padding * 2;
    const chartHeight = svgHeight - padding * 2;

    return (time: number, price: number): Point => {
        const x = padding + ((time - scale.x.min) / scale.x.range) * chartWidth;
        const y = padding + chartHeight - ((price - scale.y.min) / scale.y.range) * chartHeight;
        return { x, y };
    };
}

/**
 * Convert time value to X coordinate
 * 
 * @param time - Time value
 * @param scale - Chart scale
 * @param chartWidth - Available chart width (excluding padding)
 * @param padding - Left padding
 * @returns X coordinate
 */
export function timeToX(
    time: number,
    scale: ChartScale,
    chartWidth: number,
    padding: number
): number {
    return padding + ((time - scale.x.min) / scale.x.range) * chartWidth;
}

/**
 * Convert price value to Y coordinate
 * 
 * @param price - Price value
 * @param scale - Chart scale
 * @param chartHeight - Available chart height (excluding padding)
 * @param padding - Top padding
 * @returns Y coordinate (inverted for SVG coordinate system)
 */
export function priceToY(
    price: number,
    scale: ChartScale,
    chartHeight: number,
    padding: number
): number {
    return padding + chartHeight - ((price - scale.y.min) / scale.y.range) * chartHeight;
}

// ═══════════════════════════════════════════════════════════════════════════
// SVG PATH GENERATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate SVG path string for line chart from data points
 * 
 * @param data - Array of data points with time and value
 * @param toPoint - Function to convert data to SVG coordinates
 * @returns SVG path string (M x y L x y L x y ...)
 */
export function generateLinePath(
    data: Array<{ time: number; value: number }>,
    toPoint: (time: number, price: number) => Point
): string {
    if (data.length === 0) return '';

    return data
        .map((d, i) => {
            const { x, y } = toPoint(d.time, d.value);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');
}

/**
 * Generate SVG path string for area chart (closed path)
 * 
 * @param linePath - Existing line path string
 * @param startX - X coordinate of first point
 * @param endX - X coordinate of last point
 * @param baselineY - Y coordinate for the baseline (bottom of area)
 * @returns SVG path string for closed area
 */
export function generateAreaPath(
    linePath: string,
    startX: number,
    endX: number,
    baselineY: number
): string {
    if (!linePath) return '';
    return `${linePath} L ${endX} ${baselineY} L ${startX} ${baselineY} Z`;
}
