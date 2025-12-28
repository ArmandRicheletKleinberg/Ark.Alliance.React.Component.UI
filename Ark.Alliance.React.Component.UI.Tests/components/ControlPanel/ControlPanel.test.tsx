/**
 * @fileoverview ControlPanel Component Unit Tests
 * @module tests/components/ControlPanel
 * 
 * Tests for ControlPanel, ControlPanelSection, and ControlPanelRow components.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {
    ControlPanel,
    ControlPanelSection,
    ControlPanelRow,
} from '@components/ControlPanel';
import { ControlPanelModelSchema } from '@components/ControlPanel/ControlPanel.model';

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
// CONTROLPANEL COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('ControlPanel Component', () => {
    describe('Rendering', () => {
        it('should render with default title', () => {
            render(
                React.createElement(ControlPanel, {
                    children: 'Content',
                })
            );

            expect(screen.getByText('Control Panel')).not.toBeNull();
        });

        it('should render with custom title', () => {
            render(
                React.createElement(ControlPanel, {
                    title: 'Settings Panel',
                    children: 'Content',
                })
            );

            expect(screen.getByText('Settings Panel')).not.toBeNull();
        });

        it('should render title icon', () => {
            const { container } = render(
                React.createElement(ControlPanel, {
                    title: 'Test',
                    titleIcon: '🔧',
                    children: 'Content',
                })
            );

            const icon = container.querySelector('.ark-control-panel__title-icon');
            expect(icon?.textContent).toBe('🔧');
        });

        it('should render children', () => {
            render(
                React.createElement(ControlPanel, {
                    children: 'Test Content',
                })
            );

            expect(screen.getByText('Test Content')).not.toBeNull();
        });
    });

    describe('Collapse Behavior', () => {
        it('should toggle collapse on button click when collapsible', async () => {
            const user = userEvent.setup();
            const { container } = render(
                React.createElement(ControlPanel, {
                    collapsible: true,
                    children: React.createElement('div', { 'data-testid': 'content' }, 'Content'),
                })
            );

            // Content visible initially
            expect(screen.getByTestId('content')).not.toBeNull();

            // Click collapse button
            const collapseBtn = container.querySelector('.ark-control-panel__collapse-btn');
            expect(collapseBtn).not.toBeNull();
            await user.click(collapseBtn!);

            // Content should be hidden
            expect(screen.queryByTestId('content')).toBeNull();
        });

        it('should call onCollapseChange when toggling', async () => {
            const onCollapseChange = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(ControlPanel, {
                    collapsible: true,
                    onCollapseChange,
                    children: 'Content',
                })
            );

            const collapseBtn = container.querySelector('.ark-control-panel__collapse-btn');
            await user.click(collapseBtn!);

            expect(onCollapseChange).toHaveBeenCalledWith(true);
        });

        it('should not show collapse button when not collapsible', () => {
            const { container } = render(
                React.createElement(ControlPanel, {
                    collapsible: false,
                    children: 'Content',
                })
            );

            const collapseBtn = container.querySelector('.ark-control-panel__collapse-btn');
            expect(collapseBtn).toBeNull();
        });
    });

    describe('Header Actions', () => {
        it('should render header actions', () => {
            const { container } = render(
                React.createElement(ControlPanel, {
                    headerActions: [
                        { id: 'reset', label: 'Reset', icon: '🔄', active: false, variant: 'default' },
                    ],
                    children: 'Content',
                })
            );

            const actionBtn = container.querySelector('.ark-control-panel__action');
            expect(actionBtn?.textContent).toBe('🔄');
        });

        it('should call onActionClick when action clicked', async () => {
            const onActionClick = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(ControlPanel, {
                    headerActions: [
                        { id: 'reset', label: 'Reset', icon: '🔄', active: false, variant: 'default' },
                    ],
                    onActionClick,
                    children: 'Content',
                })
            );

            const actionBtn = container.querySelector('.ark-control-panel__action');
            await user.click(actionBtn!);

            expect(onActionClick).toHaveBeenCalledWith('reset');
        });

        it('should apply active class to active actions', () => {
            const { container } = render(
                React.createElement(ControlPanel, {
                    headerActions: [
                        { id: 'toggle', label: 'Toggle', icon: '▶', active: true, variant: 'default' },
                    ],
                    children: 'Content',
                })
            );

            const actionBtn = container.querySelector('.ark-control-panel__action');
            expect(actionBtn?.className).toContain('ark-control-panel__action--active');
        });
    });

    describe('Connection Status', () => {
        it('should render connection status when provided', () => {
            render(
                React.createElement(ControlPanel, {
                    connectionStatus: 'connected',
                    children: 'Content',
                })
            );

            expect(screen.getByText('Connected')).not.toBeNull();
        });

        it('should apply correct status class', () => {
            const { container } = render(
                React.createElement(ControlPanel, {
                    connectionStatus: 'disconnected',
                    children: 'Content',
                })
            );

            const statusDot = container.querySelector('.ark-control-panel__status-dot');
            expect(statusDot?.className).toContain('ark-control-panel__status-dot--disconnected');
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// CONTROLPANELSECTION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('ControlPanelSection', () => {
    it('should render section title', () => {
        render(
            React.createElement(ControlPanelSection, {
                title: 'Settings',
                children: 'Content',
            })
        );

        expect(screen.getByText('Settings')).not.toBeNull();
    });

    it('should render section icon', () => {
        const { container } = render(
            React.createElement(ControlPanelSection, {
                title: 'Settings',
                icon: '⚙️',
                children: 'Content',
            })
        );

        const icon = container.querySelector('.ark-control-panel__section-icon');
        expect(icon?.textContent).toBe('⚙️');
    });

    it('should render children', () => {
        render(
            React.createElement(ControlPanelSection, {
                title: 'Settings',
                children: 'Section Content',
            })
        );

        expect(screen.getByText('Section Content')).not.toBeNull();
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// CONTROLPANELROW TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('ControlPanelRow', () => {
    it('should render row label', () => {
        render(
            React.createElement(ControlPanelRow, {
                label: 'Border Width',
                children: React.createElement('input', { type: 'range' }),
            })
        );

        expect(screen.getByText('Border Width')).not.toBeNull();
    });

    it('should render children (control)', () => {
        const { container } = render(
            React.createElement(ControlPanelRow, {
                label: 'Border Width',
                children: React.createElement('input', { type: 'range', 'data-testid': 'slider' }),
            })
        );

        expect(screen.getByTestId('slider')).not.toBeNull();
    });

    it('should render value when provided', () => {
        render(
            React.createElement(ControlPanelRow, {
                label: 'Border Width',
                value: '5px',
                children: React.createElement('input', { type: 'range' }),
            })
        );

        expect(screen.getByText('5px')).not.toBeNull();
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// MODEL VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('ControlPanelModelSchema', () => {
    it('should parse empty object with defaults', () => {
        const result = ControlPanelModelSchema.parse({});

        expect(result.visible).toBe(true);
        expect(result.collapsible).toBe(true);
        expect(result.defaultCollapsed).toBe(false);
        expect(result.title).toBe('Control Panel');
        expect(result.titleIcon).toBe('⚙️');
        expect(result.position).toBe('right');
        expect(result.width).toBe(280);
    });

    it('should accept custom values', () => {
        const result = ControlPanelModelSchema.parse({
            title: 'Custom Panel',
            collapsible: false,
            position: 'left',
            width: 350,
        });

        expect(result.title).toBe('Custom Panel');
        expect(result.collapsible).toBe(false);
        expect(result.position).toBe('left');
        expect(result.width).toBe(350);
    });

    it('should validate position enum', () => {
        expect(() => {
            ControlPanelModelSchema.parse({ position: 'invalid' });
        }).toThrow();
    });

    it('should validate width range', () => {
        expect(() => {
            ControlPanelModelSchema.parse({ width: 50 }); // Below min 150
        }).toThrow();
    });
});
