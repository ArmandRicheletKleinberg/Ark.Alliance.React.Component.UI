/**
 * @fileoverview Universal Icon Component Unit Tests
 * @module tests/components/Icon/UniversalIcon
 * 
 * Tests for the unified UniversalIcon component.
 * Verifies source resolution, rendering of SVG vs FA icons, and registry integration.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import React from 'react';

// Import real components and registry
import { UniversalIcon } from '../../../Ark.Alliance.React.Component.UI/src/components/Icon/UniversalIcon';
import { IconRegistry } from '../../../Ark.Alliance.React.Component.UI/src/components/Icon/icons/IconRegistry';
import { FAIcon } from '../../../Ark.Alliance.React.Component.UI/src/components/Icon/FAIcon/FAIcon';

// Mock FAIcon to avoid FontAwesome library complexity in unit tests
// We just want to ensure UniversalIcon delegates to the right component
vi.mock('../../../Ark.Alliance.React.Component.UI/src/components/Icon/FAIcon/FAIcon', () => ({
    FAIcon: vi.fn(({ name, iconStyle }) => <div data-testid="fa-icon" data-name={name} data-style={iconStyle}>FAIcon-Mock</div>),
}));

// Mock Icon (SVG) similarly if desired, but using real one is fine if we register a test icon
// We will register a test icon to ensure 'auto' detection works

// ═══════════════════════════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════════════════════════

beforeEach(() => {
    vi.clearAllMocks();
    IconRegistry.clear();
    // Register a test icon
    IconRegistry.register({
        name: 'test-svg-icon',
        path: 'M0 0h24v24H0z',
        category: 'test'
    });
});

afterEach(() => {
    cleanup();
});

// ═══════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('UniversalIcon Component', () => {
    describe('Auto-Detection', () => {
        it('should render SVG icon if present in registry', () => {
            const { container } = render(
                React.createElement(UniversalIcon, {
                    name: 'test-svg-icon',
                    // source defaults to 'auto'
                })
            );

            // Should render an SVG
            const svg = container.querySelector('svg');
            expect(svg).not.toBeNull();
            expect(FAIcon).not.toHaveBeenCalled();
        });

        it('should render FA icon if NOT present in registry', () => {
            const { getByTestId } = render(
                React.createElement(UniversalIcon, {
                    name: 'user-secret', // Assume not in SVG registry
                })
            );

            // Should delegate to FAIcon
            expect(FAIcon).toHaveBeenCalled();
            const faMock = getByTestId('fa-icon');
            expect(faMock.getAttribute('data-name')).toBe('user-secret');
        });
    });

    describe('Explicit Source', () => {
        it('should force SVG rendering when source is "svg"', () => {
            // Even if we request a name that doesn't exist, it should try to render SVG (and log warning/return null)
            // But if it exists, it renders.

            const { container } = render(
                React.createElement(UniversalIcon, {
                    name: 'test-svg-icon',
                    source: 'svg',
                })
            );

            const svg = container.querySelector('svg');
            expect(svg).not.toBeNull();
            expect(FAIcon).not.toHaveBeenCalled();
        });

        it('should force FA rendering when source is "font-awesome"', () => {
            // Even if name exists in SVG registry, force FA
            const { getByTestId } = render(
                React.createElement(UniversalIcon, {
                    name: 'test-svg-icon', // Exists in SVG
                    source: 'font-awesome',
                })
            );

            expect(FAIcon).toHaveBeenCalled();
            getByTestId('fa-icon');
        });
    });

    describe('Props Passing', () => {
        it('should pass common props to FAIcon', () => {
            render(
                React.createElement(UniversalIcon, {
                    name: 'test-fa',
                    size: 'lg',
                    color: 'red',
                    source: 'font-awesome',
                })
            );

            expect(FAIcon).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'test-fa',
                    size: 'lg',
                    color: 'red',
                }),
                expect.any(Object)
            );
        });

        it('should pass FA-specific props to FAIcon', () => {
            render(
                React.createElement(UniversalIcon, {
                    name: 'test-fa',
                    iconStyle: 'brands',
                    spin: true,
                    pulse: true,
                    source: 'font-awesome',
                })
            );

            expect(FAIcon).toHaveBeenCalledWith(
                expect.objectContaining({
                    iconStyle: 'brands',
                    spin: true,
                    pulse: true,
                }),
                expect.any(Object)
            );
        });
    });
});
