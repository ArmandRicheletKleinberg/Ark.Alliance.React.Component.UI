/**
 * @fileoverview FinancialChart Component ViewModel
 * @module components/Charts/FinancialChart
 * 
 * ViewModel hook for FinancialChart with candlestick rendering,
 * moving average calculations, and trend signal detection.
 * 
 * Note: Mathematical calculations are delegated to Helpers/Math module
 * to maintain proper MVVM separation (no business logic in ViewModel).
 */

import { useMemo, useCallback, useState, useEffect } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { CandlestickDataPoint } from '../primitives/CandlestickRenderer.model';
import type {
    FinancialChartModel,
    FinancialThreshold,
    MovingAverageConfig,
} from './FinancialChart.model';
import {
    defaultFinancialChartModel,
    FinancialChartModelSchema,
} from './FinancialChart.model';
import type { TrendPrediction, PredictionDirection } from '../TrendPriceChart/TrendPriceChart.model';

// Import math calculations from Helpers - keeps ViewModel focused on state management
import {
    calculateSMA,
    calculateEMA,
    calculateMA,
    detectMACrossover,
    type MADataPoint,
    type PriceDataPoint,
} from '../../../Helpers/Math';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Options for useFinancialChart hook
 */
export interface UseFinancialChartOptions extends Partial<FinancialChartModel> {
    /** Callback when prediction badge is clicked */
    onPredictionClick?: (prediction: TrendPrediction) => void;
    /** Callback when threshold is added */
    onThresholdAdd?: (threshold: FinancialThreshold) => void;
    /** Callback when threshold is removed */
    onThresholdRemove?: (id: string) => void;
}

// Re-export MADataPoint from Helpers for convenience
export type { MADataPoint } from '../../../Helpers/Math';

/**
 * Chart scale configuration
 */
export interface FinancialChartScale {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    xRange: number;
    yRange: number;
}

/**
 * ViewModel result interface
 */
export interface UseFinancialChartResult extends BaseViewModelResult<FinancialChartModel> {
    // Data
    candlestickData: CandlestickDataPoint[];
    predictions: TrendPrediction[];
    thresholdLines: FinancialThreshold[];
    scale: FinancialChartScale;

    // Computed MAs
    fastMAData: MADataPoint[];
    slowMAData: MADataPoint[];

    // SVG paths
    pricePath: string;
    areaPath: string;
    fastMAPath: string;
    slowMAPath: string;

    // CSS classes
    chartClasses: string;

    // Data management
    addCandle: (candle: CandlestickDataPoint, replace?: boolean) => void;
    setData: (data: CandlestickDataPoint[]) => void;
    clearData: () => void;

    // Threshold management
    addThreshold: (threshold: FinancialThreshold) => void;
    removeThreshold: (id: string) => void;

    // Prediction management
    addPrediction: (prediction: TrendPrediction) => void;

    // State management
    setConnected: (connected: boolean) => void;
    setLoading: (loading: boolean) => void;

    // Coordinate conversion
    toSvgPoint: (time: number, price: number) => { x: number; y: number };

    // Current price
    currentPrice: number | null;
    priceChange: number | null;
    priceChangePercent: number | null;
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
 * FinancialChart ViewModel Hook
 * 
 * Manages candlestick data, moving averages, trend detection, and SVG rendering.
 * 
 * @param options - Chart configuration options
 * @returns ViewModel result with data and methods
 */
export function useFinancialChart(options: UseFinancialChartOptions = {}): UseFinancialChartResult {
    const { onPredictionClick, onThresholdAdd, onThresholdRemove, ...modelOptions } = options;

    // Parse and validate model
    const modelData = useMemo(() => {
        return FinancialChartModelSchema.parse({ ...defaultFinancialChartModel, ...modelOptions });
    }, [
        modelOptions.symbol,
        modelOptions.precision,
        modelOptions.chartType,
        modelOptions.headerTitle,
        modelOptions.borderColor,
        modelOptions.borderWidth,
        modelOptions.borderRadius,
        modelOptions.boxShadowIntensity,
        modelOptions.backgroundImage,
        modelOptions.bgImageOpacity,
        modelOptions.bgImageZoom,
        modelOptions.useLogScale,
        modelOptions.showGrid,
        modelOptions.showLegend,
        modelOptions.height,
        modelOptions.maxCandles,
        modelOptions.interval,
    ]);

    const base = useBaseViewModel<FinancialChartModel>(modelData, {
        model: modelData,
        eventChannel: 'financial-chart',
    });

    // Local state for real-time data
    const [candlestickData, setCandlestickData] = useState<CandlestickDataPoint[]>(modelData.candlestickData);
    const [predictions, setPredictions] = useState<TrendPrediction[]>(modelData.predictions);
    const [thresholdLines, setThresholdLines] = useState<FinancialThreshold[]>(modelData.thresholdLines);

    // Sync with model props
    useEffect(() => {
        if (modelData.candlestickData.length > 0) {
            setCandlestickData(modelData.candlestickData);
        }
    }, [modelData.candlestickData]);

    // Calculate scale
    const scale = useMemo<FinancialChartScale>(() => {
        if (candlestickData.length === 0) {
            return { minX: 0, maxX: 1, minY: 0, maxY: 1, xRange: 1, yRange: 1 };
        }

        const times = candlestickData.map(d => d.time);
        const highs = candlestickData.map(d => d.high);
        const lows = candlestickData.map(d => d.low);

        let minY = Math.min(...lows);
        let maxY = Math.max(...highs);

        // Include thresholds in Y range
        for (const threshold of thresholdLines) {
            minY = Math.min(minY, threshold.price);
            maxY = Math.max(maxY, threshold.price);
        }

        // Add 5% padding
        const yPad = (maxY - minY) * 0.05;
        minY -= yPad;
        maxY += yPad;

        return {
            minX: Math.min(...times),
            maxX: Math.max(...times),
            minY,
            maxY,
            xRange: Math.max(Math.max(...times) - Math.min(...times), 1),
            yRange: Math.max(maxY - minY, 1),
        };
    }, [candlestickData, thresholdLines]);

    // Calculate moving averages
    const fastMAData = useMemo(() => {
        if (!base.model.fastMA.enabled) return [];
        const calculator = base.model.fastMA.type === 'EMA' ? calculateEMA : calculateSMA;
        return calculator(candlestickData, base.model.fastMA.period);
    }, [candlestickData, base.model.fastMA]);

    const slowMAData = useMemo(() => {
        if (!base.model.slowMA.enabled) return [];
        const calculator = base.model.slowMA.type === 'EMA' ? calculateEMA : calculateSMA;
        return calculator(candlestickData, base.model.slowMA.period);
    }, [candlestickData, base.model.slowMA]);

    // Coordinate conversion
    const toSvgPoint = useCallback((time: number, price: number) => {
        const chartWidth = DEFAULT_WIDTH - CHART_PADDING * 2;
        const chartHeight = base.model.height - CHART_PADDING * 2;

        const x = CHART_PADDING + ((time - scale.minX) / scale.xRange) * chartWidth;
        const y = CHART_PADDING + chartHeight - ((price - scale.minY) / scale.yRange) * chartHeight;

        return { x, y };
    }, [scale, base.model.height]);

    // Generate SVG paths
    const pricePath = useMemo(() => {
        if (candlestickData.length === 0) return '';

        return candlestickData
            .map((d, i) => {
                const { x, y } = toSvgPoint(d.time, d.close);
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ');
    }, [candlestickData, toSvgPoint]);

    const areaPath = useMemo(() => {
        if (candlestickData.length < 2) return '';

        const chartHeight = base.model.height - CHART_PADDING * 2;
        const firstPoint = toSvgPoint(candlestickData[0].time, candlestickData[0].close);
        const lastPoint = toSvgPoint(candlestickData[candlestickData.length - 1].time, candlestickData[candlestickData.length - 1].close);

        return `${pricePath} L ${lastPoint.x} ${CHART_PADDING + chartHeight} L ${firstPoint.x} ${CHART_PADDING + chartHeight} Z`;
    }, [pricePath, candlestickData, base.model.height, toSvgPoint]);

    const fastMAPath = useMemo(() => {
        if (fastMAData.length === 0) return '';

        return fastMAData
            .map((d, i) => {
                const { x, y } = toSvgPoint(d.time, d.value);
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ');
    }, [fastMAData, toSvgPoint]);

    const slowMAPath = useMemo(() => {
        if (slowMAData.length === 0) return '';

        return slowMAData
            .map((d, i) => {
                const { x, y } = toSvgPoint(d.time, d.value);
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ');
    }, [slowMAData, toSvgPoint]);

    // CSS classes
    const chartClasses = useMemo(() => {
        const classes = ['ark-financial-chart'];
        if (base.model.className) classes.push(base.model.className);
        if (base.model.chartType === 'candlestick') classes.push('ark-financial-chart--candlestick');
        if (base.model.chartType === 'area') classes.push('ark-financial-chart--area');
        if (base.model.isStreaming) classes.push('ark-financial-chart--streaming');
        if (base.model.isConnected) classes.push('ark-financial-chart--connected');
        return classes.join(' ');
    }, [base.model]);

    // Current price and change calculations
    const currentPrice = useMemo(() => {
        if (candlestickData.length === 0) return null;
        return candlestickData[candlestickData.length - 1].close;
    }, [candlestickData]);

    const priceChange = useMemo(() => {
        if (candlestickData.length < 2) return null;
        const first = candlestickData[0].close;
        const last = candlestickData[candlestickData.length - 1].close;
        return last - first;
    }, [candlestickData]);

    const priceChangePercent = useMemo(() => {
        if (candlestickData.length < 2) return null;
        const first = candlestickData[0].close;
        const last = candlestickData[candlestickData.length - 1].close;
        return ((last - first) / first) * 100;
    }, [candlestickData]);

    // Data management methods
    const addCandle = useCallback((candle: CandlestickDataPoint, replace = false) => {
        setCandlestickData(prev => {
            const last = prev[prev.length - 1];

            let newData: CandlestickDataPoint[];

            if (replace && last && last.time === candle.time) {
                // Replace current candle
                newData = [...prev.slice(0, -1), candle];
            } else {
                // Add new candle
                newData = [...prev, candle];
            }

            // Apply sliding window
            if (newData.length > base.model.maxCandles) {
                newData = newData.slice(-base.model.maxCandles);
            }

            // Detect trend signals
            detectTrendSignal(newData);

            return newData;
        });
    }, [base.model.maxCandles]);

    const setData = useCallback((data: CandlestickDataPoint[]) => {
        setCandlestickData(data.slice(-base.model.maxCandles));
    }, [base.model.maxCandles]);

    const clearData = useCallback(() => {
        setCandlestickData([]);
        setPredictions([]);
    }, []);

    // Trend signal detection
    const detectTrendSignal = useCallback((data: CandlestickDataPoint[]) => {
        if (!base.model.fastMA.enabled || !base.model.slowMA.enabled) return;

        const fastPeriod = base.model.fastMA.period;
        const slowPeriod = base.model.slowMA.period;

        if (data.length < slowPeriod + 1) return;

        const currentData = data;
        const prevData = data.slice(0, -1);

        const currFastMA = calculateSMA(currentData, fastPeriod);
        const currSlowMA = calculateSMA(currentData, slowPeriod);
        const prevFastMA = calculateSMA(prevData, fastPeriod);
        const prevSlowMA = calculateSMA(prevData, slowPeriod);

        if (currFastMA.length === 0 || currSlowMA.length === 0 || prevFastMA.length === 0 || prevSlowMA.length === 0) return;

        const currFast = currFastMA[currFastMA.length - 1].value;
        const currSlow = currSlowMA[currSlowMA.length - 1].value;
        const prevFast = prevFastMA[prevFastMA.length - 1].value;
        const prevSlow = prevSlowMA[prevSlowMA.length - 1].value;

        const lastCandle = data[data.length - 1];
        let newType: PredictionDirection | null = null;

        // Crossover detection
        if (prevFast <= prevSlow && currFast > currSlow) {
            newType = 'LONG';
        } else if (prevFast >= prevSlow && currFast < currSlow) {
            newType = 'SHORT';
        }

        if (newType) {
            const newPrediction: TrendPrediction = {
                id: `${lastCandle.time}-${newType}`,
                timestamp: lastCandle.time,
                priceAtPrediction: lastCandle.close,
                direction: newType,
                compositeScore: newType === 'LONG' ? 0.5 : -0.5,
                confidence: 0.7,
                isValidated: false,
                showHorizon: true,
                horizonMs: 60000,
            };

            setPredictions(prev => {
                // Avoid duplicates
                if (prev.find(p => p.id === newPrediction.id)) return prev;
                return [...prev, newPrediction];
            });
        }
    }, [base.model.fastMA, base.model.slowMA]);

    // Threshold management
    const addThreshold = useCallback((threshold: FinancialThreshold) => {
        setThresholdLines(prev => [...prev, threshold]);
        if (onThresholdAdd) onThresholdAdd(threshold);
    }, [onThresholdAdd]);

    const removeThreshold = useCallback((id: string) => {
        setThresholdLines(prev => prev.filter(t => t.id !== id));
        if (onThresholdRemove) onThresholdRemove(id);
    }, [onThresholdRemove]);

    // Prediction management
    const addPrediction = useCallback((prediction: TrendPrediction) => {
        setPredictions(prev => [...prev, prediction]);
    }, []);

    // State management
    const setConnected = useCallback((connected: boolean) => {
        base.updateModel({ isConnected: connected });
    }, [base]);

    const setLoadingState = useCallback((loading: boolean) => {
        base.updateModel({ isLoadingHistory: loading });
    }, [base]);

    return {
        ...base,
        candlestickData,
        predictions,
        thresholdLines,
        scale,
        fastMAData,
        slowMAData,
        pricePath,
        areaPath,
        fastMAPath,
        slowMAPath,
        chartClasses,
        addCandle,
        setData,
        clearData,
        addThreshold,
        removeThreshold,
        addPrediction,
        setConnected,
        setLoading: setLoadingState,
        toSvgPoint,
        currentPrice,
        priceChange,
        priceChangePercent,
    };
}

export default useFinancialChart;
