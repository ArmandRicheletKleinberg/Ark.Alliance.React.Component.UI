/**
 * @fileoverview GenericPanel Component Unit Tests
 * @module tests/components/GenericPanel
 * 
 * Tests for the GenericPanel component with dynamic theming and composition.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import real component
import { GenericPanel } from '@components/GenericPanel';
import { GenericPanelModelSchema, createGenericPanelModel } from '@components/GenericPanel/GenericPanel.model';

// ═══════════════════════════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════════════════════════

beforeEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    cleanup();
});

// ═══════════════════════════════════════════════════════════════════════════
// RENDERING TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('GenericPanel Component', () => {
    describe('GENPANEL-001: Basic Rendering', () => {
        it('should render with default props', () => {
            const { container } = render(
                React.createElement(GenericPanel, {
                    children: 'Panel content',
                })
            );

            const panel = container.querySelector('.ark-generic-panel');
            expect(panel).not.toBeNull();
            expect(panel?.textContent).toContain('Panel content');
        });

        it('should render with title', () => {
            const { container } = render(
                React.createElement(GenericPanel, {
                    title: 'Test Panel',
                    children: 'Content',
                })
            );

            const header = container.querySelector('.ark-generic-panel__header');
            expect(header).not.toBeNull();
            expect(header?.textContent).toContain('Test Panel');
        });

        it('should render with header slot', () => {
            const { container } = render(
                React.createElement(GenericPanel, {
                    header: React.createElement('span', { className: 'custom-header' }, 'Custom Header'),
                    children: 'Content',
                })
            );

            const customHeader = container.querySelector('.custom-header');
            expect(customHeader).not.toBeNull();
            expect(customHeader?.textContent).toBe('Custom Header');
        });

        it('should render with footer slot', () => {
            const { container } = render(
                React.createElement(GenericPanel, {
                    footer: React.createElement('div', { className: 'custom-footer' }, 'Footer'),
                    children: 'Content',
                })
            );

            const footer = container.querySelector('.ark-generic-panel__footer');
            expect(footer).not.toBeNull();
            expect(footer?.textContent).toContain('Footer');
        });
    });

    describe('GENPANEL-002: Collapsible Behavior', () => {
        it('should toggle collapsed state on collapse button click', async () => {
            const onCollapseChange = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(GenericPanel, {
                    title: 'Collapsible Panel',
                    collapsible: true,
                    collapsed: false,
                    onCollapseChange,
                    children: 'Content',
                })
            );

            const collapseBtn = container.querySelector('.ark-generic-panel__collapse-btn');
            expect(collapseBtn).not.toBeNull();

            await user.click(collapseBtn!);
            expect(onCollapseChange).toHaveBeenCalledWith(true);
        });

        it('should not show collapse button when collapsible is false', () => {
            const { container } = render(
                React.createElement(GenericPanel, {
                    title: 'Static Panel',
                    collapsible: false,
                    children: 'Content',
                })
            );

            const collapseBtn = container.querySelector('.ark-generic-panel__collapse-btn');
            expect(collapseBtn).toBeNull();
        });

        it('should sync collapsed state when prop changes', () => {
            const { container, rerender } = render(
                React.createElement(GenericPanel, {
                    title: 'Test Panel',
                    collapsible: true,
                    collapsed: false,
                    children: 'Content',
                })
            );

            let panel = container.querySelector('.ark-generic-panel');
            expect(panel?.className).not.toContain('ark-generic-panel--collapsed');

            rerender(
                React.createElement(GenericPanel, {
                    title: 'Test Panel',
                    collapsible: true,
                    collapsed: true,
                    children: 'Content',
                })
            );

            panel = container.querySelector('.ark-generic-panel');
            expect(panel?.className).toContain('ark-generic-panel--collapsed');
        });
    });

    describe('GENPANEL-003: Dynamic Styling', () => {
        it('should apply border radius style', () => {
            const { container } = render(
                React.createElement(GenericPanel, {
                    borderRadius: 20,
                    children: 'Content',
                })
            );

            const panel = container.querySelector('.ark-generic-panel') as HTMLElement;
            expect(panel?.style.borderRadius).toBe('20px');
        });

        it('should apply opacity style', () => {
            const { container } = render(
                React.createElement(GenericPanel, {
                    opacity: 80,
                    children: 'Content',
                })
            );

            const panel = container.querySelector('.ark-generic-panel') as HTMLElement;
            expect(panel?.style.opacity).toBe('0.8');
        });

        it('should apply glass blur when glassBlur > 0', () => {
            const { container } = render(
                React.createElement(GenericPanel, {
                    glassBlur: 12,
                    children: 'Content',
                })
            );

            const panel = container.querySelector('.ark-generic-panel') as HTMLElement;
            expect(panel?.style.backdropFilter).toContain('blur(12px)');
            expect(panel?.className).toContain('ark-generic-panel--glass-effect');
        });

        it('should apply gradient background when enabled', () => {
            const { container } = render(
                React.createElement(GenericPanel, {
                    useGradient: true,
                    gradientStart: '#1e3a5f',
                    gradientEnd: '#0f172a',
                    gradientDirection: 135,
                    children: 'Content',
                })
            );

            const panel = container.querySelector('.ark-generic-panel') as HTMLElement;
            expect(panel?.style.background).toContain('linear-gradient');
        });
    });

    describe('GENPANEL-004: Grid Overlay', () => {
        it('should show grid overlay when showGrid is true', () => {
            const { container } = render(
                React.createElement(GenericPanel, {
                    showGrid: true,
                    gridSize: 25,
                    children: 'Content',
                })
            );

            const gridOverlay = container.querySelector('.ark-panel-grid-overlay');
            expect(gridOverlay).not.toBeNull();
            expect(container.querySelector('.ark-generic-panel--with-grid')).not.toBeNull();
        });

        it('should not show grid overlay when showGrid is false', () => {
            const { container } = render(
                React.createElement(GenericPanel, {
                    showGrid: false,
                    children: 'Content',
                })
            );

            const gridOverlay = container.querySelector('.ark-panel-grid-overlay');
            expect(gridOverlay).toBeNull();
        });
    });

    describe('GENPANEL-005: Empty State', () => {
        it('should show empty state when no children and showEmptyState is true', () => {
            const { container } = render(
                React.createElement(GenericPanel, {
                    showEmptyState: true,
                    emptyMessage: 'No data available',
                    emptyIcon: '📭',
                })
            );

            const emptyState = container.querySelector('.ark-panel-empty-state');
            expect(emptyState).not.toBeNull();
            expect(emptyState?.textContent).toContain('No data available');
        });

        it('should not show empty state when children exist', () => {
            const { container } = render(
                React.createElement(GenericPanel, {
                    showEmptyState: true,
                    children: 'Has content',
                })
            );

            const emptyState = container.querySelector('.ark-panel-empty-state');
            expect(emptyState).toBeNull();
        });
    });

    describe('GENPANEL-006: Layout Modes', () => {
        it('should apply sidebar layout class', () => {
            const { container } = render(
                React.createElement(GenericPanel, {
                    layout: 'sidebar-left',
                    sidebarWidth: 350,
                    children: 'Content',
                })
            );

            const panel = container.querySelector('.ark-generic-panel') as HTMLElement;
            expect(panel?.className).toContain('ark-generic-panel--sidebar-left');
            expect(panel?.style.width).toBe('350px');
        });
    });

    describe('GENPANEL-007: Glow Effect', () => {
        it('should wrap with glow effect when showGlow is true', () => {
            const { container } = render(
                React.createElement(GenericPanel, {
                    showGlow: true,
                    glowColor: 'rgba(59, 130, 246, 0.3)',
                    children: 'Content',
                })
            );

            const glowWrapper = container.querySelector('.ark-panel-glow-wrapper');
            expect(glowWrapper).not.toBeNull();
            expect(container.querySelector('.ark-panel-glow-effect')).not.toBeNull();
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// MODEL VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('GenericPanelModelSchema', () => {
    it('should parse with defaults for empty input', () => {
        const result = GenericPanelModelSchema.parse({});

        expect(result.variant).toBe('default');
        expect(result.collapsible).toBe(false);
        expect(result.borderRadius).toBe(8);
        expect(result.opacity).toBe(100);
        expect(result.glassBlur).toBe(0);
        expect(result.layout).toBe('inline');
    });

    it('should parse glassmorphism configuration', () => {
        const result = GenericPanelModelSchema.parse({
            glassBlur: 15,
            opacity: 85,
            useGradient: true,
            gradientStart: '#1e3a5f',
            gradientEnd: '#0f172a',
        });

        expect(result.glassBlur).toBe(15);
        expect(result.opacity).toBe(85);
        expect(result.useGradient).toBe(true);
        expect(result.gradientStart).toBe('#1e3a5f');
    });

    it('should validate glassBlur range (0-40)', () => {
        expect(() => GenericPanelModelSchema.parse({ glassBlur: 50 })).toThrow();
        expect(() => GenericPanelModelSchema.parse({ glassBlur: -5 })).toThrow();
    });

    it('should validate opacity range (0-100)', () => {
        expect(() => GenericPanelModelSchema.parse({ opacity: 150 })).toThrow();
        expect(() => GenericPanelModelSchema.parse({ opacity: -10 })).toThrow();
    });

    it('should create model with factory function', () => {
        const model = createGenericPanelModel({
            title: 'Test',
            showGrid: true,
            accentColor: '#3b82f6',
        });

        expect(model.title).toBe('Test');
        expect(model.showGrid).toBe(true);
        expect(model.accentColor).toBe('#3b82f6');
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// VARIANT TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('GenericPanel Variants', () => {
    it('should apply default variant class', () => {
        const { container } = render(
            React.createElement(GenericPanel, {
                variant: 'default',
                children: 'Content',
            })
        );

        const panel = container.querySelector('.ark-generic-panel');
        expect(panel?.className).toContain('ark-generic-panel--default');
    });

    it('should apply glass variant class', () => {
        const { container } = render(
            React.createElement(GenericPanel, {
                variant: 'glass',
                children: 'Content',
            })
        );

        const panel = container.querySelector('.ark-generic-panel');
        expect(panel?.className).toContain('ark-generic-panel--glass');
    });

    it('should apply elevated variant class', () => {
        const { container } = render(
            React.createElement(GenericPanel, {
                variant: 'elevated',
                children: 'Content',
            })
        );

        const panel = container.querySelector('.ark-generic-panel');
        expect(panel?.className).toContain('ark-generic-panel--elevated');
    });
});
