/**
 * @fileoverview Taskbar Component ViewModel
 * @module components/Desktop/Taskbar
 * 
 * Business logic and state management for the Taskbar component.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { TaskbarModel, TaskbarWindow } from './Taskbar.model';
import { defaultTaskbarModel, TaskbarModelSchema } from './Taskbar.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Taskbar ViewModel options
 */
export interface UseTaskbarOptions extends Partial<TaskbarModel> {
    /** Callback when start button is clicked */
    onStartClick?: () => void;

    /** Callback when a window button is clicked */
    onWindowClick?: (windowId: string) => void;
}

/**
 * Taskbar ViewModel return type
 */
export interface UseTaskbarResult extends BaseViewModelResult<TaskbarModel> {
    /** Current time string */
    timeString: string;

    /** Current date string */
    dateString: string;

    /** Handle start button click */
    handleStartClick: () => void;

    /** Handle window button click */
    handleWindowClick: (windowId: string) => void;

    /** Check if a window is active */
    isWindowActive: (windowId: string) => boolean;

    /** Computed container classes */
    containerClasses: string;

    /** Computed container style */
    containerStyle: React.CSSProperties;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Taskbar ViewModel hook
 */
export function useTaskbar(options: UseTaskbarOptions = {}): UseTaskbarResult {
    const {
        onStartClick,
        onWindowClick,
        ...modelData
    } = options;

    // Parse model options
    const modelOptions = useMemo(() => {
        return TaskbarModelSchema.parse({ ...defaultTaskbarModel, ...modelData });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(modelData)]);

    // Use base ViewModel
    const base = useBaseViewModel<TaskbarModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'taskbar',
    });

    // Clock state
    const [currentTime, setCurrentTime] = useState(new Date());

    // Clock effect
    useEffect(() => {
        if (!base.model.showClock) return;

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, [base.model.showClock]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════════════

    const timeString = useMemo(() => {
        return currentTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }, [currentTime]);

    const dateString = useMemo(() => {
        return currentTime.toLocaleDateString();
    }, [currentTime]);

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleStartClick = useCallback(() => {
        base.emit('startClick', { id: base.model.id });
        onStartClick?.();
    }, [base, onStartClick]);

    const handleWindowClick = useCallback((windowId: string) => {
        base.emit('windowClick', { id: base.model.id, windowId });
        onWindowClick?.(windowId);
    }, [base, onWindowClick]);

    const isWindowActive = useCallback((windowId: string) => {
        return base.model.activeWindowId === windowId;
    }, [base.model.activeWindowId]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED STYLES
    // ═══════════════════════════════════════════════════════════════════════

    const containerClasses = useMemo(() => {
        const classes = [
            'ark-taskbar',
            `ark-taskbar--${base.model.position}`,
            `ark-taskbar--${base.model.visualMode}`,
        ];
        if (base.model.className) classes.push(base.model.className);
        return classes.join(' ');
    }, [base.model]);

    const containerStyle = useMemo((): React.CSSProperties => {
        return {
            height: base.model.height,
            ...(base.model.style || {}),
        };
    }, [base.model.height, base.model.style]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        timeString,
        dateString,
        handleStartClick,
        handleWindowClick,
        isWindowActive,
        containerClasses,
        containerStyle,
    };
}

export default useTaskbar;
