/**
 * @fileoverview useTheme Hook
 * @module core/theme/useTheme
 * 
 * Hook to consume theme context.
 */

import { useContext } from 'react';
import { ThemeContext, type ThemeContextProps } from './ThemeContext';

/**
 * Hook to access the current theme context
 * @throws Error if used outside of ThemeProvider
 */
export function useTheme(): ThemeContextProps {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
