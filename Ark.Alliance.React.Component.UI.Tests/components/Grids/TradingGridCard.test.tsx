/**
 * @fileoverview TradingGridCard Component Unit Tests
 * @module tests/components/Grids/TradingGridCard
 * 
 * Comprehensive tests for TradingGridCard MVVM component.
 * Tests real component with model validation, viewmodel logic, and rendering.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import real component
import { TradingGridCard } from '../../../Ark.Alliance.React.Component.UI/src/components/Grids/DataGrid';
import { TradingGridCardModelSchema, defaultTradingGridCardModel } from '../../../Ark.Alliance.React.Component.UI/src/components/Grids/DataGrid/TradingGridCard.model';

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
// MODEL VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('TradingGridCardModelSchema', () => {
    it('should parse valid trading card model', () => {
        const result = TradingGridCardModelSchema.parse({
            title: 'Trading Position',
            status: 'success',
        });

        expect(result.title).toBe('Trading Position');
        expect(result.status).toBe('success');
    });

    it('should extend Card model with defaults', () => {
        const result = TradingGridCardModelSchema.parse({
            title: 'Minimal Card',
        });

        // Verify Card defaults
        expect(result.status).toBe('info');
        expect(result.compact).toBe(false);
        expect(result.showHeader).toBe(true);

        // Verify base model defaults
        expect(result.disabled).toBe(false);
        expect(result.loading).toBe(false);
    });

    it('should accept all status variants including info', () => {
        const statuses = ['success', 'warning', 'error', 'info'];

        statuses.forEach(status => {
            const result = TradingGridCardModelSchema.parse({
                title: 'Card',
                status
            });
            expect(result.status).toBe(status);
        });
    });

    it('should reject invalid status', () => {
        expect(() =>
            TradingGridCardModelSchema.parse({ title: 'Card', status: 'invalid' })
        ).toThrow();
    });

    it('should use default model values', () => {
        expect(defaultTradingGridCardModel.status).toBe('info');
        expect(defaultTradingGridCardModel.tooltipPosition).toBe('top');
        expect(defaultTradingGridCardModel.tooltipDelay).toBe(300);
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT BEHAVIOR TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('TradingGridCard Component', () => {
    describe('TRADING-CARD-001: Status Color Rendering', () => {

        it('should render with success status', () => {
            const { container } = render(
                React.createElement(TradingGridCard, {
                    title: 'Success Card',
                    status: 'success',
                    children: 'Profit: $1000',
                })
            );

            const card = container.querySelector('.ark-trading-card');
            expect(card).not.toBeNull();
        });

        it('should render with warning status', () => {
            const { container } = render(
                React.createElement(TradingGridCard, {
                    title: 'Warning Card',
                    status: 'warning',
                    children: 'Approaching limit',
                })
            );

            const card = container.querySelector('.ark-trading-card');
            expect(card).not.toBeNull();
        });

        it('should render with error status', () => {
            const { container } = render(
                React.createElement(TradingGridCard, {
                    title: 'Error Card',
                    status: 'error',
                    children: 'Loss: $500',
                })
            );

            const card = container.querySelector('.ark-trading-card');
            expect(card).not.toBeNull();
        });

        it('should render with info status', () => {
            const { container } = render(
                React.createElement(TradingGridCard, {
                    title: 'Info Card',
                    status: 'info',
                    children: 'Market update',
                })
            );

            const card = container.querySelector('.ark-trading-card');
            expect(card).not.toBeNull();
        });
    });

    describe('TRADING-CARD-002: Dark/Light Theme', () => {
        it('should render in dark mode (default)', () => {
            const { container } = render(
                React.createElement(TradingGridCard, {
                    title: 'Dark Card',
                    isDark: true,
                    children: 'Dark content',
                })
            );

            const card = container.querySelector('.ark-trading-card');
            expect(card).not.toBeNull();
        });

        it('should render in light mode', () => {
            const { container } = render(
                React.createElement(TradingGridCard, {
                    title: 'Light Card',
                    isDark: false,
                    children: 'Light content',
                })
            );

            const card = container.querySelector('.ark-trading-card');
            expect(card).not.toBeNull();
        });
    });

    describe('TRADING-CARD-003: Click Handling', () => {
        it('should call onClick when clickable card is clicked', async () => {
            const onClick = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(TradingGridCard, {
                    title: 'Clickable Card',
                    clickable: true,
                    onClick,
                    children: 'Click me',
                })
            );

            const card = container.querySelector('.ark-trading-card');
            expect(card).not.toBeNull();

            await user.click(card!);
            expect(onClick).toHaveBeenCalled();
        });

        it('should not call onClick when disabled', async () => {
            const onClick = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(TradingGridCard, {
                    title: 'Disabled Card',
                    clickable: true,
                    disabled: true,
                    onClick,
                    children: 'Disabled',
                })
            );

            const card = container.querySelector('.ark-trading-card');
            await user.click(card!);

            expect(onClick).not.toHaveBeenCalled();
        });

        it('should have clickable role when clickable', () => {
            const { container } = render(
                React.createElement(TradingGridCard, {
                    title: 'Clickable Card',
                    clickable: true,
                    children: 'Content',
                })
            );

            const card = container.querySelector('.ark-trading-card');
            expect(card?.getAttribute('role')).toBe('button');
            expect(card?.getAttribute('tabIndex')).toBe('0');
        });
    });

    describe('TRADING-CARD-004: Inheritance from Card', () => {
        it('should apply Card base classes', () => {
            const { container } = render(
                React.createElement(TradingGridCard, {
                    title: 'Trading Card',
                    children: 'Content',
                })
            );

            const card = container.querySelector('.ark-card');
            expect(card).not.toBeNull();
        });

        it('should apply trading-specific classes', () => {
            const { container } = render(
                React.createElement(TradingGridCard, {
                    title: 'Trading Card',
                    children: 'Content',
                })
            );

            const card = container.querySelector('.ark-trading-card');
            expect(card).not.toBeNull();
        });

        it('should support compact mode from Card', () => {
            const { container } = render(
                React.createElement(TradingGridCard, {
                    title: 'Compact Trading Card',
                    compact: true,
                    children: 'Content',
                })
            );

            const card = container.querySelector('.ark-card--compact');
            expect(card).not.toBeNull();
        });
    });

    describe('TRADING-CARD-005: Hover States', () => {
        it('should handle mouse enter', async () => {
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(TradingGridCard, {
                    title: 'Hover Card',
                    clickable: true,
                    children: 'Hover over me',
                })
            );

            const card = container.querySelector('.ark-trading-card');
            expect(card).not.toBeNull();

            await user.hover(card!);
            // Visual hover effects are applied via CSS, component should handle event
        });

        it('should handle mouse leave', async () => {
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(TradingGridCard, {
                    title: 'Hover Card',
                    clickable: true,
                    children: 'Content',
                })
            );

            const card = container.querySelector('.ark-trading-card');
            await user.hover(card!);
            await user.unhover(card!);
            // Component should handle mouse leave event
        });
    });

    describe('TRADING-CARD-006: Header and Content', () => {
        it('should render title in header', () => {
            const { container } = render(
                React.createElement(TradingGridCard, {
                    title: 'Test Title',
                    children: 'Content',
                })
            );

            const header = container.querySelector('.ark-card__header');
            expect(header).not.toBeNull();
            expect(header?.textContent).toContain('Test Title');
        });

        it('should render children content', () => {
            const testContent = 'Trading position details';

            const { container } = render(
                React.createElement(TradingGridCard, {
                    title: 'Position',
                    children: testContent,
                })
            );

            expect(container.textContent).toContain(testContent);
        });

        it('should hide header when showHeader is false', () => {
            const { container } = render(
                React.createElement(TradingGridCard, {
                    title: 'No Header',
                    showHeader: false,
                    children: 'Content',
                })
            );

            const header = container.querySelector('.ark-card__header');
            expect(header).toBeNull();
        });
    });
});
