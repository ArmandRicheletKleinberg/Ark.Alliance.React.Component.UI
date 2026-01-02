/**
 * @fileoverview Theme Provider
 * @module core/theme/ThemeProvider
 * 
 * Manages theme state and applies CSS variables/classes to the document.
 */

import React, { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { ThemeContext, type ThemeMode, type ThemeVariant } from './ThemeContext';
import './tokens.css';

export interface ThemeProviderProps {
    children: ReactNode;
    /** Initial theme mode */
    defaultMode?: ThemeMode;
    /** Initial theme variant */
    defaultVariant?: ThemeVariant;
    /** Storage key for persisting theme preferences */
    storageKey?: string;
    /** Root element to apply theme classes to (defaults to document.documentElement) */
    rootElement?: HTMLElement;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultMode = 'system',
    defaultVariant = 'default',
    storageKey = 'ark-ui-theme',
    rootElement
}) => {
    // ═══════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════

    const [mode, setModeState] = useState<ThemeMode>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(`${storageKey}-mode`);
            return (stored as ThemeMode) || defaultMode;
        }
        return defaultMode;
    });

    const [variant, setVariantState] = useState<ThemeVariant>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(`${storageKey}-variant`);
            return (stored as ThemeVariant) || defaultVariant;
        }
        return defaultVariant;
    });

    const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light');

    // ═══════════════════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════════════════

    const getSystemTheme = useCallback((): 'light' | 'dark' => {
        if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light'; // Fallback
    }, []);

    const updateDOM = useCallback((currentMode: 'light' | 'dark', currentVariant: ThemeVariant) => {
        const root = rootElement || document.documentElement;

        // Update styling attributes
        root.setAttribute('data-theme', currentMode);
        root.setAttribute('data-variant', currentVariant);
        root.style.colorScheme = currentMode;

        // Apply variant class (e.g. theme-aloevera)
        const oldClasses = Array.from(root.classList).filter(c => c.startsWith('theme-'));
        root.classList.remove(...oldClasses);

        if (currentVariant !== 'default') {
            root.classList.add(`theme-${currentVariant}`);
            // Also set attribute for easier CSS selection
            root.setAttribute('data-theme', currentVariant); // This actually overrides the mode attribute in some setups, let's be careful
            // Actually, better convention is: data-theme="dark" data-variant="aloevera"
            root.setAttribute('data-variant', currentVariant);

            // Special handling - some themes might need to set data-theme to the variant name itself if that's how CSS is written
            // Our tokens.css uses [data-theme='aloevera'], so:
            if (currentVariant !== 'default') {
                root.setAttribute('data-theme', currentVariant);
            } else {
                root.setAttribute('data-theme', currentMode);
            }
        } else {
            root.setAttribute('data-theme', currentMode);
        }

    }, [rootElement]);

    // ═══════════════════════════════════════════════════════════════════════
    // EFFECTS
    // ═══════════════════════════════════════════════════════════════════════

    // Resolve system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (mode === 'system') {
                const newResolved = getSystemTheme();
                setResolvedMode(newResolved);
                updateDOM(newResolved, variant);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [mode, variant, getSystemTheme, updateDOM]);

    // Apply theme changes
    useEffect(() => {
        const sys = getSystemTheme();
        const finalMode = mode === 'system' ? sys : mode;
        setResolvedMode(finalMode);
        updateDOM(finalMode, variant);

        // Persist
        localStorage.setItem(`${storageKey}-mode`, mode);
        localStorage.setItem(`${storageKey}-variant`, variant);
    }, [mode, variant, storageKey, getSystemTheme, updateDOM]);

    // ═══════════════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const setMode = useCallback((newMode: ThemeMode) => {
        setModeState(newMode);
    }, []);

    const setVariant = useCallback((newVariant: ThemeVariant) => {
        setVariantState(newVariant);
    }, []);

    const toggleMode = useCallback(() => {
        setModeState(prev => {
            if (prev === 'light') return 'dark';
            if (prev === 'dark') return 'light';
            // If system, switch to opposite of resolved
            return resolvedMode === 'light' ? 'dark' : 'light';
        });
    }, [resolvedMode]);

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════════

    const value = useMemo(() => ({
        mode,
        variant,
        resolvedMode,
        setMode,
        setVariant,
        toggleMode
    }), [mode, variant, resolvedMode, setMode, setVariant, toggleMode]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
