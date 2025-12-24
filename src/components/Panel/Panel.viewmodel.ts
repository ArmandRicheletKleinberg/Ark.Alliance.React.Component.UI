/**
 * @fileoverview Panel Component ViewModel
 * @module components/Panel
 * 
 * Business logic and state management for the Panel component.
 */

import { useCallback, useMemo, useState } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import type { PanelModel } from './Panel.model';
import { defaultPanelModel, PanelModelSchema } from './Panel.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Panel ViewModel options
 */
export interface UsePanelOptions extends Partial<PanelModel> {
    /** Callback when collapse state changes */
    onCollapseChange?: (collapsed: boolean) => void;
}

/**
 * Panel ViewModel return type
 */
export interface UsePanelResult extends BaseViewModelResult<PanelModel> {
    /** Current collapsed state */
    isCollapsed: boolean;
    /** Toggle collapsed state */
    toggleCollapse: () => void;
    /** Computed panel classes */
    panelClasses: string;
    /** Computed body classes */
    bodyClasses: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Panel ViewModel hook
 */
export function usePanel(options: UsePanelOptions = {}): UsePanelResult {
    const { onCollapseChange, ...modelData } = options;

    // Parse model options
    const modelOptions = useMemo(() => {
        return PanelModelSchema.parse({ ...defaultPanelModel, ...modelData });
    }, [modelData]);

    // Use base ViewModel
    const base = useBaseViewModel<PanelModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'panel',
    });

    // Local collapsed state
    const [isCollapsed, setIsCollapsed] = useState(base.model.collapsed);

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const toggleCollapse = useCallback(() => {
        if (!base.model.collapsible) return;

        const newState = !isCollapsed;
        setIsCollapsed(newState);
        base.emit('collapse', { id: base.model.id, collapsed: newState });
        onCollapseChange?.(newState);
    }, [base, isCollapsed, onCollapseChange]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED STYLES
    // ═══════════════════════════════════════════════════════════════════════

    const panelClasses = useMemo(() => {
        const classes = [
            'ark-panel',
            `ark-panel--${base.model.variant}`,
        ];
        if (isCollapsed) classes.push('ark-panel--collapsed');
        if (base.model.className) classes.push(base.model.className);
        return classes.join(' ');
    }, [base.model, isCollapsed]);

    const bodyClasses = useMemo(() => {
        return `ark-panel__body ark-panel__body--${base.model.padding}`;
    }, [base.model.padding]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        isCollapsed,
        toggleCollapse,
        panelClasses,
        bodyClasses,
    };
}

export default usePanel;
