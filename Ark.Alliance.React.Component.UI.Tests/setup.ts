/**
 * @fileoverview Test Setup
 * @module Ark.Alliance.React.Component.UI.Tests
 * 
 * Global test setup for Vitest with React Testing Library.
 * Provides wrapped render utilities with all required providers.
 */

import '@testing-library/jest-dom/vitest';
import { cleanup, render, renderHook, RenderOptions, RenderHookOptions } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import React, { ReactElement, ReactNode } from 'react';
import { ThemeProvider } from '@core/theme';

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL PROVIDERS WRAPPER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * AllProviders - Wraps components with all required context providers
 * Add additional providers here as needed (e.g., I18nProvider, AuthProvider)
 */
const AllProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
    return React.createElement(ThemeProvider, null, children);
};

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOM RENDER UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Custom render function that wraps the UI with all required providers.
 * Use this instead of @testing-library/react's render for component tests.
 * 
 * @example
 * import { renderWithProviders } from '../setup';
 * const { getByText } = renderWithProviders(<MyComponent />);
 */
export function renderWithProviders(
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) {
    return render(ui, { wrapper: AllProviders, ...options });
}

/**
 * Custom renderHook function that wraps hooks with all required providers.
 * Use this for testing hooks that depend on context (e.g., useTheme).
 * 
 * @example
 * import { renderHookWithProviders } from '../setup';
 * const { result } = renderHookWithProviders(() => useMyHook());
 */
export function renderHookWithProviders<TResult, TProps>(
    hook: (props: TProps) => TResult,
    options?: Omit<RenderHookOptions<TProps>, 'wrapper'>
) {
    return renderHook(hook, { wrapper: AllProviders, ...options });
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST CLEANUP
// ═══════════════════════════════════════════════════════════════════════════

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock ResizeObserver
class ResizeObserverMock {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
}

window.ResizeObserver = ResizeObserverMock;

// Mock IntersectionObserver
class IntersectionObserverMock {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
}

window.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

// Suppress React act() warnings from @testing-library/user-event
// These warnings are false positives in React 19 + @testing-library/user-event v14+
// userEvent already wraps actions in act(), but React still emits warnings for async updates
const originalError = console.error;
beforeAll(() => {
    console.error = (...args: unknown[]) => {
        const message = args[0];
        if (
            typeof message === 'string' &&
            (message.includes('Warning: An update to') ||
                message.includes('not wrapped in act(...)'))
        ) {
            return; // Suppress act() warnings
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
});
