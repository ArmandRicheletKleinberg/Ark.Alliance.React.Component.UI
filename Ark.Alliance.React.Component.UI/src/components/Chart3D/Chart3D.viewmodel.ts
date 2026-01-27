/**
 * @fileoverview Chart3D ViewModel
 * @module components/Chart3D
 */

import { useMemo, useCallback, useState, useEffect } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import type { Chart3DModel, DataPoint, PriceThreshold, ChartEventMarker, PriceRange } from './Chart3D.model';
import { Chart3DModelSchema, defaultChart3DModel } from './Chart3D.model';
import { generateInitialData, updateDataStream } from './services/dataService';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Options for the useChart3D hook.
 */
export interface UseChart3DOptions extends Partial<Chart3DModel> {
    /** External data source (optional) */
    externalData?: DataPoint[];
    /** Price thresholds for indicator lines */
    thresholds?: PriceThreshold[];
    /** Event markers (3D bubbles) */
    eventMarkers?: ChartEventMarker[];
    /** Price range for Y-axis normalization */
    priceRange?: PriceRange;
    /** Config change handler */
    onConfigChange?: (config: Chart3DModel) => void;
    /** Marker selection handler */
    onMarkerSelect?: (marker: ChartEventMarker | null) => void;
}

/**
 * Result returned by the useChart3D hook.
 */
export interface UseChart3DResult extends BaseViewModelResult<Chart3DModel> {
    /** Chart data points */
    data: DataPoint[];
    /** Currently hovered point */
    hoveredPoint: DataPoint | null;
    /** Set hovered point */
    setHoveredPoint: (point: DataPoint | null) => void;
    /** Update config property */
    updateConfig: <K extends keyof Chart3DModel>(key: K, value: Chart3DModel[K]) => void;
    /** Reset data */
    resetData: () => void;
    /** Toggle streaming */
    toggleStreaming: () => void;
    /** Wrapper classes */
    wrapperClasses: string;
    /** Price thresholds */
    thresholds: PriceThreshold[];
    /** Event markers */
    eventMarkers: ChartEventMarker[];
    /** Price range */
    priceRange: PriceRange | undefined;
    /** Currently selected marker */
    selectedMarker: ChartEventMarker | null;
    /** Set selected marker */
    setSelectedMarker: (marker: ChartEventMarker | null) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook for Chart3D logic and state management.
 * 
 * @param options - Configuration options for the chart
 * @returns Chart3D state and handlers
 * 
 * @example
 * ```tsx
 * const vm = useChart3D({
 *     shape: 'Candle',
 *     thresholds: [{ label: 'Target', price: 45000, color: '#22c55e' }],
 *     priceRange: { min: 40000, max: 50000 },
 * });
 * ```
 */
export function useChart3D(options: UseChart3DOptions): UseChart3DResult {
    const {
        externalData,
        thresholds: externalThresholds = [],
        eventMarkers: externalMarkers = [],
        priceRange: externalPriceRange,
        onConfigChange,
        onMarkerSelect,
        ...modelData
    } = options;

    // Parse model
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const modelOptions = useMemo(() => {
        return Chart3DModelSchema.parse({ ...defaultChart3DModel, ...modelData });
    }, [JSON.stringify(modelData)]);

    const base = useBaseViewModel<Chart3DModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'chart3d',
    });

    // State
    const [data, setData] = useState<DataPoint[]>([]);
    const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
    const [selectedMarker, setSelectedMarkerState] = useState<ChartEventMarker | null>(null);

    /**
     * Sets the selected marker and notifies parent.
     */
    const setSelectedMarker = useCallback((marker: ChartEventMarker | null) => {
        setSelectedMarkerState(marker);
        onMarkerSelect?.(marker);
    }, [onMarkerSelect]);

    // Initialize data
    useEffect(() => {
        if (externalData) {
            setData(externalData);
        } else {
            setData(generateInitialData(base.model.xResolution, base.model.seriesCount));
        }
    }, [base.model.seriesCount, base.model.xResolution, externalData]);

    // Streaming logic
    useEffect(() => {
        if (externalData || !base.model.isStreaming) return;

        const interval = setInterval(() => {
            setData((prev) => {
                if (prev.length === 0) return prev;
                return updateDataStream(prev, base.model.xResolution, base.model.seriesCount);
            });
        }, base.model.speed);

        return () => clearInterval(interval);
    }, [base.model.isStreaming, base.model.speed, base.model.seriesCount, base.model.xResolution, externalData]);

    // Update config
    const updateConfig = useCallback(<K extends keyof Chart3DModel>(key: K, value: Chart3DModel[K]) => {
        base.emit('configChange', { key, value });
        onConfigChange?.({ ...base.model, [key]: value });
    }, [base, onConfigChange]);

    // Reset data
    const resetData = useCallback(() => {
        if (!externalData) {
            setData(generateInitialData(base.model.xResolution, base.model.seriesCount));
        }
    }, [base.model.xResolution, base.model.seriesCount, externalData]);

    // Toggle streaming
    const toggleStreaming = useCallback(() => {
        updateConfig('isStreaming', !base.model.isStreaming);
    }, [base.model.isStreaming, updateConfig]);

    // Classes
    const wrapperClasses = useMemo(() => {
        const classes = [
            'ark-chart3d',
            base.model.isDark ? 'ark-chart3d--dark' : 'ark-chart3d--light',
        ];
        return classes.join(' ');
    }, [base.model.isDark]);

    return {
        ...base,
        data,
        hoveredPoint,
        setHoveredPoint,
        updateConfig,
        resetData,
        toggleStreaming,
        wrapperClasses,
        thresholds: externalThresholds,
        eventMarkers: externalMarkers,
        priceRange: externalPriceRange,
        selectedMarker,
        setSelectedMarker,
    };
}

export default useChart3D;
