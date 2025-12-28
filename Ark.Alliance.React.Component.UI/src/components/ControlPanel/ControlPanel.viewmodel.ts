/**
 * @fileoverview ControlPanel Component ViewModel
 * @module components/ControlPanel
 * 
 * ViewModel hook for ControlPanel with visibility management,
 * collapse state, and section management.
 */

import { useMemo, useCallback, useState } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import type { ControlPanelModel, HeaderAction } from './ControlPanel.model';
import { defaultControlPanelModel, ControlPanelModelSchema } from './ControlPanel.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Options for useControlPanel hook
 */
export interface UseControlPanelOptions extends Partial<ControlPanelModel> {
    /** Callback when visibility changes */
    onVisibilityChange?: (visible: boolean) => void;
    /** Callback when collapse state changes */
    onCollapseChange?: (collapsed: boolean) => void;
    /** Callback when a header action is clicked */
    onActionClick?: (actionId: string) => void;
}

/**
 * ViewModel result interface
 */
export interface UseControlPanelResult extends BaseViewModelResult<ControlPanelModel> {
    /** Whether panel is currently collapsed */
    isCollapsed: boolean;
    /** Toggle collapse state */
    toggleCollapse: () => void;
    /** Set collapse state explicitly */
    setCollapsed: (collapsed: boolean) => void;
    /** Toggle visibility */
    toggleVisibility: () => void;
    /** Set visibility explicitly */
    setVisible: (visible: boolean) => void;
    /** Handle header action click */
    handleActionClick: (actionId: string) => void;
    /** Computed CSS classes for container */
    containerClasses: string;
    /** Computed CSS classes for header */
    headerClasses: string;
    /** Computed CSS classes for content */
    contentClasses: string;
    /** Connection status indicator props */
    connectionIndicatorProps: {
        status: 'connected' | 'disconnected' | 'connecting' | 'error';
        visible: boolean;
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ControlPanel ViewModel Hook
 * 
 * Manages visibility, collapse state, and actions for the control panel.
 * 
 * @param options - Control panel configuration options
 * @returns ViewModel result with state and methods
 */
export function useControlPanel(options: UseControlPanelOptions = {}): UseControlPanelResult {
    const {
        onVisibilityChange,
        onCollapseChange,
        onActionClick,
        ...modelOptions
    } = options;

    // Parse and validate model
    const modelData = useMemo(() => {
        return ControlPanelModelSchema.parse({ ...defaultControlPanelModel, ...modelOptions });
    }, [
        modelOptions.visible,
        modelOptions.collapsible,
        modelOptions.defaultCollapsed,
        modelOptions.title,
        modelOptions.titleIcon,
        modelOptions.position,
        modelOptions.width,
        modelOptions.height,
        modelOptions.connectionStatus,
        modelOptions.isLoading,
    ]);

    const base = useBaseViewModel<ControlPanelModel>(modelData, {
        model: modelData,
        eventChannel: 'control-panel',
    });

    // Local collapse state (allows external control via props)
    const [isCollapsed, setIsCollapsedState] = useState(modelData.defaultCollapsed);
    const [isVisible, setIsVisibleState] = useState(modelData.visible);

    /**
     * Toggle collapse state
     */
    const toggleCollapse = useCallback(() => {
        if (!base.model.collapsible) return;

        setIsCollapsedState(prev => {
            const newState = !prev;
            if (onCollapseChange) onCollapseChange(newState);
            return newState;
        });
    }, [base.model.collapsible, onCollapseChange]);

    /**
     * Set collapse state explicitly
     */
    const setCollapsed = useCallback((collapsed: boolean) => {
        setIsCollapsedState(collapsed);
        if (onCollapseChange) onCollapseChange(collapsed);
    }, [onCollapseChange]);

    /**
     * Toggle visibility
     */
    const toggleVisibility = useCallback(() => {
        setIsVisibleState(prev => {
            const newState = !prev;
            if (onVisibilityChange) onVisibilityChange(newState);
            return newState;
        });
    }, [onVisibilityChange]);

    /**
     * Set visibility explicitly
     */
    const setVisible = useCallback((visible: boolean) => {
        setIsVisibleState(visible);
        if (onVisibilityChange) onVisibilityChange(visible);
    }, [onVisibilityChange]);

    /**
     * Handle header action click
     */
    const handleActionClick = useCallback((actionId: string) => {
        if (onActionClick) onActionClick(actionId);
    }, [onActionClick]);

    // Computed CSS classes
    const containerClasses = useMemo(() => {
        const classes = ['ark-control-panel'];
        if (base.model.className) classes.push(base.model.className);
        if (isCollapsed) classes.push('ark-control-panel--collapsed');
        if (!isVisible) classes.push('ark-control-panel--hidden');
        if (base.model.position) classes.push(`ark-control-panel--${base.model.position}`);
        if (base.model.isLoading) classes.push('ark-control-panel--loading');
        return classes.join(' ');
    }, [base.model, isCollapsed, isVisible]);

    const headerClasses = useMemo(() => {
        const classes = ['ark-control-panel__header'];
        if (base.model.collapsible) classes.push('ark-control-panel__header--collapsible');
        return classes.join(' ');
    }, [base.model.collapsible]);

    const contentClasses = useMemo(() => {
        const classes = ['ark-control-panel__content'];
        if (isCollapsed) classes.push('ark-control-panel__content--collapsed');
        return classes.join(' ');
    }, [isCollapsed]);

    // Connection indicator props
    const connectionIndicatorProps = useMemo(() => ({
        status: base.model.connectionStatus || 'disconnected',
        visible: !!base.model.connectionStatus,
    }), [base.model.connectionStatus]);

    return {
        ...base,
        isCollapsed,
        toggleCollapse,
        setCollapsed,
        toggleVisibility,
        setVisible,
        handleActionClick,
        containerClasses,
        headerClasses,
        contentClasses,
        connectionIndicatorProps,
    };
}

export default useControlPanel;
