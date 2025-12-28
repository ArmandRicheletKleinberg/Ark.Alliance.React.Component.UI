/**
 * @fileoverview Chart3D ViewModel
 * @module components/Chart3D
 */

import { useMemo, useCallback, useState, useEffect } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import type { Chart3DModel, DataPoint } from './Chart3D.model';
import { Chart3DModelSchema, defaultChart3DModel } from './Chart3D.model';
import { generateInitialData, updateDataStream } from './services/dataService';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseChart3DOptions extends Partial<Chart3DModel> {
    /** External data source (optional) */
    externalData?: DataPoint[];
    /** Config change handler */
    onConfigChange?: (config: Chart3DModel) => void;
}

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
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useChart3D(options: UseChart3DOptions): UseChart3DResult {
    const { externalData, onConfigChange, ...modelData } = options;

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
    };
}

export default useChart3D;
