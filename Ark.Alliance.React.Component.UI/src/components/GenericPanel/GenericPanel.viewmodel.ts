/**
 * @fileoverview GenericPanel Component ViewModel
 * @module components/GenericPanel
 * 
 * Business logic and state management for the GenericPanel component.
 * Handles dynamic styling, collapse state, and CSS variable generation.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import type { GenericPanelModel } from './GenericPanel.model';
import { defaultGenericPanelModel, GenericPanelModelSchema } from './GenericPanel.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GenericPanel ViewModel options
 */
export interface UseGenericPanelOptions extends Partial<GenericPanelModel> {
    /** Callback when collapse state changes */
    onCollapseChange?: (collapsed: boolean) => void;
}

/**
 * GenericPanel ViewModel return type
 */
export interface UseGenericPanelResult extends BaseViewModelResult<GenericPanelModel> {
    /** Current collapsed state */
    isCollapsed: boolean;
    /** Toggle collapsed state */
    toggleCollapse: () => void;
    /** Computed panel classes */
    panelClasses: string;
    /** Computed body classes */
    bodyClasses: string;
    /** Dynamic inline styles */
    dynamicStyles: React.CSSProperties;
    /** CSS variables for theming */
    cssVariables: Record<string, string>;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GenericPanel ViewModel hook
 */
export function useGenericPanel(options: UseGenericPanelOptions = {}): UseGenericPanelResult {
    const { onCollapseChange, ...modelData } = options;

    // Parse model options with proper dependency tracking
    // Use safeParse to gracefully handle invalid values from showcase controls
    const modelOptions = useMemo(() => {
        const merged = { ...defaultGenericPanelModel, ...modelData };
        const result = GenericPanelModelSchema.safeParse(merged);
        if (result.success) {
            return result.data;
        }
        // On validation error, clamp values to valid ranges and retry
        console.warn('[GenericPanel] Validation warning, using defaults:', result.error.issues);
        return defaultGenericPanelModel;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(modelData)]);

    // Use base ViewModel
    const base = useBaseViewModel<GenericPanelModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'generic-panel',
    });

    // Local collapsed state
    const [isCollapsed, setIsCollapsed] = useState(modelOptions.collapsed);

    // Sync collapsed state when prop changes from parent
    useEffect(() => {
        setIsCollapsed(modelOptions.collapsed);
    }, [modelOptions.collapsed]);

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
    // COMPUTED CSS VARIABLES
    // ═══════════════════════════════════════════════════════════════════════

    const cssVariables = useMemo((): Record<string, string> => {
        const vars: Record<string, string> = {};
        const m = base.model;

        // Theme variables
        if (m.accentColor) vars['--ark-gp-accent'] = m.accentColor;
        if (m.textColor) vars['--ark-gp-text'] = m.textColor;
        if (m.gridColor) vars['--ark-gp-grid-color'] = m.gridColor;
        if (m.glowColor) vars['--ark-gp-glow-color'] = m.glowColor;

        // Numeric variables
        vars['--ark-gp-border-radius'] = `${m.borderRadius}px`;
        vars['--ark-gp-shadow-intensity'] = `${m.shadowIntensity}px`;
        vars['--ark-gp-opacity'] = `${m.opacity / 100}`;
        vars['--ark-gp-grid-size'] = `${m.gridSize}px`;

        // Glass blur
        if (m.glassBlur > 0) {
            vars['--ark-gp-blur'] = `${m.glassBlur}px`;
        }

        // Sidebar width
        if (m.layout === 'sidebar-left' || m.layout === 'sidebar-right') {
            vars['--ark-gp-sidebar-width'] = `${m.sidebarWidth}px`;
        }

        return vars;
    }, [base.model]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED DYNAMIC STYLES
    // ═══════════════════════════════════════════════════════════════════════

    const dynamicStyles = useMemo((): React.CSSProperties => {
        const m = base.model;
        const styles: React.CSSProperties = {
            borderRadius: `${m.borderRadius}px`,
            opacity: m.opacity / 100,
        };

        // Shadow
        if (m.shadowIntensity > 0) {
            styles.boxShadow = `0 ${Math.round(m.shadowIntensity / 5)}px ${m.shadowIntensity}px rgba(0,0,0,0.5)`;
        }

        // Glass blur
        if (m.glassBlur > 0) {
            styles.backdropFilter = `blur(${m.glassBlur}px)`;
            styles.WebkitBackdropFilter = `blur(${m.glassBlur}px)`;
        }

        // Background
        if (m.backgroundImage) {
            styles.background = `url(${m.backgroundImage}) center/cover no-repeat`;
        } else if (m.useGradient && m.gradientStart && m.gradientEnd) {
            styles.background = `linear-gradient(${m.gradientDirection}deg, ${m.gradientStart}, ${m.gradientEnd})`;
        }

        // Text color
        if (m.textColor) {
            styles.color = m.textColor;
        }

        // Height constraints
        if (m.minHeight) styles.minHeight = `${m.minHeight}px`;
        if (m.maxHeight) styles.maxHeight = `${m.maxHeight}px`;

        // Sidebar layout
        if (m.layout === 'sidebar-left' || m.layout === 'sidebar-right') {
            styles.width = `${m.sidebarWidth}px`;
            styles.height = '100%';
        } else if (m.layout === 'fullscreen') {
            styles.width = '100%';
            styles.height = '100vh';
        }

        return styles;
    }, [base.model]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED CLASSES
    // ═══════════════════════════════════════════════════════════════════════

    const panelClasses = useMemo(() => {
        const m = base.model;
        const classes = [
            'ark-generic-panel',
            `ark-generic-panel--${m.variant}`,
            `ark-generic-panel--${m.layout}`,
        ];

        if (isCollapsed) classes.push('ark-generic-panel--collapsed');
        if (m.showGrid) classes.push('ark-generic-panel--with-grid');
        if (m.showGlow) classes.push('ark-generic-panel--with-glow');
        if (m.scrollable) classes.push('ark-generic-panel--scrollable');
        if (m.glassBlur > 0) classes.push('ark-generic-panel--glass-effect');
        if (m.className) classes.push(m.className);

        return classes.join(' ');
    }, [base.model, isCollapsed]);

    const bodyClasses = useMemo(() => {
        return `ark-generic-panel__body ark-generic-panel__body--${base.model.padding}`;
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
        dynamicStyles,
        cssVariables,
    };
}

export default useGenericPanel;
