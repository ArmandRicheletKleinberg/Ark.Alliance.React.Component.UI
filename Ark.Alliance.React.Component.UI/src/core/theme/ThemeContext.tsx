/**
 * @fileoverview Theme Context
 * @module core/theme/ThemeContext
 * 
 * Defines the context for the theming system.
 */

import { createContext } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeVariant = 'default' | 'aloevera' | string;

export interface ThemeContextProps {
    /** Current theme mode (light/dark/system) */
    mode: ThemeMode;
    /** Current theme variant (default/aloevera/etc) */
    variant: ThemeVariant;
    /** Effective resolved mode (light/dark) */
    resolvedMode: 'light' | 'dark';
    /** Set theme mode */
    setMode: (mode: ThemeMode) => void;
    /** Set theme variant */
    setVariant: (variant: ThemeVariant) => void;
    /** Toggle between light and dark */
    toggleMode: () => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
