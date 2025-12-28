/**
 * @fileoverview StartMenu Component ViewModel
 * @module components/Desktop/StartMenu
 * 
 * Business logic and state management for the StartMenu component.
 */

import { useCallback, useMemo, useState } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { StartMenuModel, StartMenuApp } from './StartMenu.model';
import { defaultStartMenuModel, StartMenuModelSchema } from './StartMenu.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * StartMenu ViewModel options
 */
export interface UseStartMenuOptions extends Partial<StartMenuModel> {
    /** Callback when an app is clicked */
    onAppClick?: (appId: string) => void;

    /** Callback when menu is closed */
    onClose?: () => void;

    /** Callback when settings is clicked */
    onSettingsClick?: () => void;

    /** Callback when power button is clicked */
    onPowerClick?: () => void;

    /** Callback when user profile is clicked */
    onUserProfileClick?: () => void;
}

/**
 * StartMenu ViewModel return type
 */
export interface UseStartMenuResult extends BaseViewModelResult<StartMenuModel> {
    /** Filtered apps based on search */
    filteredApps: StartMenuApp[];

    /** Pinned apps */
    pinnedApps: StartMenuApp[];

    /** Handle app click */
    handleAppClick: (appId: string) => void;

    /** Handle search change */
    handleSearchChange: (query: string) => void;

    /** Handle settings click */
    handleSettingsClick: () => void;

    /** Handle power click */
    handlePowerClick: () => void;

    /** Handle user profile click */
    handleUserProfileClick: () => void;

    /** Handle close */
    handleClose: () => void;

    /** Computed container classes */
    containerClasses: string;

    /** Computed container style */
    containerStyle: React.CSSProperties;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * StartMenu ViewModel hook
 */
export function useStartMenu(options: UseStartMenuOptions = {}): UseStartMenuResult {
    const {
        onAppClick,
        onClose,
        onSettingsClick,
        onPowerClick,
        onUserProfileClick,
        ...modelData
    } = options;

    // Parse model options
    const modelOptions = useMemo(() => {
        return StartMenuModelSchema.parse({ ...defaultStartMenuModel, ...modelData });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(modelData)]);

    // Use base ViewModel
    const base = useBaseViewModel<StartMenuModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'start-menu',
    });

    // Local search state
    const [searchQuery, setSearchQuery] = useState(modelOptions.searchQuery);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════════════

    const filteredApps = useMemo(() => {
        if (!searchQuery.trim()) {
            return base.model.apps;
        }
        const query = searchQuery.toLowerCase();
        return base.model.apps.filter(app =>
            app.title.toLowerCase().includes(query) ||
            app.category?.toLowerCase().includes(query)
        );
    }, [base.model.apps, searchQuery]);

    const pinnedApps = useMemo(() => {
        return base.model.apps.filter(app => app.pinned);
    }, [base.model.apps]);

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleAppClick = useCallback((appId: string) => {
        base.emit('appClick', { id: base.model.id, appId });
        onAppClick?.(appId);
        onClose?.();
    }, [base, onAppClick, onClose]);

    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query);
        base.emit('search', { id: base.model.id, query });
    }, [base]);

    const handleSettingsClick = useCallback(() => {
        base.emit('settingsClick', { id: base.model.id });
        onSettingsClick?.();
    }, [base, onSettingsClick]);

    const handlePowerClick = useCallback(() => {
        base.emit('powerClick', { id: base.model.id });
        onPowerClick?.();
    }, [base, onPowerClick]);

    const handleUserProfileClick = useCallback(() => {
        base.emit('userProfileClick', { id: base.model.id });
        onUserProfileClick?.();
    }, [base, onUserProfileClick]);

    const handleClose = useCallback(() => {
        base.emit('close', { id: base.model.id });
        onClose?.();
    }, [base, onClose]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED STYLES
    // ═══════════════════════════════════════════════════════════════════════

    const containerClasses = useMemo(() => {
        const classes = [
            'ark-start-menu',
            `ark-start-menu--${base.model.visualMode}`,
        ];
        if (base.model.isOpen) classes.push('ark-start-menu--open');
        if (base.model.className) classes.push(base.model.className);
        return classes.join(' ');
    }, [base.model]);

    const containerStyle = useMemo((): React.CSSProperties => {
        return {
            width: base.model.width,
            height: base.model.height,
            ...(base.model.style || {}),
        };
    }, [base.model.width, base.model.height, base.model.style]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        filteredApps,
        pinnedApps,
        handleAppClick,
        handleSearchChange,
        handleSettingsClick,
        handlePowerClick,
        handleUserProfileClick,
        handleClose,
        containerClasses,
        containerStyle,
    };
}

export default useStartMenu;
