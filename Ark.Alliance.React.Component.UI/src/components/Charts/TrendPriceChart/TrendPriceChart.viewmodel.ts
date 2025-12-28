/**
 * @fileoverview TrendPriceChart Component ViewModel
 * @module components/Charts/TrendPriceChart
 * 
 * ViewModel hook for TrendPriceChart with real-time data management,
 * prediction overlays, and SVG coordinate calculations.
 */

import { useMemo, useCallback, useState } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type {
    TrendPriceChartModel,
    RealTimePricePoint,
    TrendPrediction,
    PredictionDirection,
} from './TrendPriceChart.model';
import {
    defaultTrendPriceChartModel,
    TrendPriceChartModelSchema,
    TREND_DIRECTION_COLORS,
} from './TrendPriceChart.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Options for useTrendPriceChart hook
 */
export interface UseTrendPriceChartOptions extends Partial<TrendPriceChartModel> {
    /** Callback when prediction is clicked */
    onPredictionClick?: (prediction: TrendPrediction) => void;
}

/**
 * Chart scale configuration
 */
export interface ChartScale {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    xRange: number;
    yRange: number;
}

/**
 * Prediction badge data for SVG rendering
 */
export interface PredictionBadgeData {
    id: string;
    x: number;
    y: number;
    direction: PredictionDirection;
    isValidated: boolean;
    isCorrect?: boolean;
    prediction: TrendPrediction;
}

/**
 * Horizon area data for shaded regions
 */
export interface HorizonAreaData {
    predictionId: string;
    startX: number;
    endX: number;
    color: string;
    opacity: number;
}

/**
 * ViewModel result interface
 */
export interface UseTrendPriceChartResult extends BaseViewModelResult<TrendPriceChartModel> {
    // Data
    priceData: RealTimePricePoint[];
    predictions: TrendPrediction[];
    scale: ChartScale;

    // Computed SVG elements
    pricePath: string;
    predictionBadges: PredictionBadgeData[];
    horizonAreas: HorizonAreaData[];

    // CSS classes
    chartClasses: string;

    // Data management methods
    addPricePoint: (point: RealTimePricePoint) => void;
    addPrediction: (prediction: TrendPrediction) => void;
    validatePrediction: (id: string, validation: { priceAtValidation: number; actualDirection: PredictionDirection; isCorrect: boolean }) => void;
    clearData: () => void;

    // Coordinate conversion
    toSvgPoint: (timestamp: number, price: number) => { x: number; y: number };

    // Streaming control
    setStreaming: (isStreaming: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const CHART_PADDING = 40;
const DEFAULT_WIDTH = 600;

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TrendPriceChart ViewModel Hook
 * 
 * Manages real-time price data, trend predictions, and SVG rendering calculations.
 * 
 * @param options - Chart configuration options
 * @returns ViewModel result with data and methods
 */
export function useTrendPriceChart(options: UseTrendPriceChartOptions = {}): UseTrendPriceChartResult {
    const { onPredictionClick, ...modelOptions } = options;

    // Parse and validate model
    const modelData = useMemo(() => {
        return TrendPriceChartModelSchema.parse({ ...defaultTrendPriceChartModel, ...modelOptions });
    }, [
        modelOptions.symbol,
        modelOptions.precision,
        modelOptions.maxDataPoints,
        modelOptions.showGrid,
        modelOptions.showVolume,
        modelOptions.showForecastHorizon,
        modelOptions.animateNewPoints,
        modelOptions.showLegend,
        modelOptions.autoScaleY,
        modelOptions.yAxisPadding,
        modelOptions.isStreaming,
        modelOptions.height,
        modelOptions.title,
    ]);

    const base = useBaseViewModel<TrendPriceChartModel>(modelData, {
        model: modelData,
        eventChannel: 'trend-price-chart',
    });

    // Local state for real-time data (not in model to avoid re-parsing)
    const [priceData, setPriceData] = useState<RealTimePricePoint[]>(modelData.priceData);
    const [predictions, setPredictions] = useState<TrendPrediction[]>(modelData.predictions);

    // Calculate scale from price data
    const scale = useMemo<ChartScale>(() => {
        if (priceData.length === 0) {
            return { minX: 0, maxX: 1, minY: 0, maxY: 1, xRange: 1, yRange: 1 };
        }

        const timestamps = priceData.map(p => p.timestamp);
        const prices = priceData.map(p => p.price);

        let minX = Math.min(...timestamps);
        let maxX = Math.max(...timestamps);
        let minY = Math.min(...prices);
        let maxY = Math.max(...prices);

        // Include prediction prices in Y range
        for (const pred of predictions) {
            minY = Math.min(minY, pred.priceAtPrediction);
            maxY = Math.max(maxY, pred.priceAtPrediction);
            if (pred.priceAtValidation !== undefined) {
                minY = Math.min(minY, pred.priceAtValidation);
                maxY = Math.max(maxY, pred.priceAtValidation);
            }
        }

        // Add padding
        const yPad = (maxY - minY) * base.model.yAxisPadding;
        minY -= yPad;
        maxY += yPad;

        return {
            minX,
            maxX,
            minY,
            maxY,
            xRange: Math.max(maxX - minX, 1),
            yRange: Math.max(maxY - minY, 1),
        };
    }, [priceData, predictions, base.model.yAxisPadding]);

    // Convert timestamp/price to SVG coordinates
    const toSvgPoint = useCallback((timestamp: number, price: number) => {
        const chartWidth = DEFAULT_WIDTH - CHART_PADDING * 2;
        const chartHeight = base.model.height - CHART_PADDING * 2;

        const x = CHART_PADDING + ((timestamp - scale.minX) / scale.xRange) * chartWidth;
        const y = CHART_PADDING + chartHeight - ((price - scale.minY) / scale.yRange) * chartHeight;

        return { x, y };
    }, [scale, base.model.height]);

    // Generate SVG path for price line
    const pricePath = useMemo(() => {
        if (priceData.length === 0) return '';

        return priceData
            .map((p, i) => {
                const { x, y } = toSvgPoint(p.timestamp, p.price);
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ');
    }, [priceData, toSvgPoint]);

    // Calculate prediction badge positions
    const predictionBadges = useMemo<PredictionBadgeData[]>(() => {
        return predictions.map(pred => {
            const { x, y } = toSvgPoint(pred.timestamp, pred.priceAtPrediction);
            return {
                id: pred.id,
                x,
                y,
                direction: pred.direction,
                isValidated: pred.isValidated,
                isCorrect: pred.isCorrect,
                prediction: pred,
            };
        });
    }, [predictions, toSvgPoint]);

    // Calculate horizon area shading
    const horizonAreas = useMemo<HorizonAreaData[]>(() => {
        if (!base.model.showForecastHorizon) return [];

        return predictions
            .filter(pred => pred.showHorizon && !pred.isValidated)
            .map(pred => {
                const startX = toSvgPoint(pred.timestamp, 0).x;
                const endX = toSvgPoint(pred.timestamp + pred.horizonMs, 0).x;
                const colors = TREND_DIRECTION_COLORS[pred.direction];

                return {
                    predictionId: pred.id,
                    startX,
                    endX,
                    color: colors.background,
                    opacity: 0.3,
                };
            });
    }, [predictions, base.model.showForecastHorizon, toSvgPoint]);

    // CSS classes
    const chartClasses = useMemo(() => {
        const classes = ['ark-trend-chart'];
        if (base.model.className) classes.push(base.model.className);
        if (base.model.animateNewPoints) classes.push('ark-trend-chart--animated');
        if (base.model.isStreaming) classes.push('ark-trend-chart--streaming');
        return classes.join(' ');
    }, [base.model.className, base.model.animateNewPoints, base.model.isStreaming]);

    // Add new price point
    const addPricePoint = useCallback((point: RealTimePricePoint) => {
        setPriceData(prev => {
            const maxPoints = base.model.maxDataPoints;
            const newData = [...prev, point];
            // Trim old points if exceeding max
            return newData.length > maxPoints ? newData.slice(-maxPoints) : newData;
        });
    }, [base.model.maxDataPoints]);

    // Add new prediction
    const addPrediction = useCallback((prediction: TrendPrediction) => {
        setPredictions(prev => [...prev, prediction]);
    }, []);

    // Validate a prediction
    const validatePrediction = useCallback((
        id: string,
        validation: { priceAtValidation: number; actualDirection: PredictionDirection; isCorrect: boolean }
    ) => {
        setPredictions(prev => prev.map(pred =>
            pred.id === id
                ? { ...pred, ...validation, isValidated: true }
                : pred
        ));
    }, []);

    // Clear all data
    const clearData = useCallback(() => {
        setPriceData([]);
        setPredictions([]);
    }, []);

    // Set streaming state
    const setStreaming = useCallback((isStreaming: boolean) => {
        base.updateModel({ isStreaming });
    }, [base]);

    return {
        ...base,
        priceData,
        predictions,
        scale,
        pricePath,
        predictionBadges,
        horizonAreas,
        chartClasses,
        addPricePoint,
        addPrediction,
        validatePrediction,
        clearData,
        toSvgPoint,
        setStreaming,
    };
}

export default useTrendPriceChart;
