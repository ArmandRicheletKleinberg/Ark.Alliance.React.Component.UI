/**
 * @fileoverview Panel Component Unit Tests
 * @module tests/components/Panel
 * 
 * Tests real Panel component with mock data from scenarios.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import real component
import { Panel } from '@components/Panel';
import { PanelModelSchema } from '@components/Panel/Panel.model';
import { loadPanelScenario, SCENARIO_IDS } from '../../fixtures/TestScenarioLoader';

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
// SCENARIO-DRIVEN TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Panel Component', () => {
    describe('PANEL-001: Collapsible Toggle', () => {
        const scenario = loadPanelScenario(SCENARIO_IDS.PANEL_TOGGLE);

        it('should toggle collapsed state on collapse button click', async () => {
            expect(scenario).not.toBeNull();

            const onCollapseChange = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(Panel, {
                    title: 'Test Panel',
                    collapsible: true,
                    collapsed: false,
                    onCollapseChange,
                    children: 'Panel content',
                })
            );

            // Click the collapse button (not the header itself)
            const collapseBtn = container.querySelector('.ark-panel__collapse-btn');
            expect(collapseBtn).not.toBeNull();

            await user.click(collapseBtn!);

            expect(onCollapseChange).toHaveBeenCalledWith(true);
        });
    });

    describe('PANEL-002: Non-Collapsible', () => {
        const scenario = loadPanelScenario(SCENARIO_IDS.PANEL_STATIC);

        it('should not toggle when collapsible is false', async () => {
            expect(scenario).not.toBeNull();

            const onCollapseChange = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(Panel, {
                    title: 'Static Panel',
                    collapsible: false,
                    onCollapseChange,
                    children: 'Panel content',
                })
            );

            const header = container.querySelector('.ark-panel__header');
            expect(header).not.toBeNull();

            await user.click(header!);

            // Should NOT call onCollapseChange
            expect(onCollapseChange).not.toHaveBeenCalled();
        });
    });

    describe('PANEL-003: NON-REGRESSION - Collapsed Prop Sync', () => {
        it('should sync collapsed state when prop changes', async () => {
            const { container, rerender } = render(
                React.createElement(Panel, {
                    title: 'Test Panel',
                    collapsible: true,
                    collapsed: false,
                    children: 'Panel content',
                })
            );

            // Initially should not have collapsed class
            let panel = container.querySelector('.ark-panel');
            expect(panel?.className).not.toContain('ark-panel--collapsed');

            // Parent changes collapsed prop
            rerender(
                React.createElement(Panel, {
                    title: 'Test Panel',
                    collapsible: true,
                    collapsed: true,
                    children: 'Panel content',
                })
            );

            // Should now have collapsed class (REGRESSION: this was broken before)
            panel = container.querySelector('.ark-panel');
            expect(panel?.className).toContain('ark-panel--collapsed');
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// MODEL VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('PanelModelSchema', () => {
    it('should parse valid panel model', () => {
        const result = PanelModelSchema.parse({
            title: 'My Panel',
            variant: 'default',
        });

        expect(result.title).toBe('My Panel');
        expect(result.variant).toBe('default');
    });

    it('should use defaults for missing properties', () => {
        const result = PanelModelSchema.parse({});

        expect(result.variant).toBe('default');
        expect(result.collapsible).toBe(false);
        expect(result.collapsed).toBe(false);
    });

    it('should accept collapsible props', () => {
        const result = PanelModelSchema.parse({
            collapsible: true,
            collapsed: true,
        });

        expect(result.collapsible).toBe(true);
        expect(result.collapsed).toBe(true);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// VARIANT TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Panel Variants', () => {
    it('should apply default variant class', () => {
        const { container } = render(
            React.createElement(Panel, {
                title: 'Default Panel',
                variant: 'default',
                children: 'Content',
            })
        );

        const panel = container.querySelector('.ark-panel');
        expect(panel?.className).toContain('ark-panel--default');
    });

    it('should apply bordered variant class', () => {
        const { container } = render(
            React.createElement(Panel, {
                title: 'Bordered Panel',
                variant: 'bordered',
                children: 'Content',
            })
        );

        const panel = container.querySelector('.ark-panel');
        expect(panel?.className).toContain('ark-panel--bordered');
    });
});
