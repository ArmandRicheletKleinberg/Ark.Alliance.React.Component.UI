/**
 * @fileoverview CandlestickRenderer ViewModel
 * @module components/Charts/primitives/CandlestickRenderer
 * 
 * ViewModel hook for candlestick SVG rendering calculations.
 */

import { useMemo, useCallback } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { CandlestickRendererModel, CandlestickDataPoint } from './CandlestickRenderer.model';
import {
    defaultCandlestickRendererModel,
    CandlestickRendererModelSchema,
} from './CandlestickRenderer.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Options for useCandlestickRenderer hook
 */
export interface UseCandlestickRendererOptions extends Partial<CandlestickRendererModel> {
    /** Callback when candle is clicked */
    onCandleClick?: (candle: CandlestickDataPoint, index: number) => void;
}

/**
 * Scale information for coordinate conversion
 */
export interface CandlestickScale {
    minTime: number;
    maxTime: number;
    minPrice: number;
    maxPrice: number;
    timeRange: number;
    priceRange: number;
}

/**
 * Computed candle data for SVG rendering
 */
export interface ComputedCandle {
    /** Original data point */
    data: CandlestickDataPoint;
    /** Index in array */
    index: number;
    /** X position of candle center */
    x: number;
    /** Y position of candle body top */
    bodyTop: number;
    /** Y position of candle body bottom */
    bodyBottom: number;
    /** Y position of wick top (high) */
    wickTop: number;
    /** Y position of wick bottom (low) */
    wickBottom: number;
    /** Whether candle is bullish (close > open) */
    isBullish: boolean;
    /** Whether candle is doji (close == open) */
    isDoji: boolean;
    /** Color for this candle */
    color: string;
    /** Volume bar height (if enabled) */
    volumeHeight?: number;
}

/**
 * ViewModel result interface
 */
export interface UseCandlestickRendererResult extends BaseViewModelResult<CandlestickRendererModel> {
    /** Scale information */
    scale: CandlestickScale;
    /** Computed candle data for rendering */
    candles: ComputedCandle[];
    /** CSS classes for container */
    containerClasses: string;
    /** Convert price to Y coordinate */
    priceToY: (price: number) => number;
    /** Convert time to X coordinate */
    timeToX: (time: number) => number;
    /** Effective chart width (minus padding) */
    chartWidth: number;
    /** Effective chart height (minus padding and volume area) */
    chartHeight: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CandlestickRenderer ViewModel Hook
 * 
 * Calculates SVG coordinates for candlestick chart rendering.
 * 
 * @param options - Renderer configuration options
 * @returns ViewModel result with computed candle positions
 */
export function useCandlestickRenderer(options: UseCandlestickRendererOptions = {}): UseCandlestickRendererResult {
    const { onCandleClick, ...modelOptions } = options;

    // Parse and validate model
    const modelData = useMemo(() => {
        return CandlestickRendererModelSchema.parse({ ...defaultCandlestickRendererModel, ...modelOptions });
    }, [
        modelOptions.data,
        modelOptions.colors,
        modelOptions.candleWidth,
        modelOptions.candleGap,
        modelOptions.showVolume,
        modelOptions.volumeHeightPercent,
        modelOptions.showWicks,
        modelOptions.wickWidth,
        modelOptions.height,
        modelOptions.width,
        modelOptions.padding,
    ]);

    const base = useBaseViewModel<CandlestickRendererModel>(modelData, {
        model: modelData,
        eventChannel: 'candlestick-renderer',
    });

    // Calculate effective dimensions
    const chartWidth = useMemo(() => base.model.width - base.model.padding * 2, [base.model.width, base.model.padding]);
    const chartHeight = useMemo(() => {
        const totalHeight = base.model.height - base.model.padding * 2;
        if (base.model.showVolume) {
            return totalHeight * (1 - base.model.volumeHeightPercent / 100);
        }
        return totalHeight;
    }, [base.model.height, base.model.padding, base.model.showVolume, base.model.volumeHeightPercent]);

    // Calculate scale from data
    const scale = useMemo<CandlestickScale>(() => {
        const data = base.model.data;
        if (data.length === 0) {
            return { minTime: 0, maxTime: 1, minPrice: 0, maxPrice: 1, timeRange: 1, priceRange: 1 };
        }

        const times = data.map(d => d.time);
        const prices = data.flatMap(d => [d.high, d.low]);

        let minPrice = Math.min(...prices);
        let maxPrice = Math.max(...prices);

        // Add 5% padding to price range
        const pricePad = (maxPrice - minPrice) * 0.05;
        minPrice -= pricePad;
        maxPrice += pricePad;

        return {
            minTime: Math.min(...times),
            maxTime: Math.max(...times),
            minPrice,
            maxPrice,
            timeRange: Math.max(Math.max(...times) - Math.min(...times), 1),
            priceRange: Math.max(maxPrice - minPrice, 1),
        };
    }, [base.model.data]);

    // Convert price to Y coordinate
    const priceToY = useCallback((price: number) => {
        const y = base.model.padding + chartHeight - ((price - scale.minPrice) / scale.priceRange) * chartHeight;
        return y;
    }, [base.model.padding, chartHeight, scale]);

    // Convert time to X coordinate
    const timeToX = useCallback((time: number) => {
        const x = base.model.padding + ((time - scale.minTime) / scale.timeRange) * chartWidth;
        return x;
    }, [base.model.padding, chartWidth, scale]);

    // Compute candle positions
    const candles = useMemo<ComputedCandle[]>(() => {
        const data = base.model.data;
        const colors = base.model.colors;
        const maxVolume = data.length > 0 ? Math.max(...data.map(d => d.volume || 0)) : 1;
        const volumeAreaHeight = base.model.showVolume
            ? (base.model.height - base.model.padding * 2) * (base.model.volumeHeightPercent / 100)
            : 0;

        return data.map((candle, index) => {
            const isBullish = candle.close > candle.open;
            const isDoji = candle.close === candle.open;

            let color: string;
            if (isDoji) {
                color = colors.doji;
            } else if (isBullish) {
                color = colors.bullish;
            } else {
                color = colors.bearish;
            }

            const x = timeToX(candle.time);
            const bodyTop = priceToY(Math.max(candle.open, candle.close));
            const bodyBottom = priceToY(Math.min(candle.open, candle.close));
            const wickTop = priceToY(candle.high);
            const wickBottom = priceToY(candle.low);

            const volumeHeight = base.model.showVolume && candle.volume
                ? (candle.volume / maxVolume) * volumeAreaHeight
                : undefined;

            return {
                data: candle,
                index,
                x,
                bodyTop,
                bodyBottom,
                wickTop,
                wickBottom,
                isBullish,
                isDoji,
                color,
                volumeHeight,
            };
        });
    }, [base.model.data, base.model.colors, base.model.showVolume, base.model.volumeHeightPercent, base.model.height, base.model.padding, timeToX, priceToY]);

    // CSS classes
    const containerClasses = useMemo(() => {
        const classes = ['ark-candlestick-renderer'];
        if (base.model.className) classes.push(base.model.className);
        if (base.model.showVolume) classes.push('ark-candlestick-renderer--with-volume');
        return classes.join(' ');
    }, [base.model.className, base.model.showVolume]);

    return {
        ...base,
        scale,
        candles,
        containerClasses,
        priceToY,
        timeToX,
        chartWidth,
        chartHeight,
    };
}

export default useCandlestickRenderer;
