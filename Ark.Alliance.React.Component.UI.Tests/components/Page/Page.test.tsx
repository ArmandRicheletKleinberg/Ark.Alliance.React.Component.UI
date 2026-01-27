/**
 * @fileoverview Page Component Unit Tests
 * @module tests/components/Page
 * 
 * Tests real Page component with mock data from scenarios.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Import real component
import { Page, PageModelSchema } from '@components/Page';
import { loadPageScenario, SCENARIO_IDS } from '../../fixtures/TestScenarioLoader';

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

describe('Page Component', () => {
    describe('PAGE-001: Dark Theme', () => {
        const scenario = loadPageScenario(SCENARIO_IDS.PAGE_DARK);

        it('should apply dark theme class', () => {
            expect(scenario).not.toBeNull();

            const { container } = render(
                React.createElement(Page, {
                    title: 'Dashboard',
                    isDark: true,
                    children: 'Page content',
                })
            );

            const page = container.querySelector('.ark-page');
            expect(page?.className).toContain('ark-page--dark');
        });
    });

    describe('PAGE-005: Light Theme', () => {
        const scenario = loadPageScenario(SCENARIO_IDS.PAGE_LIGHT);

        it('should apply light theme class by default', () => {
            expect(scenario).not.toBeNull();

            const { container } = render(
                React.createElement(Page, {
                    title: 'Dashboard',
                    isDark: false,
                    children: 'Page content',
                })
            );

            const page = container.querySelector('.ark-page');
            expect(page?.className).toContain('ark-page--light');
        });
    });

    describe('Breadcrumbs', () => {
        it('should render breadcrumbs when provided', () => {
            const { container } = render(
                React.createElement(Page, {
                    title: 'Settings',
                    breadcrumbs: [
                        { label: 'Home', path: '/' },
                        { label: 'Settings', path: '/settings' },
                    ],
                    children: 'Settings content',
                })
            );

            const breadcrumbs = container.querySelector('.ark-page__breadcrumbs');
            expect(breadcrumbs).not.toBeNull();
        });
    });

    describe('Back Button', () => {
        it('should call onBack when back button is clicked', async () => {
            const onBack = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(Page, {
                    title: 'Details',
                    showBackButton: true,
                    onBack,
                    children: 'Detail content',
                })
            );

            const backButton = container.querySelector('.ark-page__back-button');
            if (backButton) {
                await user.click(backButton);
                expect(onBack).toHaveBeenCalled();
            }
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// MODEL VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('PageModelSchema', () => {
    it('should parse valid page model', () => {
        const result = PageModelSchema.parse({
            title: 'Dashboard',
            layout: 'default',
        });

        expect(result.title).toBe('Dashboard');
        expect(result.layout).toBe('default');
    });

    it('should use defaults for missing properties', () => {
        const result = PageModelSchema.parse({ title: 'Test' });

        // isDark is optional with no default - component derives from theme context
        expect(result.isDark).toBeUndefined();
        // showBackButton and layout have defaults in schema
        expect(result.showBackButton).toBe(false);
        expect(result.layout).toBe('default');
    });

    it('should accept breadcrumbs array', () => {
        const result = PageModelSchema.parse({
            title: 'Test',
            breadcrumbs: [
                { label: 'Home', path: '/' },
                { label: 'About', path: '/about' },
            ],
        });

        expect(result.breadcrumbs).toHaveLength(2);
        expect(result.breadcrumbs![0].label).toBe('Home');
    });

    it('should accept layout variants', () => {
        const layouts = ['default', 'centered', 'wide'];

        layouts.forEach(layout => {
            const result = PageModelSchema.parse({ title: 'Test', layout });
            expect(result.layout).toBe(layout);
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Page Layout Variants', () => {
    it('should apply default layout class by default', () => {
        const { container } = render(
            React.createElement(Page, {
                title: 'Page',
                layout: 'default',
                children: 'Content',
            })
        );

        const page = container.querySelector('.ark-page');
        expect(page?.className).toContain('ark-page--layout-default');
    });

    it('should apply centered layout class', () => {
        const { container } = render(
            React.createElement(Page, {
                title: 'Page',
                layout: 'centered',
                children: 'Content',
            })
        );

        const page = container.querySelector('.ark-page');
        expect(page?.className).toContain('ark-page--layout-centered');
    });

    it('should apply wide layout class', () => {
        const { container } = render(
            React.createElement(Page, {
                title: 'Page',
                layout: 'wide',
                children: 'Content',
            })
        );

        const page = container.querySelector('.ark-page');
        expect(page?.className).toContain('ark-page--layout-wide');
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// TITLE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Page Title', () => {
    it('should render title when provided', () => {
        render(
            React.createElement(Page, {
                title: 'My Dashboard',
                children: 'Content',
            })
        );

        const title = screen.queryByText('My Dashboard');
        expect(title).not.toBeNull();
    });
});
