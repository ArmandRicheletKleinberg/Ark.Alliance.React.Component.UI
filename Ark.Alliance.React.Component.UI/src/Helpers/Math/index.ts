/**
 * @fileoverview Math Helpers Barrel Export
 * @module Helpers/Math
 * 
 * Exports all mathematical utility functions.
 * These are pure functions used by chart components for calculations.
 */

// Moving Average Calculations
export {
    calculateSMA,
    calculateEMA,
    calculateMA,
    detectMACrossover,
} from './MovingAverage';
export type {
    PriceDataPoint,
    MADataPoint,
    MAType,
} from './MovingAverage';

// Scale and Coordinate Calculations
export {
    calculateChartScale,
    extendScaleForPrices,
    createCoordinateTransform,
    timeToX,
    priceToY,
    generateLinePath,
    generateAreaPath,
} from './ScaleCalculations';
export type {
    OHLCDataPoint,
    AxisScale,
    ChartScale,
    Point,
} from './ScaleCalculations';
