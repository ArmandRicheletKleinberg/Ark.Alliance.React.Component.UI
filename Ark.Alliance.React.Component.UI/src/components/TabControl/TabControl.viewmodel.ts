/**
 * @fileoverview TabControl Component ViewModel
 * @module components/TabControl
 * 
 * Business logic and state management for the TabControl.
 * Provides keyboard navigation, tab management, and ARIA support.
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import { useTheme } from '../../core/theme/useTheme';
import {
    TabControlModelSchema,
    type TabControlModel,
    type TabItemModel,
    defaultTabControlModel,
} from './TabControl.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TabControl ViewModel options
 */
export interface UseTabControlOptions extends Partial<TabControlModel> {
    /** Callback when active tab changes */
    onTabChange?: (tabKey: string) => void;
    /** Callback when a tab is closed */
    onTabClose?: (tabKey: string) => void;
    /** Controlled active tabKey */
    activeKey?: string;
}

/**
 * TabControl ViewModel result
 */
export interface UseTabControlResult extends BaseViewModelResult<TabControlModel> {
    /** Current active tab tabKey */
    activeKey: string | undefined;
    /** Active tab index */
    activeIndex: number;
    /** Set active tab */
    setActiveTab: (tabKey: string) => void;
    /** Close a tab */
    closeTab: (tabKey: string) => void;
    /** Add a new tab */
    addTab: (tab: TabItemModel) => void;
    /** Remove a tab */
    removeTab: (tabKey: string) => void;
    /** Handle keyboard navigation */
    handleKeyDown: (event: React.KeyboardEvent, currentIndex: number) => void;
    /** Get tab ref for focus management */
    getTabRef: (tabKey: string) => React.RefObject<HTMLButtonElement> | undefined;
    /** Get ARIA props for a tab */
    getTabAriaProps: (tab: TabItemModel, index: number) => Record<string, string | boolean | number>;
    /** Get ARIA props for tab panel */
    getPanelAriaProps: (tabKey: string) => Record<string, string | boolean>;
    /** Container CSS classes */
    containerClasses: string;
    /** Tablist CSS classes */
    tablistClasses: string;
    /** Enabled tabs (non-disabled) */
    enabledTabs: TabItemModel[];
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TabControl ViewModel hook
 * 
 * @example
 * ```tsx
 * const tabs = useTabControl({
 *   items: [
 *     { tabKey: 'overview', label: 'Overview', icon: 'home' },
 *     { tabKey: 'settings', label: 'Settings', icon: 'cog' },
 *   ],
 *   defaultActiveKey: 'overview',
 *   variant: 'pills',
 *   onTabChange: (tabKey) => console.log('Tab changed:', tabKey),
 * });
 * ```
 */
export function useTabControl(options: UseTabControlOptions = {}): UseTabControlResult {
    const {
        onTabChange,
        onTabClose,
        activeKey: controlledActiveKey,
        ...modelOptions
    } = options;

    // Parse model with defaults
    const parsedModel = useMemo(
        () => TabControlModelSchema.parse({ ...defaultTabControlModel, ...modelOptions }),
        [JSON.stringify(modelOptions)]
    );

    // Base ViewModel
    const base = useBaseViewModel<TabControlModel>(parsedModel, {});

    // Tab refs for focus management
    const tabRefs = useRef<Map<string, React.RefObject<HTMLButtonElement>>>(new Map());

    const { resolvedMode } = useTheme();
    const isDark = base.model.isDark !== undefined ? base.model.isDark : resolvedMode === 'dark';

    // Internal state (uncontrolled mode)
    const [internalActiveKey, setInternalActiveKey] = useState<string | undefined>(
        controlledActiveKey || base.model.defaultActiveKey || base.model.items[0]?.tabKey
    );

    // Determine active tabKey (controlled vs uncontrolled)
    const activeKey = controlledActiveKey ?? internalActiveKey;

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED
    // ═══════════════════════════════════════════════════════════════════════

    const activeIndex = useMemo(() => {
        const idx = base.model.items.findIndex(t => t.tabKey === activeKey);
        return idx >= 0 ? idx : 0;
    }, [base.model.items, activeKey]);

    const enabledTabs = useMemo(
        () => base.model.items.filter(t => !t.disabled),
        [base.model.items]
    );

    const containerClasses = useMemo(() => {
        const classes = ['ark-tab-control'];
        classes.push(`ark-tab-control--${base.model.variant}`);
        classes.push(`ark-tab-control--${base.model.orientation}`);
        classes.push(`ark-tab-control--${base.model.size}`);
        if (base.model.fill) classes.push('ark-tab-control--fill');
        if (base.model.scrollable) classes.push('ark-tab-control--scrollable');
        if (isDark) classes.push('ark-tab-control--dark');
        if (base.model.className) classes.push(base.model.className);
        return classes.join(' ');
    }, [base.model.variant, base.model.orientation, base.model.size, base.model.fill, base.model.scrollable, isDark, base.model.className]);

    const tablistClasses = useMemo(() => {
        const classes = ['ark-tab-control__list'];
        classes.push(`ark-tab-control__list--${base.model.alignment}`);
        return classes.join(' ');
    }, [base.model.alignment]);

    // ═══════════════════════════════════════════════════════════════════════
    // TAB MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════

    const setActiveTab = useCallback((tabKey: string) => {
        const tab = base.model.items.find(t => t.tabKey === tabKey);
        if (tab && !tab.disabled) {
            setInternalActiveKey(tabKey);
            onTabChange?.(tabKey);
        }
    }, [base.model.items, onTabChange]);

    const closeTab = useCallback((tabKey: string) => {
        onTabClose?.(tabKey);

        // If closing active tab, switch to adjacent tab
        if (tabKey === activeKey) {
            const currentIndex = base.model.items.findIndex(t => t.tabKey === tabKey);
            const remainingTabs = base.model.items.filter(t => t.tabKey !== tabKey && !t.disabled);

            if (remainingTabs.length > 0) {
                // Prefer next tab, fallback to previous
                const nextTab = remainingTabs[Math.min(currentIndex, remainingTabs.length - 1)];
                setActiveTab(nextTab.tabKey);
            }
        }
    }, [activeKey, base.model.items, onTabClose, setActiveTab]);

    const addTab = useCallback((tab: TabItemModel) => {
        base.updateModel({
            items: [...base.model.items, tab],
        });
    }, [base]);

    const removeTab = useCallback((tabKey: string) => {
        base.updateModel({
            items: base.model.items.filter(t => t.tabKey !== tabKey),
        });
    }, [base]);

    // ═══════════════════════════════════════════════════════════════════════
    // KEYBOARD NAVIGATION
    // ═══════════════════════════════════════════════════════════════════════

    const handleKeyDown = useCallback((event: React.KeyboardEvent, currentIndex: number) => {
        const isHorizontal = base.model.orientation === 'horizontal';
        const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
        const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

        let newIndex = -1;
        const enabledIndices = base.model.items
            .map((t, i) => ({ tab: t, index: i }))
            .filter(({ tab }) => !tab.disabled);

        const currentEnabledIndex = enabledIndices.findIndex(
            ({ index }) => index === currentIndex
        );

        switch (event.key) { // Use event.key for keyboard key codes (NOT event.tabKey)
            case prevKey:
                event.preventDefault();
                newIndex = currentEnabledIndex > 0
                    ? enabledIndices[currentEnabledIndex - 1].index
                    : enabledIndices[enabledIndices.length - 1].index;
                break;

            case nextKey:
                event.preventDefault();
                newIndex = currentEnabledIndex < enabledIndices.length - 1
                    ? enabledIndices[currentEnabledIndex + 1].index
                    : enabledIndices[0].index;
                break;

            case 'Home':
                event.preventDefault();
                newIndex = enabledIndices[0]?.index ?? 0;
                break;

            case 'End':
                event.preventDefault();
                newIndex = enabledIndices[enabledIndices.length - 1]?.index ?? 0;
                break;

            case 'Enter':
            case ' ':
                event.preventDefault();
                setActiveTab(base.model.items[currentIndex].tabKey);
                return;

            default:
                return;
        }

        if (newIndex >= 0 && base.model.items[newIndex]) {
            const newTab = base.model.items[newIndex];
            setActiveTab(newTab.tabKey);

            // Focus the new tab
            const ref = tabRefs.current.get(newTab.tabKey);
            ref?.current?.focus();
        }
    }, [base.model.items, base.model.orientation, setActiveTab]);

    // ═══════════════════════════════════════════════════════════════════════
    // REF MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════

    const getTabRef = useCallback((tabKey: string) => {
        if (!tabRefs.current.has(tabKey)) {
            tabRefs.current.set(tabKey, { current: null } as React.RefObject<HTMLButtonElement>);
        }
        return tabRefs.current.get(tabKey);
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // ARIA
    // ═══════════════════════════════════════════════════════════════════════

    const getTabAriaProps = useCallback((tab: TabItemModel, index: number): Record<string, string | boolean | number> => {
        const isActive = tab.tabKey === activeKey;
        return {
            'role': 'tab',
            'id': `ark-tab-${tab.tabKey}`,
            'aria-selected': isActive,
            'aria-disabled': tab.disabled || false,
            'aria-controls': `ark-tabpanel-${tab.tabKey}`,
            'tabIndex': isActive ? 0 : -1,
        };
    }, [activeKey]);

    const getPanelAriaProps = useCallback((tabKey: string): Record<string, string | boolean> => {
        const isActive = tabKey === activeKey;
        return {
            'role': 'tabpanel',
            'id': `ark-tabpanel-${tabKey}`,
            'aria-labelledby': `ark-tab-${tabKey}`,
            'hidden': !isActive,
        };
    }, [activeKey]);

    // Initialize default active key
    if (!activeKey && base.model.items.length > 0) {
        // Find first non-disabled tab
        const firstTab = base.model.items.find(t => !t.disabled) || base.model.items[0];
        if (firstTab) {
            setInternalActiveKey(firstTab.tabKey);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        activeKey,
        activeIndex,
        setActiveTab,
        closeTab,
        addTab,
        removeTab,
        handleKeyDown,
        getTabRef,
        getTabAriaProps,
        getPanelAriaProps,
        containerClasses,
        tablistClasses,
        enabledTabs,
    };
}

export default useTabControl;
