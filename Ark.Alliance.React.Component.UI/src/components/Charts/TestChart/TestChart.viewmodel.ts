/**
 * @fileoverview TestChart Component ViewModel
 * @module components/Charts/TestChart
 * 
 * ViewModel for TestChart with data processing and scale calculations.
 */

import { useMemo, useCallback } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { TestChartModel, PricePoint, StepMarker, ThresholdLine } from './TestChart.model';
import { defaultTestChartModel, TestChartModelSchema } from './TestChart.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseTestChartOptions extends Partial<TestChartModel> {
    /** Padding percentage for Y-axis range */
    yAxisPadding?: number;
    /** Callback when marker is clicked */
    onMarkerClick?: (marker: StepMarker, index: number) => void;
}

export interface ChartScale {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    xRange: number;
    yRange: number;
}

export interface UseTestChartResult extends BaseViewModelResult<TestChartModel> {
    /** Processed prices */
    prices: PricePoint[];
    /** Step markers */
    markers: StepMarker[];
    /** Threshold lines */
    thresholds: ThresholdLine[];
    /** Chart scale */
    scale: ChartScale;
    /** CSS classes */
    chartClasses: string;
    /** Convert data point to SVG coordinates */
    toSvgPoint: (index: number, value: number) => { x: number; y: number };
    /** Generate SVG path for price line */
    pricePath: string;
    /** Update marker status */
    updateMarker: (stepIndex: number, status: StepMarker['status']) => void;
    /** Set current highlighted index */
    setCurrentIndex: (index: number) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

const CHART_PADDING = 40; // SVG padding for axes
const CHART_WIDTH = 600; // Default SVG width

/**
 * TestChart ViewModel Hook
 */
export function useTestChart(options: UseTestChartOptions = {}): UseTestChartResult {
    const { yAxisPadding = 0.1, onMarkerClick, ...modelOptions } = options;

    // Parse model options with JSON.stringify for proper dependency tracking
    const modelData = useMemo(() => {
        return TestChartModelSchema.parse({ ...defaultTestChartModel, ...modelOptions });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(modelOptions)]);

    const base = useBaseViewModel<TestChartModel>(modelData, {
        model: modelData,
        eventChannel: 'test-chart',
    });

    // Calculate scale
    const scale = useMemo<ChartScale>(() => {
        const prices = base.model.prices;
        if (prices.length === 0) {
            return { minX: 0, maxX: 100, minY: 0, maxY: 100, xRange: 100, yRange: 100 };
        }

        const minX = 0;
        const maxX = prices.length - 1;

        let minY = Math.min(...prices.map(p => p.price));
        let maxY = Math.max(...prices.map(p => p.price));

        // Include thresholds in Y range
        for (const threshold of base.model.thresholds) {
            minY = Math.min(minY, threshold.value);
            maxY = Math.max(maxY, threshold.value);
        }

        // Include entry price
        if (base.model.entryPrice !== undefined) {
            minY = Math.min(minY, base.model.entryPrice);
            maxY = Math.max(maxY, base.model.entryPrice);
        }

        // Add padding
        const yPad = (maxY - minY) * yAxisPadding;
        minY -= yPad;
        maxY += yPad;

        return {
            minX,
            maxX,
            minY,
            maxY,
            xRange: maxX - minX || 1,
            yRange: maxY - minY || 1,
        };
    }, [base.model.prices, base.model.thresholds, base.model.entryPrice, yAxisPadding]);

    // Convert point to SVG coordinates
    const toSvgPoint = useCallback((index: number, value: number) => {
        const chartWidth = CHART_WIDTH - CHART_PADDING * 2;
        const chartHeight = base.model.height - CHART_PADDING * 2;

        const x = CHART_PADDING + (index / scale.xRange) * chartWidth;
        const y = CHART_PADDING + chartHeight - ((value - scale.minY) / scale.yRange) * chartHeight;

        return { x, y };
    }, [scale, base.model.height]);

    // Generate SVG path
    const pricePath = useMemo(() => {
        if (base.model.prices.length === 0) return '';

        return base.model.prices
            .map((p, i) => {
                const { x, y } = toSvgPoint(i, p.price);
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            })
            .join(' ');
    }, [base.model.prices, toSvgPoint]);

    // CSS classes
    const chartClasses = useMemo(() => {
        const classes = ['ark-test-chart'];
        if (base.model.className) classes.push(base.model.className);
        if (base.model.animate) classes.push('ark-test-chart--animated');
        return classes.join(' ');
    }, [base.model]);

    // Update marker status
    const updateMarker = useCallback((stepIndex: number, status: StepMarker['status']) => {
        const markers = base.model.markers.map(m =>
            m.stepIndex === stepIndex ? { ...m, status } : m
        );
        base.updateModel({ markers });
    }, [base]);

    // Set current index
    const setCurrentIndex = useCallback((index: number) => {
        base.updateModel({ currentIndex: index });
    }, [base]);

    return {
        ...base,
        prices: base.model.prices,
        markers: base.model.markers,
        thresholds: base.model.thresholds,
        scale,
        chartClasses,
        toSvgPoint,
        pricePath,
        updateMarker,
        setCurrentIndex,
    };
}

export default useTestChart;
