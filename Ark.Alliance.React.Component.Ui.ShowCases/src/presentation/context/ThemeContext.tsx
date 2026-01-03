import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Visual themes for the application
 */
export type ThemeMode = 'normal' | 'neon' | 'minimal' | 'glass';

interface ThemeContextType {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Default to 'neon' for that cyber-futuristic start
    const [mode, setMode] = useState<ThemeMode>('neon');

    useEffect(() => {
        // Apply theme class to document body or root for global styling hooks
        const root = document.documentElement;

        // Remove old classes
        root.classList.remove('theme-normal', 'theme-neon', 'theme-minimal', 'theme-glass');

        // Add new class
        root.classList.add(`theme-${mode}`);

        // Optionally update CSS variables directly if needed for specialized glares
        if (mode === 'neon') {
            root.style.setProperty('--shadow-ark-glow', '0 0 12px rgba(0, 212, 255, 0.6)');
        } else {
            root.style.removeProperty('--shadow-ark-glow');
        }

    }, [mode]);

    return (
        <ThemeContext.Provider value={{ mode, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
