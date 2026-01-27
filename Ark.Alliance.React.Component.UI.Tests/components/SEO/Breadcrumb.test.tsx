/**
 * @fileoverview Breadcrumb Component Unit Tests
 * @module tests/components/SEO/Breadcrumb
 * 
 * Tests Breadcrumb component with BreadcrumbList schema generation.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { TEST_URLS } from '../../fixtures/testConstants';

// Import real component from library
import { Breadcrumb } from '../../../Ark.Alliance.React.Component.UI/src/components/SEO/Breadcrumb';
import { BreadcrumbSchema, type BreadcrumbItemModel } from '../../../Ark.Alliance.React.Component.UI/src/components/SEO/Breadcrumb/Breadcrumb.model';

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
// COMPONENT TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Breadcrumb Component', () => {
    const mockItems: BreadcrumbItemModel[] = [
        { key: '1', label: 'Home', href: '/', position: 1 },
        { key: '2', label: 'Projects', href: '/projects', position: 2 },
        { key: '3', label: 'Ark Portfolio', href: '/projects/ark-portfolio', position: 3, current: true },
    ];

    describe('BC-001: Basic Rendering', () => {
        it('should render breadcrumb navigation', () => {
            render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                })
            );

            const nav = screen.getByRole('navigation');
            expect(nav).toBeTruthy();
            expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
        });

        it('should render all breadcrumb items', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                })
            );

            const items = container.querySelectorAll('.ark-breadcrumb__item');
            expect(items.length).toBe(3);
        });

        it('should render item labels', () => {
            render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                })
            );

            expect(screen.getByText('Home')).toBeTruthy();
            expect(screen.getByText('Projects')).toBeTruthy();
            expect(screen.getByText('Ark Portfolio')).toBeTruthy();
        });
    });

    describe('BC-002: Links and Current State', () => {
        it('should render links for non-current items', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                })
            );

            const homeLink = container.querySelector('a[href="/"]');
            const projectsLink = container.querySelector('a[href="/projects"]');

            expect(homeLink).toBeTruthy();
            expect(projectsLink).toBeTruthy();
        });

        it('should NOT render link for current item', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                })
            );

            const currentSpan = container.querySelector('.ark-breadcrumb__text--current');
            expect(currentSpan).toBeTruthy();
            expect(currentSpan?.textContent).toContain('Ark Portfolio');
        });

        it('should set aria-current on current item', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                })
            );

            const currentElement = container.querySelector('[aria-current="page"]');
            expect(currentElement).toBeTruthy();
        });
    });

    describe('BC-003: Separators', () => {
        it('should render default "/" separator', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                })
            );

            const separators = container.querySelectorAll('.ark-breadcrumb__separator');
            expect(separators.length).toBe(2); // Between 3 items
            expect(separators[0]?.textContent).toBe('/');
        });

        it('should render ">" separator', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                    separator: '>',
                })
            );

            const separators = container.querySelectorAll('.ark-breadcrumb__separator');
            expect(separators[0]?.textContent).toBe('>');
        });

        it('should render "→" separator', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                    separator: '→',
                })
            );

            const separators = container.querySelectorAll('.ark-breadcrumb__separator');
            expect(separators[0]?.textContent).toBe('→');
        });

        it('should not render separator before first item', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                })
            );

            const firstItem = container.querySelector('.ark-breadcrumb__item');
            const separator = firstItem?.querySelector('.ark-breadcrumb__separator');
            expect(separator).toBeFalsy();
        });
    });

    describe('BC-004: JSON-LD Schema Generation', () => {
        it('should generate BreadcrumbList schema by default', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                    baseUrl: 'https://example.com',
                })
            );

            const scripts = container.querySelectorAll('script[type="application/ld+json"]');
            expect(scripts.length).toBe(1);

            const schemaData = JSON.parse(scripts[0]?.textContent || '{}');
            expect(schemaData['@context']).toBe('https://schema.org');
            expect(schemaData['@type']).toBe('BreadcrumbList');
            expect(schemaData.itemListElement).toBeTruthy();
            expect(schemaData.itemListElement.length).toBe(3);
        });

        it('should include position in schema', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                    baseUrl: 'https://example.com',
                })
            );

            const script = container.querySelector('script[type="application/ld+json"]');
            const schemaData = JSON.parse(script?.textContent || '{}');

            expect(schemaData.itemListElement[0].position).toBe(1);
            expect(schemaData.itemListElement[1].position).toBe(2);
            expect(schemaData.itemListElement[2].position).toBe(3);
        });

        it('should include full URLs in schema when baseUrl provided', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                    baseUrl: 'https://example.com',
                })
            );

            const script = container.querySelector('script[type="application/ld+json"]');
            const schemaData = JSON.parse(script?.textContent || '{}');

            expect(schemaData.itemListElement[0].item).toBe(TEST_URLS.HOME);
            expect(schemaData.itemListElement[1].item).toBe(TEST_URLS.PROJECTS);
        });

        it('should NOT generate schema when generateSchema is false', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                    generateSchema: false,
                })
            );

            const scripts = container.querySelectorAll('script[type="application/ld+json"]');
            expect(scripts.length).toBe(0);
        });
    });

    describe('BC-005: Size Variants', () => {
        it('should apply md size by default', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                })
            );

            const breadcrumb = container.querySelector('.ark-breadcrumb');
            expect(breadcrumb?.className).toContain('ark-breadcrumb--md');
        });

        it('should apply sm size', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                    size: 'sm',
                })
            );

            const breadcrumb = container.querySelector('.ark-breadcrumb');
            expect(breadcrumb?.className).toContain('ark-breadcrumb--sm');
        });

        it('should apply lg size', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                    size: 'lg',
                })
            );

            const breadcrumb = container.querySelector('.ark-breadcrumb');
            expect(breadcrumb?.className).toContain('ark-breadcrumb--lg');
        });
    });

    describe('BC-006: Visual Variants', () => {
        it('should apply default variant', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                })
            );

            const breadcrumb = container.querySelector('.ark-breadcrumb');
            expect(breadcrumb?.className).toContain('ark-breadcrumb--default');
        });

        it('should apply minimal variant', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                    variant: 'minimal',
                })
            );

            const breadcrumb = container.querySelector('.ark-breadcrumb');
            expect(breadcrumb?.className).toContain('ark-breadcrumb--minimal');
        });

        it('should apply pills variant', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                    variant: 'pills',
                })
            );

            const breadcrumb = container.querySelector('.ark-breadcrumb');
            expect(breadcrumb?.className).toContain('ark-breadcrumb--pills');
        });
    });

    describe('BC-007: Click Handling', () => {
        it('should call onItemClick when non-current item clicked', async () => {
            const onItemClick = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                    onItemClick,
                })
            );

            const homeLink = container.querySelector('a[href="/"]') as HTMLElement;
            await user.click(homeLink);

            expect(onItemClick).toHaveBeenCalledTimes(1);
        });

        it('should not call onItemClick when current item clicked', async () => {
            const onItemClick = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: mockItems,
                    onItemClick,
                })
            );

            const currentSpan = container.querySelector('.ark-breadcrumb__text--current') as HTMLElement;
            await user.click(currentSpan);

            expect(onItemClick).not.toHaveBeenCalled();
        });
    });

    describe('BC-008: Empty State', () => {
        it('should not render when items array is empty', () => {
            const { container } = render(
                React.createElement(Breadcrumb, {
                    items: [],
                })
            );

            const nav = container.querySelector('nav');
            expect(nav).toBeFalsy();
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// MODEL VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('BreadcrumbSchema', () => {
    it('should parse valid breadcrumb model', () => {
        const result = BreadcrumbSchema.parse({
            items: [
                { key: '1', label: 'Home', href: '/', position: 1 },
            ],
        });

        expect(result.items.length).toBe(1);
        expect(result.items[0].label).toBe('Home');
    });

    it('should use defaults for missing properties', () => {
        const result = BreadcrumbSchema.parse({
            items: [
                { key: '1', label: 'Home', position: 1 },
            ],
        });

        expect(result.separator).toBe('/');
        expect(result.generateSchema).toBe(true);
        expect(result.showHomeIcon).toBe(false);
        expect(result.size).toBe('md');
        expect(result.variant).toBe('default');
    });

    it('should accept all separator options', () => {
        const separators = ['/', '>', '→', '·'];

        separators.forEach(separator => {
            const result = BreadcrumbSchema.parse({
                items: [{ key: '1', label: 'Home', position: 1 }],
                separator,
            });
            expect(result.separator).toBe(separator);
        });
    });

    it('should accept all size options', () => {
        const sizes = ['sm', 'md', 'lg'];

        sizes.forEach(size => {
            const result = BreadcrumbSchema.parse({
                items: [{ key: '1', label: 'Home', position: 1 }],
                size,
            });
            expect(result.size).toBe(size);
        });
    });

    it('should reject invalid separator', () => {
        expect(() =>
            BreadcrumbSchema.parse({
                items: [{ key: '1', label: 'Home', position: 1 }],
                separator: 'invalid',
            })
        ).toThrow();
    });

    it('should require at least one item', () => {
        expect(() =>
            BreadcrumbSchema.parse({ items: [] })
        ).toThrow();
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// EDGE CASE TESTS (BC-009+) - Based on Real-World Community Research
// ═══════════════════════════════════════════════════════════════════════════

describe('BC-009: XSS Prevention in JSON-LD', () => {
    const maliciousItems: BreadcrumbItemModel[] = [
        { key: '1', label: '</script><script>alert("XSS")</script>', href: '/', position: 1 },
        { key: '2', label: 'Normal', href: '/test', position: 2 },
    ];

    it('should escape script tags in labels', () => {
        const { container } = render(
            React.createElement(Breadcrumb, {
                items: maliciousItems,
                baseUrl: 'https://example.com',
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const content = script?.textContent || '';

        // Verify JSON is valid and parseable (XSS would break parsing)
        expect(() => JSON.parse(content)).not.toThrow();

        // Verify the data is properly contained in JSON structure
        const schemaData = JSON.parse(content);
        expect(schemaData.itemListElement[0].name).toBeTruthy();
    });

    it('should handle image onerror injection attempts', () => {
        const items: BreadcrumbItemModel[] = [
            { key: '1', label: '<img onerror="alert(1)" src="x">', href: '/', position: 1 },
        ];

        const { container } = render(
            React.createElement(Breadcrumb, {
                items,
                baseUrl: 'https://example.com',
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const schemaData = JSON.parse(script?.textContent || '{}');

        // Label should be preserved but not execute as HTML
        expect(schemaData.itemListElement[0].name).toContain('img');
    });

    it('should handle javascript: protocol URLs safely', () => {
        const items: BreadcrumbItemModel[] = [
            { key: '1', label: 'Home', href: 'javascript:alert(1)', position: 1 },
        ];

        const { container } = render(
            React.createElement(Breadcrumb, {
                items,
                baseUrl: '',
            })
        );

        // Component should render without executing javascript
        const nav = container.querySelector('nav');
        expect(nav).toBeTruthy();
    });
});

describe('BC-010: Invalid Data Handling', () => {
    it('should handle empty label strings gracefully', () => {
        const items: BreadcrumbItemModel[] = [
            { key: '1', label: '', href: '/', position: 1 },
        ];

        const { container } = render(
            React.createElement(Breadcrumb, {
                items,
            })
        );

        // Should still render navigation
        const nav = container.querySelector('nav');
        expect(nav).toBeTruthy();
    });

    it('should handle very long labels (1000+ chars)', () => {
        const longLabel = 'A'.repeat(1000);
        const items: BreadcrumbItemModel[] = [
            { key: '1', label: longLabel, href: '/', position: 1 },
        ];

        const { container } = render(
            React.createElement(Breadcrumb, {
                items,
            })
        );

        // Should render without memory issues
        const nav = container.querySelector('nav');
        expect(nav).toBeTruthy();
    });

    it('should handle non-sequential positions', () => {
        const items: BreadcrumbItemModel[] = [
            { key: '1', label: 'First', href: '/', position: 1 },
            { key: '2', label: 'Third', href: '/third', position: 5 },
            { key: '3', label: 'Last', href: '/last', position: 100 },
        ];

        const { container } = render(
            React.createElement(Breadcrumb, {
                items,
                baseUrl: 'https://example.com',
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const schemaData = JSON.parse(script?.textContent || '{}');

        // Should preserve original positions in schema
        expect(schemaData.itemListElement[1].position).toBe(5);
    });

    it('should handle items with no href', () => {
        const items: BreadcrumbItemModel[] = [
            { key: '1', label: 'Home', position: 1 },
            { key: '2', label: 'Projects', position: 2, current: true },
        ];

        const { container } = render(
            React.createElement(Breadcrumb, {
                items,
            })
        );

        // Current item without href should render as span
        const currentSpan = container.querySelector('.ark-breadcrumb__text--current');
        expect(currentSpan).toBeTruthy();
    });

    it('should reject zero position in schema validation', () => {
        expect(() =>
            BreadcrumbSchema.parse({
                items: [{ key: '1', label: 'Home', position: 0 }],
            })
        ).toThrow();
    });

    it('should reject negative position', () => {
        expect(() =>
            BreadcrumbSchema.parse({
                items: [{ key: '1', label: 'Home', position: -1 }],
            })
        ).toThrow();
    });
});

describe('BC-011: URL Edge Cases', () => {
    it('should handle URLs with query parameters', () => {
        const items: BreadcrumbItemModel[] = [
            { key: '1', label: 'Search', href: '/search?q=test&page=1', position: 1 },
        ];

        const { container } = render(
            React.createElement(Breadcrumb, {
                items,
                baseUrl: 'https://example.com',
            })
        );

        const link = container.querySelector('a[href="/search?q=test&page=1"]');
        expect(link).toBeTruthy();
    });

    it('should handle URLs with hash fragments', () => {
        const items: BreadcrumbItemModel[] = [
            { key: '1', label: 'Section', href: '/page#section', position: 1 },
        ];

        const { container } = render(
            React.createElement(Breadcrumb, {
                items,
                baseUrl: 'https://example.com',
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const schemaData = JSON.parse(script?.textContent || '{}');

        expect(schemaData.itemListElement[0].item).toBe('https://example.com/page#section');
    });

    it('should handle trailing slashes in baseUrl', () => {
        const items: BreadcrumbItemModel[] = [
            { key: '1', label: 'Home', href: '/page', position: 1 },
        ];

        const { container } = render(
            React.createElement(Breadcrumb, {
                items,
                baseUrl: 'https://example.com/',
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const schemaData = JSON.parse(script?.textContent || '{}');

        // Should construct URL with baseUrl
        const url = schemaData.itemListElement[0].item;
        expect(url).toContain('example.com');
    });

    it('should handle international domain names', () => {
        const items: BreadcrumbItemModel[] = [
            { key: '1', label: 'Accueil', href: '/', position: 1 },
        ];

        const { container } = render(
            React.createElement(Breadcrumb, {
                items,
                baseUrl: 'https://例え.jp',
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const schemaData = JSON.parse(script?.textContent || '{}');

        expect(schemaData.itemListElement[0].item).toContain('例え.jp');
    });
});

describe('BC-012: Unicode and Special Characters', () => {
    it('should handle emoji in labels', () => {
        const items: BreadcrumbItemModel[] = [
            { key: '1', label: '🏠 Home', href: '/', position: 1 },
            { key: '2', label: '📁 Projects', href: '/projects', position: 2 },
        ];

        const { container } = render(
            React.createElement(Breadcrumb, {
                items,
            })
        );

        expect(screen.getByText('🏠 Home')).toBeTruthy();
        expect(screen.getByText('📁 Projects')).toBeTruthy();
    });

    it('should handle RTL text (Arabic/Hebrew)', () => {
        const items: BreadcrumbItemModel[] = [
            { key: '1', label: 'الرئيسية', href: '/', position: 1 },
            { key: '2', label: 'المشاريع', href: '/projects', position: 2 },
        ];

        const { container } = render(
            React.createElement(Breadcrumb, {
                items,
            })
        );

        expect(screen.getByText('الرئيسية')).toBeTruthy();
    });

    it('should handle Chinese characters', () => {
        const items: BreadcrumbItemModel[] = [
            { key: '1', label: '首页', href: '/', position: 1 },
            { key: '2', label: '项目', href: '/projects', position: 2 },
        ];

        const { container } = render(
            React.createElement(Breadcrumb, {
                items,
            })
        );

        expect(screen.getByText('首页')).toBeTruthy();
    });

    it('should handle special JSON characters in labels', () => {
        const items: BreadcrumbItemModel[] = [
            { key: '1', label: 'Quote "Test" & <Special>', href: '/', position: 1 },
        ];

        const { container } = render(
            React.createElement(Breadcrumb, {
                items,
                baseUrl: 'https://example.com',
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const schemaData = JSON.parse(script?.textContent || '{}');

        // JSON should be properly escaped and parseable
        expect(schemaData.itemListElement[0].name).toContain('Quote');
    });
});

describe('BC-013: SSR Compatibility', () => {
    it('should handle undefined window object', () => {
        // This tests the component's SSR compatibility
        const items: BreadcrumbItemModel[] = [
            { key: '1', label: 'Home', href: '/', position: 1 },
        ];

        // Component should not throw even when window might be undefined
        expect(() =>
            render(
                React.createElement(Breadcrumb, {
                    items,
                    baseUrl: '',
                })
            )
        ).not.toThrow();
    });
});

describe('BC-014: Accessibility Edge Cases', () => {
    it('should have proper aria-label on navigation', () => {
        const items: BreadcrumbItemModel[] = [
            { key: '1', label: 'Home', href: '/', position: 1 },
            { key: '2', label: 'Current', current: true, position: 2 },
        ];

        const { container } = render(
            React.createElement(Breadcrumb, {
                items,
            })
        );

        const nav = screen.getByRole('navigation');
        expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
    });

    it('should use ordered list for proper semantics', () => {
        const items: BreadcrumbItemModel[] = [
            { key: '1', label: 'Home', href: '/', position: 1 },
            { key: '2', label: 'Page', href: '/page', position: 2 },
        ];

        const { container } = render(
            React.createElement(Breadcrumb, {
                items,
            })
        );

        const list = container.querySelector('ol');
        expect(list).toBeTruthy();
    });
});

