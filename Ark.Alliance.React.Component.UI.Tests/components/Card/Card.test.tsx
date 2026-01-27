/**
 * @fileoverview Card Component Unit Tests
 * @module tests/components/Card
 * 
 * Tests real Card component with mock data from scenarios.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import real component (GlowCard is the main Card component)
import { GlowCard as Card } from '@components/Cards';
import { CardModelSchema, CARD_STATUS_CONFIG } from '@components/Cards/Card.model';

import { loadCardScenario, SCENARIO_IDS } from '../../fixtures/TestScenarioLoader';

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

describe('Card Component', () => {
    describe('CARD-001: Clickable Behavior', () => {
        const scenario = loadCardScenario(SCENARIO_IDS.CARD_CLICK);

        it('should call onClick when clickable card is clicked', async () => {
            expect(scenario).not.toBeNull();

            const onClick = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(Card, {
                    title: 'Clickable Card',
                    clickable: true,
                    onClick,
                    children: 'Card content',
                })
            );

            const card = container.querySelector('.ark-card');
            expect(card).not.toBeNull();

            await user.click(card!);
            expect(onClick).toHaveBeenCalled();
        });

        it('should have clickable class when clickable prop is true', () => {
            const { container } = render(
                React.createElement(Card, {
                    title: 'Clickable Card',
                    clickable: true,
                    children: 'Card content',
                })
            );

            // Card should have clickable class from base component
            const card = container.querySelector('.ark-card');
            expect(card?.className).toContain('ark-card--clickable');
        });
    });

    describe('CARD-005: Disabled State', () => {
        const scenario = loadCardScenario(SCENARIO_IDS.CARD_DISABLED);

        it('should not call onClick when disabled', async () => {
            expect(scenario).not.toBeNull();

            const onClick = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(Card, {
                    title: 'Disabled Card',
                    clickable: true,
                    disabled: true,
                    onClick,
                    children: 'Card content',
                })
            );

            const card = container.querySelector('.ark-card');
            await user.click(card!);

            // onClick should not be called when disabled
            expect(onClick).not.toHaveBeenCalled();
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// MODEL VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('CardModelSchema', () => {
    it('should parse valid card model', () => {
        const result = CardModelSchema.parse({
            title: 'Test Card',
            status: 'success',
        });

        expect(result.title).toBe('Test Card');
        expect(result.status).toBe('success');
    });

    it('should use defaults for missing properties', () => {
        const result = CardModelSchema.parse({
            title: 'Minimal Card',
        });

        expect(result.status).toBe('info');
        expect(result.compact).toBe(false);
        expect(result.clickable).toBe(false);
        expect(result.showHeader).toBe(true);
    });

    it('should accept all status variants', () => {
        const statuses = ['success', 'warning', 'error', 'info'];

        statuses.forEach(status => {
            const result = CardModelSchema.parse({ title: 'Card', status });
            expect(result.status).toBe(status);
        });
    });

    it('should reject invalid status', () => {
        expect(() =>
            CardModelSchema.parse({ title: 'Card', status: 'invalid' })
        ).toThrow();
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// STATUS CONFIG TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('CARD_STATUS_CONFIG', () => {
    it('should have configuration for all status types', () => {
        expect(CARD_STATUS_CONFIG.success).toBeDefined();
        expect(CARD_STATUS_CONFIG.warning).toBeDefined();
        expect(CARD_STATUS_CONFIG.error).toBeDefined();
        expect(CARD_STATUS_CONFIG.info).toBeDefined();
    });

    it('should have border and glow colors for each status', () => {
        Object.values(CARD_STATUS_CONFIG).forEach(config => {
            expect(config.borderDark).toBeDefined();
            expect(config.borderLight).toBeDefined();
            expect(config.glowDark).toBeDefined();
            expect(config.glowLight).toBeDefined();
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// COMPACT MODE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Card Compact Mode', () => {
    it('should apply compact class when compact is true', () => {
        const { container } = render(
            React.createElement(Card, {
                title: 'Compact Card',
                compact: true,
                children: 'Content',
            })
        );

        const card = container.querySelector('.ark-card');
        expect(card?.className).toContain('ark-card--compact');
    });

    it('should not have compact class by default', () => {
        const { container } = render(
            React.createElement(Card, {
                title: 'Normal Card',
                children: 'Content',
            })
        );

        const card = container.querySelector('.ark-card');
        expect(card?.className).not.toContain('ark-card--compact');
    });
});
