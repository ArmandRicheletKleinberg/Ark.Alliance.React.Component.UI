/**
 * @fileoverview TabControl Component Unit Tests
 * @module tests/components/TabControl
 * 
 * Tests TabControl and TabItem components, models, and viewmodels.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { renderHook } from '@testing-library/react';

// Import real components
import { TabControl, TabItem } from '@components/TabControl';
import { TabControlModelSchema, TabItemModelSchema, createTabControlModel, createTabItemModel } from '@components/TabControl';
import { useTabControl, useTabItem } from '@components/TabControl';

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
// TAB ITEM MODEL TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('TabItemModelSchema', () => {
    it('should parse valid tab item with required fields', () => {
        const result = TabItemModelSchema.parse({
            tabKey: 'tab-1',
            label: 'Tab 1',
        });

        expect(result.tabKey).toBe('tab-1');
        expect(result.label).toBe('Tab 1');
        expect(result.isActive).toBe(false);
        expect(result.disabled).toBe(false);
        expect(result.size).toBe('md');
    });

    it('should accept optional icon', () => {
        const result = TabItemModelSchema.parse({
            tabKey: 'tab-1',
            label: 'Tab 1',
            icon: 'home',
            iconPosition: 'left',
        });

        expect(result.icon).toBe('home');
        expect(result.iconPosition).toBe('left');
    });

    it('should accept badge', () => {
        const result = TabItemModelSchema.parse({
            tabKey: 'tab-1',
            label: 'Notifications',
            badge: 5,
            badgeVariant: 'error',
        });

        expect(result.badge).toBe(5);
        expect(result.badgeVariant).toBe('error');
    });

    it('should inherit BaseModel properties', () => {
        const result = TabItemModelSchema.parse({
            tabKey: 'tab-1',
            label: 'Tab 1',
            disabled: true,
            tooltip: 'Tab tooltip',
            className: 'custom-tab',
        });

        expect(result.disabled).toBe(true);
        expect(result.tooltip).toBe('Tab tooltip');
        expect(result.className).toBe('custom-tab');
    });

    it('should accept closeable prop', () => {
        const result = TabItemModelSchema.parse({
            tabKey: 'tab-1',
            label: 'Tab 1',
            closeable: true,
        });

        expect(result.closeable).toBe(true);
    });
});

describe('createTabItemModel', () => {
    it('should create tab item with required fields', () => {
        const tab = createTabItemModel({
            tabKey: 'overview',
            label: 'Overview',
        });

        expect(tab.tabKey).toBe('overview');
        expect(tab.label).toBe('Overview');
        expect(tab.isActive).toBe(false);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// TAB CONTROL MODEL TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('TabControlModelSchema', () => {
    it('should parse with defaults', () => {
        const result = TabControlModelSchema.parse({});

        expect(result.items).toEqual([]);
        expect(result.variant).toBe('default');
        expect(result.orientation).toBe('horizontal');
        expect(result.alignment).toBe('start');
        expect(result.size).toBe('md');
        expect(result.scrollable).toBe(false);
    });

    it('should accept variant options', () => {
        const variants = ['default', 'pills', 'underline', 'boxed', 'compact'];

        variants.forEach(variant => {
            const result = TabControlModelSchema.parse({ variant });
            expect(result.variant).toBe(variant);
        });
    });

    it('should accept orientation options', () => {
        const orientations = ['horizontal', 'vertical'];

        orientations.forEach(orientation => {
            const result = TabControlModelSchema.parse({ orientation });
            expect(result.orientation).toBe(orientation);
        });
    });

    it('should accept alignment options', () => {
        const alignments = ['start', 'center', 'end', 'stretch'];

        alignments.forEach(alignment => {
            const result = TabControlModelSchema.parse({ alignment });
            expect(result.alignment).toBe(alignment);
        });
    });

    it('should accept items array', () => {
        const result = TabControlModelSchema.parse({
            items: [
                { tabKey: 'tab-1', label: 'Tab 1' },
                { tabKey: 'tab-2', label: 'Tab 2' },
            ],
        });

        expect(result.items.length).toBe(2);
        expect(result.items[0].tabKey).toBe('tab-1');
    });

    it('should inherit BaseModel properties', () => {
        const result = TabControlModelSchema.parse({
            className: 'custom-tabs',
            testId: 'main-tabs',
            disabled: true,
        });

        expect(result.className).toBe('custom-tabs');
        expect(result.testId).toBe('main-tabs');
        expect(result.disabled).toBe(true);
    });
});

describe('createTabControlModel', () => {
    it('should create tab control with items', () => {
        const tabs = createTabControlModel({
            items: [
                { tabKey: 'home', label: 'Home' },
                { tabKey: 'settings', label: 'Settings' },
            ],
            variant: 'pills',
        });

        expect(tabs.items.length).toBe(2);
        expect(tabs.variant).toBe('pills');
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// TAB ITEM VIEWMODEL TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('useTabItem hook', () => {
    it('should provide model and handlers', () => {
        const { result } = renderHook(() => useTabItem({
            tabKey: 'tab-1',
            label: 'Tab 1',
        }));

        expect(result.current.model.tabKey).toBe('tab-1');
        expect(result.current.model.label).toBe('Tab 1');
        expect(typeof result.current.handleClick).toBe('function');
        expect(typeof result.current.handleKeyDown).toBe('function');
    });

    it('should compute isInteractive based on disabled state', () => {
        const { result: enabledResult } = renderHook(() => useTabItem({
            tabKey: 'tab-1',
            label: 'Tab 1',
            disabled: false,
        }));

        expect(enabledResult.current.isInteractive).toBe(true);

        const { result: disabledResult } = renderHook(() => useTabItem({
            tabKey: 'tab-2',
            label: 'Tab 2',
            disabled: true,
        }));

        expect(disabledResult.current.isInteractive).toBe(false);
    });

    it('should generate correct tabClasses', () => {
        const { result } = renderHook(() => useTabItem({
            tabKey: 'tab-1',
            label: 'Tab 1',
            isActive: true,
            size: 'lg',
        }));

        expect(result.current.tabClasses).toContain('ark-tab-item');
        expect(result.current.tabClasses).toContain('ark-tab-item--active');
        expect(result.current.tabClasses).toContain('ark-tab-item--lg');
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// TAB CONTROL VIEWMODEL TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('useTabControl hook', () => {
    const defaultItems = [
        { tabKey: 'tab-1', label: 'Tab 1' },
        { tabKey: 'tab-2', label: 'Tab 2' },
        { tabKey: 'tab-3', label: 'Tab 3' },
    ];

    it('should initialize with first tab active', () => {
        const { result } = renderHook(() => useTabControl({
            items: defaultItems,
        }));

        expect(result.current.activeKey).toBe('tab-1');
        expect(result.current.activeIndex).toBe(0);
    });

    it('should respect defaultActiveKey', () => {
        const { result } = renderHook(() => useTabControl({
            items: defaultItems,
            defaultActiveKey: 'tab-2',
        }));

        expect(result.current.activeKey).toBe('tab-2');
        expect(result.current.activeIndex).toBe(1);
    });

    it('should change active tab via setActiveTab', () => {
        const { result } = renderHook(() => useTabControl({
            items: defaultItems,
        }));

        act(() => {
            result.current.setActiveTab('tab-3');
        });

        expect(result.current.activeKey).toBe('tab-3');
        expect(result.current.activeIndex).toBe(2);
    });

    it('should call onTabChange callback', () => {
        const onTabChange = vi.fn();
        const { result } = renderHook(() => useTabControl({
            items: defaultItems,
            onTabChange,
        }));

        act(() => {
            result.current.setActiveTab('tab-2');
        });

        expect(onTabChange).toHaveBeenCalledWith('tab-2');
    });

    it('should not activate disabled tab', () => {
        const { result } = renderHook(() => useTabControl({
            items: [
                { tabKey: 'tab-1', label: 'Tab 1' },
                { tabKey: 'tab-2', label: 'Tab 2', disabled: true },
            ],
        }));

        act(() => {
            result.current.setActiveTab('tab-2');
        });

        expect(result.current.activeKey).toBe('tab-1');
    });

    it('should provide correct containerClasses', () => {
        const { result } = renderHook(() => useTabControl({
            items: defaultItems,
            variant: 'pills',
            orientation: 'vertical',
        }));

        expect(result.current.containerClasses).toContain('ark-tab-control');
        expect(result.current.containerClasses).toContain('ark-tab-control--pills');
        expect(result.current.containerClasses).toContain('ark-tab-control--vertical');
    });

    it('should generate correct ARIA props for tabs', () => {
        const { result } = renderHook(() => useTabControl({
            items: defaultItems,
            defaultActiveKey: 'tab-1',
        }));

        const tab1AriaProps = result.current.getTabAriaProps(defaultItems[0], 0);
        const tab2AriaProps = result.current.getTabAriaProps(defaultItems[1], 1);

        expect(tab1AriaProps['role']).toBe('tab');
        expect(tab1AriaProps['aria-selected']).toBe(true);
        expect(tab1AriaProps['tabIndex']).toBe(0);

        expect(tab2AriaProps['aria-selected']).toBe(false);
        expect(tab2AriaProps['tabIndex']).toBe(-1);
    });

    it('should generate correct panel ARIA props', () => {
        const { result } = renderHook(() => useTabControl({
            items: defaultItems,
            defaultActiveKey: 'tab-1',
        }));

        const panel1Props = result.current.getPanelAriaProps('tab-1');
        const panel2Props = result.current.getPanelAriaProps('tab-2');

        expect(panel1Props['role']).toBe('tabpanel');
        expect(panel1Props['hidden']).toBe(false);
        expect(panel2Props['hidden']).toBe(true);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('TabItem Component', () => {
    it('should render tab label', () => {
        render(
            React.createElement(TabItem, {
                tabKey: 'tab-1',
                label: 'Overview',
                onClick: vi.fn(),
            })
        );

        expect(screen.getByText('Overview')).toBeInTheDocument();
    });

    it('should call onClick when clicked', async () => {
        const onClick = vi.fn();
        const user = userEvent.setup();

        render(
            React.createElement(TabItem, {
                tabKey: 'tab-1',
                label: 'Tab',
                onClick,
            })
        );

        await user.click(screen.getByRole('button'));

        expect(onClick).toHaveBeenCalled();
    });

    it('should not call onClick when disabled', async () => {
        const onClick = vi.fn();
        const user = userEvent.setup();

        render(
            React.createElement(TabItem, {
                tabKey: 'tab-1',
                label: 'Tab',
                onClick,
                disabled: true,
            })
        );

        await user.click(screen.getByRole('button'));

        expect(onClick).not.toHaveBeenCalled();
    });
});

describe('TabControl Component', () => {
    const tabs = [
        { tabKey: 'overview', label: 'Overview' },
        { tabKey: 'settings', label: 'Settings' },
        { tabKey: 'advanced', label: 'Advanced' },
    ];

    it('should render all tabs', () => {
        render(
            React.createElement(TabControl, {
                items: tabs,
            })
        );

        expect(screen.getByText('Overview')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Advanced')).toBeInTheDocument();
    });

    it('should have tablist role', () => {
        render(
            React.createElement(TabControl, {
                items: tabs,
            })
        );

        expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should render with correct variant class', () => {
        const { container } = render(
            React.createElement(TabControl, {
                items: tabs,
                variant: 'pills',
            })
        );

        const tabControl = container.querySelector('.ark-tab-control');
        expect(tabControl?.className).toContain('ark-tab-control--pills');
    });

    it('should call onTabChange when tab clicked', async () => {
        const onTabChange = vi.fn();
        const user = userEvent.setup();

        render(
            React.createElement(TabControl, {
                items: tabs,
                onTabChange,
            })
        );

        await user.click(screen.getByText('Settings'));

        expect(onTabChange).toHaveBeenCalledWith('settings');
    });
});
