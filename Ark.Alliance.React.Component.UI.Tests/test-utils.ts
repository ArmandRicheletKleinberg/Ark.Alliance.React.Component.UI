/**
 * @fileoverview Test Utilities Re-export
 * @module Ark.Alliance.React.Component.UI.Tests
 * 
 * This module re-exports all @testing-library/react functions with
 * render and renderHook wrapped to include ThemeProvider automatically.
 * 
 * Vitest is configured to alias @testing-library/react to this file,
 * so all test imports automatically get the wrapped versions.
 */

import React, { ReactElement, ReactNode } from 'react';

// Import directly from node_modules to avoid circular alias reference
// eslint-disable-next-line @typescript-eslint/no-require-imports
const TestingLibrary = require('./node_modules/@testing-library/react/dist/pure.js');

import { ThemeProvider } from '@core/theme';

// ═══════════════════════════════════════════════════════════════════════════
// TYPE IMPORTS (from the actual library for type safety)
// ═══════════════════════════════════════════════════════════════════════════

import type { RenderOptions, RenderHookOptions, RenderResult, RenderHookResult } from '@testing-library/react/pure';

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
// WRAPPED RENDER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Custom render that automatically wraps components with ThemeProvider
 */
function customRender(
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
    return TestingLibrary.render(ui, { wrapper: AllProviders, ...options });
}

/**
 * Custom renderHook that automatically wraps with ThemeProvider
 */
function customRenderHook<TResult, TProps>(
    hook: (props: TProps) => TResult,
    options?: Omit<RenderHookOptions<TProps>, 'wrapper'>
): RenderHookResult<TResult, TProps> {
    return TestingLibrary.renderHook(hook, { wrapper: AllProviders, ...options });
}

// ═══════════════════════════════════════════════════════════════════════════
// RE-EXPORTS - All library exports with wrapped versions
// ═══════════════════════════════════════════════════════════════════════════

// Re-export everything from testing library
export const screen = TestingLibrary.screen;
export const fireEvent = TestingLibrary.fireEvent;
export const waitFor = TestingLibrary.waitFor;
export const waitForElementToBeRemoved = TestingLibrary.waitForElementToBeRemoved;
export const within = TestingLibrary.within;
export const act = TestingLibrary.act;
export const cleanup = TestingLibrary.cleanup;
export const configure = TestingLibrary.configure;
export const getByLabelText = TestingLibrary.getByLabelText;
export const getByPlaceholderText = TestingLibrary.getByPlaceholderText;
export const getByText = TestingLibrary.getByText;
export const getByTestId = TestingLibrary.getByTestId;
export const getByRole = TestingLibrary.getByRole;
export const queryByText = TestingLibrary.queryByText;
export const queryByTestId = TestingLibrary.queryByTestId;
export const findByText = TestingLibrary.findByText;
export const findByTestId = TestingLibrary.findByTestId;
export const prettyDOM = TestingLibrary.prettyDOM;

// Export wrapped render and renderHook
export { customRender as render, customRenderHook as renderHook };

// Also export explicit aliases for clarity
export { customRender as renderWithProviders, customRenderHook as renderHookWithProviders };
