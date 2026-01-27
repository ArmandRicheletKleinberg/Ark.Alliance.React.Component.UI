/**
 * @fileoverview Test Setup
 * @module Ark.Alliance.React.Component.UI.Tests
 * 
 * Global test setup for Vitest with React Testing Library.
 */

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';

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
