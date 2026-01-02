/**
 * @fileoverview Theme System Tests
 * @module tests/core/theme
 */

import React from 'react';
import { render, screen, act, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ThemeProvider, useTheme, ThemeContextProps } from '@core/theme';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

describe('ThemeProvider', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.removeAttribute('data-theme');
        document.documentElement.removeAttribute('data-variant');
        document.documentElement.className = '';
    });

    it('should render children', () => {
        render(
            <ThemeProvider>
                <div data-testid="child">Child Content</div>
            </ThemeProvider>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should provide default context values', () => {
        let themeContext: ThemeContextProps | undefined;

        function TestComponent() {
            themeContext = useTheme();
            return null;
        }

        render(
            <ThemeProvider defaultMode="light" defaultVariant="default">
                <TestComponent />
            </ThemeProvider>
        );

        expect(themeContext).toBeDefined();
        expect(themeContext?.mode).toBe('light');
        expect(themeContext?.variant).toBe('default');
    });

    it('should update DOM attributes on mode change', () => {
        const { result } = renderHook(() => useTheme(), {
            wrapper: ThemeProvider,
        });

        act(() => {
            result.current.setMode('dark');
        });

        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(document.documentElement.style.colorScheme).toBe('dark');
    });

    it('should update DOM classes on variant change', () => {
        const { result } = renderHook(() => useTheme(), {
            wrapper: ThemeProvider,
        });

        act(() => {
            result.current.setVariant('aloevera');
        });

        expect(document.documentElement.classList.contains('theme-aloevera')).toBe(true);
        expect(document.documentElement.getAttribute('data-variant')).toBe('aloevera');
    });

    it('should toggle mode correctly', () => {
        const { result } = renderHook(() => useTheme(), {
            wrapper: ({ children }) => <ThemeProvider defaultMode="light">{children}</ThemeProvider>,
        });

        act(() => {
            result.current.toggleMode();
        });

        expect(result.current.mode).toBe('dark');

        act(() => {
            result.current.toggleMode();
        });

        expect(result.current.mode).toBe('light');
    });

    it('should persist preferences to localStorage', () => {
        const { result } = renderHook(() => useTheme(), {
            wrapper: ({ children }) => <ThemeProvider storageKey="test-theme">{children}</ThemeProvider>,
        });

        act(() => {
            result.current.setMode('dark');
            result.current.setVariant('custom');
        });

        expect(localStorage.getItem('test-theme-mode')).toBe('dark');
        expect(localStorage.getItem('test-theme-variant')).toBe('custom');
    });
});

describe('useTheme Hook', () => {
    it('should throw error if used outside provider', () => {
        // Suppress console.error for expected error
        const consoleError = console.error;
        console.error = vi.fn();

        expect(() => {
            renderHook(() => useTheme());
        }).toThrow('useTheme must be used within a ThemeProvider');

        console.error = consoleError;
    });
});
