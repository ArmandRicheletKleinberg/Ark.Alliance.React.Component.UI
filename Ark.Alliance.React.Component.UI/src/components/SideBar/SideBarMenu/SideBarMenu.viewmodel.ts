/**
 * @fileoverview SideBarMenu Component ViewModel
 * @module components/SideBar/SideBarMenu
 * 
 * Business logic for sidebar menu navigation.
 */

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { SideBarMenuModel, MenuCategory, MenuItem } from './SideBarMenu.model';
import {
    defaultSideBarMenuModel,
    SideBarMenuModelSchema,
} from './SideBarMenu.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseSideBarMenuOptions extends Partial<SideBarMenuModel> {
    /** Menu categories */
    categories: MenuCategory[];
    /** Active item key */
    activeKey?: string;
    /** On item select callback */
    onSelect?: (key: string, item: MenuItem) => void;
    /** On collapse toggle callback */
    onCollapseChange?: (collapsed: boolean) => void;
}

export interface UseSideBarMenuResult extends BaseViewModelResult<SideBarMenuModel> {
    /** Current collapsed state */
    isCollapsed: boolean;
    /** Toggle collapse */
    toggleCollapse: () => void;
    /** Set collapse state */
    setCollapsed: (collapsed: boolean) => void;
    /** Expanded categories */
    expandedCategories: Record<string, boolean>;
    /** Toggle category expansion */
    toggleCategory: (name: string) => void;
    /** Current active key */
    activeKey: string | null;
    /** Set active item */
    setActiveKey: (key: string) => void;
    /** Handle item click */
    handleItemClick: (key: string, item: MenuItem) => void;
    /** Handle mobile overlay close */
    closeMobile: () => void;
    /** Is mobile viewport */
    isMobile: boolean;
    /** Should show mobile overlay */
    showMobileOverlay: boolean;
    /** Computed sidebar styles */
    sidebarStyles: React.CSSProperties;
    /** Variant class */
    variantClass: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useSideBarMenu(options: UseSideBarMenuOptions): UseSideBarMenuResult {
    const {
        activeKey: initialActiveKey,
        onSelect,
        onCollapseChange,
        ...modelData
    } = options;

    // Parse model with JSON.stringify for proper dependency tracking
    const modelOptions = useMemo(() => {
        return SideBarMenuModelSchema.parse({ ...defaultSideBarMenuModel, ...modelData });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(modelData)]);

    // Base ViewModel
    const base = useBaseViewModel<SideBarMenuModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'sidebar',
    });

    // Local state
    const [isCollapsed, setIsCollapsed] = useState(modelOptions.collapsed);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [activeKey, setActiveKey] = useState<string | null>(initialActiveKey ?? null);
    const [isMobile, setIsMobile] = useState(false);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const toggleCollapse = useCallback(() => {
        setIsCollapsed((prev: boolean) => {
            const next = !prev;
            onCollapseChange?.(next);
            base.emit('collapse:toggle', { collapsed: next });
            return next;
        });
    }, [base, onCollapseChange]);

    const setCollapsed = useCallback((collapsed: boolean) => {
        setIsCollapsed(collapsed);
        onCollapseChange?.(collapsed);
    }, [onCollapseChange]);

    const toggleCategory = useCallback((name: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [name]: !prev[name],
        }));
    }, []);

    const handleItemClick = useCallback((key: string, item: MenuItem) => {
        if (item.disabled) return;
        setActiveKey(key);
        onSelect?.(key, item);
        base.emit('item:select', { key, item });

        // Auto-collapse on mobile when item is selected
        if (isMobile && base.model.mobileOverlay) {
            setIsCollapsed(true);
        }
    }, [base, onSelect, isMobile]);

    const closeMobile = useCallback(() => {
        if (isMobile && base.model.mobileOverlay) {
            setIsCollapsed(true);
        }
    }, [isMobile, base.model.mobileOverlay]);

    // Computed
    const showMobileOverlay = useMemo(() => {
        return isMobile && base.model.mobileOverlay && !isCollapsed;
    }, [isMobile, base.model.mobileOverlay, isCollapsed]);

    const sidebarStyles = useMemo((): React.CSSProperties => ({
        width: isCollapsed ? base.model.collapsedWidth : base.model.expandedWidth,
        [base.model.position]: 0,
    }), [isCollapsed, base.model]);

    const variantClass = useMemo(() => {
        return `ark-sidebar--${base.model.variant} ${base.model.isDark ? 'ark-sidebar--dark' : 'ark-sidebar--light'}`;
    }, [base.model.variant, base.model.isDark]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        isCollapsed,
        toggleCollapse,
        setCollapsed,
        expandedCategories,
        toggleCategory,
        activeKey,
        setActiveKey,
        handleItemClick,
        closeMobile,
        isMobile,
        showMobileOverlay,
        sidebarStyles,
        variantClass,
    };
}

export default useSideBarMenu;
