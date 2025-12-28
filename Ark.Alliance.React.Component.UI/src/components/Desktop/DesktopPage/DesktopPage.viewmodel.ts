/**
 * @fileoverview DesktopPage Component ViewModel
 * @module components/Desktop/DesktopPage
 * 
 * Business logic for the desktop environment including window management,
 * icon positioning, cookie persistence, and theme handling.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { DesktopPageModel, IconPosition } from './DesktopPage.model';
import { defaultDesktopPageModel, DesktopPageModelSchema, THEME_PRESETS } from './DesktopPage.model';
import type { WindowState, AppConfig, Position, DesktopIconConfig } from '../types';
import { createWindowState } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// COOKIE UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number = 365): void {
    if (typeof document === 'undefined') return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DesktopPage ViewModel options
 */
export interface UseDesktopPageOptions extends Partial<DesktopPageModel> {
    /** Callback when app is opened */
    onAppOpen?: (appId: string, windowId: string) => void;

    /** Callback when window is closed */
    onWindowClose?: (windowId: string) => void;

    /** Callback when window is focused */
    onWindowFocus?: (windowId: string) => void;

    /** Callback when icon is moved */
    onIconMove?: (iconId: string, position: Position) => void;

    /** Callback when theme changes */
    onThemeChange?: (theme: string) => void;
}

/**
 * DesktopPage ViewModel result
 */
export interface UseDesktopPageResult extends BaseViewModelResult<DesktopPageModel> {
    /** Current open windows */
    windows: WindowState[];

    /** Currently active window ID */
    activeWindowId: string | null;

    /** Whether start menu is open */
    startMenuOpen: boolean;

    /** Icon positions map */
    iconPositions: Map<string, Position>;

    /** Open an application */
    openApp: (appId: string) => void;

    /** Close a window */
    closeWindow: (windowId: string) => void;

    /** Focus a window */
    focusWindow: (windowId: string) => void;

    /** Toggle minimize for a window */
    toggleMinimize: (windowId: string) => void;

    /** Toggle maximize for a window */
    toggleMaximize: (windowId: string) => void;

    /** Update window state */
    updateWindow: (windowId: string, updates: Partial<WindowState>) => void;

    /** Handle taskbar window click */
    handleTaskbarWindowClick: (windowId: string) => void;

    /** Toggle start menu */
    toggleStartMenu: () => void;

    /** Close start menu */
    closeStartMenu: () => void;

    /** Update icon position */
    updateIconPosition: (iconId: string, position: Position) => void;

    /** Get app config by ID */
    getAppConfig: (appId: string) => AppConfig | undefined;

    /** Background style */
    backgroundStyle: React.CSSProperties;

    /** Container classes */
    containerClasses: string;

    /** Content area classes */
    contentClasses: string;

    /** Is dark theme */
    isDarkTheme: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DesktopPage ViewModel hook
 */
export function useDesktopPage(options: UseDesktopPageOptions = {}): UseDesktopPageResult {
    const {
        onAppOpen,
        onWindowClose,
        onWindowFocus,
        onIconMove,
        onThemeChange,
        ...modelData
    } = options;

    // Parse model
    const modelOptions = useMemo(() => {
        return DesktopPageModelSchema.parse({ ...defaultDesktopPageModel, ...modelData });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(modelData)]);

    // Base ViewModel
    const base = useBaseViewModel<DesktopPageModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'desktop-page',
    });

    // ═══════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════

    const [windows, setWindows] = useState<WindowState[]>(modelOptions.windows);
    const [activeWindowId, setActiveWindowId] = useState<string | null>(modelOptions.activeWindowId);
    const [startMenuOpen, setStartMenuOpen] = useState(modelOptions.startMenuOpen);
    const [zIndexCounter, setZIndexCounter] = useState(modelOptions.zIndexCounter);
    const [iconPositions, setIconPositions] = useState<Map<string, Position>>(new Map());

    const desktopRef = useRef<HTMLDivElement>(null);

    // ═══════════════════════════════════════════════════════════════════════
    // COOKIE PERSISTENCE
    // ═══════════════════════════════════════════════════════════════════════

    // Load icon positions from cookies on mount
    useEffect(() => {
        if (!base.model.persistIconPositions) return;

        const savedPositions = getCookie(`${base.model.cookiePrefix}-icon-positions`);
        if (savedPositions) {
            try {
                const parsed: IconPosition[] = JSON.parse(savedPositions);
                const posMap = new Map<string, Position>();
                parsed.forEach(p => posMap.set(p.iconId, p.position));
                setIconPositions(posMap);
            } catch {
                // Invalid cookie data, ignore
            }
        }
    }, [base.model.persistIconPositions, base.model.cookiePrefix]);

    // Save icon positions to cookies when changed
    const saveIconPositions = useCallback((positions: Map<string, Position>) => {
        if (!base.model.persistIconPositions) return;

        const data: IconPosition[] = Array.from(positions.entries()).map(([iconId, position]) => ({
            iconId,
            position,
        }));
        setCookie(`${base.model.cookiePrefix}-icon-positions`, JSON.stringify(data));
    }, [base.model.persistIconPositions, base.model.cookiePrefix]);

    // ═══════════════════════════════════════════════════════════════════════
    // APP HELPERS
    // ═══════════════════════════════════════════════════════════════════════

    const getAppConfig = useCallback((appId: string): AppConfig | undefined => {
        return base.model.apps.find(a => a.id === appId);
    }, [base.model.apps]);

    // ═══════════════════════════════════════════════════════════════════════
    // WINDOW MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════

    const openApp = useCallback((appId: string) => {
        const appConfig = getAppConfig(appId);
        if (!appConfig) return;

        // Check singleton
        if (appConfig.singleton) {
            const existing = windows.find(w => w.appId === appId);
            if (existing) {
                focusWindow(existing.id);
                return;
            }
        }

        const newWindow = createWindowState({
            id: uuidv4(),
            appId,
            title: appConfig.title,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            zIndex: zIndexCounter + 1,
            position: { x: 50 + (windows.length * 20) % 200, y: 50 + (windows.length * 20) % 150 },
            size: { width: appConfig.defaultWidth, height: appConfig.defaultHeight },
        });

        setZIndexCounter(prev => prev + 1);
        setWindows(prev => [...prev, newWindow]);
        setActiveWindowId(newWindow.id);
        setStartMenuOpen(false);

        base.emit('appOpen', { appId, windowId: newWindow.id });
        onAppOpen?.(appId, newWindow.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getAppConfig, windows, zIndexCounter, base, onAppOpen]);

    const closeWindow = useCallback((windowId: string) => {
        setWindows(prev => prev.filter(w => w.id !== windowId));
        if (activeWindowId === windowId) {
            setActiveWindowId(null);
        }
        base.emit('windowClose', { windowId });
        onWindowClose?.(windowId);
    }, [activeWindowId, base, onWindowClose]);

    const updateWindow = useCallback((windowId: string, updates: Partial<WindowState>) => {
        setWindows(prev => prev.map(w =>
            w.id === windowId ? { ...w, ...updates } : w
        ));
    }, []);

    const focusWindow = useCallback((windowId: string) => {
        const win = windows.find(w => w.id === windowId);
        if (!win) return;

        const newZIndex = zIndexCounter + 1;

        if (win.isMinimized) {
            updateWindow(windowId, { isMinimized: false, zIndex: newZIndex });
        } else {
            updateWindow(windowId, { zIndex: newZIndex });
        }

        setZIndexCounter(newZIndex);
        setActiveWindowId(windowId);
        setStartMenuOpen(false);

        base.emit('windowFocus', { windowId });
        onWindowFocus?.(windowId);
    }, [windows, zIndexCounter, updateWindow, base, onWindowFocus]);

    const toggleMinimize = useCallback((windowId: string) => {
        const win = windows.find(w => w.id === windowId);
        if (!win) return;

        if (win.isMinimized) {
            focusWindow(windowId);
        } else {
            updateWindow(windowId, { isMinimized: true });
            setActiveWindowId(null);
        }
    }, [windows, focusWindow, updateWindow]);

    const toggleMaximize = useCallback((windowId: string) => {
        const win = windows.find(w => w.id === windowId);
        if (!win) return;
        updateWindow(windowId, { isMaximized: !win.isMaximized });
    }, [windows, updateWindow]);

    const handleTaskbarWindowClick = useCallback((windowId: string) => {
        const win = windows.find(w => w.id === windowId);
        if (!win) return;

        if (win.id === activeWindowId && !win.isMinimized) {
            toggleMinimize(windowId);
        } else {
            focusWindow(windowId);
        }
    }, [windows, activeWindowId, toggleMinimize, focusWindow]);

    // ═══════════════════════════════════════════════════════════════════════
    // START MENU
    // ═══════════════════════════════════════════════════════════════════════

    const toggleStartMenu = useCallback(() => {
        setStartMenuOpen(prev => !prev);
    }, []);

    const closeStartMenu = useCallback(() => {
        setStartMenuOpen(false);
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // ICON POSITIONING
    // ═══════════════════════════════════════════════════════════════════════

    const updateIconPosition = useCallback((iconId: string, position: Position) => {
        // Snap to grid if enabled
        let finalPosition = position;
        if (base.model.iconGridSize > 0) {
            finalPosition = {
                x: Math.round(position.x / base.model.iconGridSize) * base.model.iconGridSize,
                y: Math.round(position.y / base.model.iconGridSize) * base.model.iconGridSize,
            };
        }

        setIconPositions(prev => {
            const newMap = new Map(prev);
            newMap.set(iconId, finalPosition);
            saveIconPositions(newMap);
            return newMap;
        });

        base.emit('iconMove', { iconId, position: finalPosition });
        onIconMove?.(iconId, finalPosition);
    }, [base, saveIconPositions, onIconMove]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED STYLES
    // ═══════════════════════════════════════════════════════════════════════

    const isDarkTheme = base.model.theme === 'dark' || base.model.theme === 'neon';
    const themePreset = THEME_PRESETS[base.model.theme];
    const bgConfig = { ...themePreset, ...base.model.background };

    const backgroundStyle = useMemo((): React.CSSProperties => {
        const { type, color, gradientEndColor, imageUrl, showAnimation, overlayOpacity } = bgConfig;

        let background = '';

        if (type === 'image' && imageUrl) {
            background = `url(${imageUrl}) center/cover no-repeat`;
        } else if (type === 'gradient' && gradientEndColor) {
            background = `radial-gradient(circle at center, ${gradientEndColor} 0%, ${color} 100%)`;
        } else {
            background = color;
        }

        return {
            background,
            position: 'relative',
        };
    }, [bgConfig]);

    const containerClasses = useMemo(() => {
        const classes = [
            'ark-desktop-page',
            `ark-desktop-page--${base.model.theme}`,
            `ark-desktop-page--${base.model.visualMode}`,
        ];
        if (base.model.className) classes.push(base.model.className);
        return classes.join(' ');
    }, [base.model]);

    const contentClasses = useMemo(() => {
        return 'ark-desktop-page__content';
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        windows,
        activeWindowId,
        startMenuOpen,
        iconPositions,
        openApp,
        closeWindow,
        focusWindow,
        toggleMinimize,
        toggleMaximize,
        updateWindow,
        handleTaskbarWindowClick,
        toggleStartMenu,
        closeStartMenu,
        updateIconPosition,
        getAppConfig,
        backgroundStyle,
        containerClasses,
        contentClasses,
        isDarkTheme,
    };
}

export default useDesktopPage;
