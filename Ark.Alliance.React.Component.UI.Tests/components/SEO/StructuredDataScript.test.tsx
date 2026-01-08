/**
 * @fileoverview StructuredDataScript Component Unit Tests
 * @module tests/components/SEO/StructuredDataScript
 * 
 * Tests StructuredDataScript component for JSON-LD injection.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { TEST_URLS, TEST_ORG, TEST_PERSON } from '../../fixtures/testConstants';

// Import real component from library
import { StructuredDataScript } from '../../../Ark.Alliance.React.Component.UI/src/components/SEO/StructuredDataScript';

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

describe('StructuredDataScript Component', () => {
    const mockOrganizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: TEST_ORG.NAME,
        url: TEST_ORG.URL,
    };

    const mockPersonSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: TEST_PERSON.NAME,
        jobTitle: TEST_PERSON.JOB_TITLE,
    };

    describe('SDS-001: Basic Rendering', () => {
        it('should render script tag with single schema', () => {
            const { container } = render(
                React.createElement(StructuredDataScript, {
                    schemas: mockOrganizationSchema,
                })
            );

            const scripts = container.querySelectorAll('script[type="application/ld+json"]');
            expect(scripts.length).toBe(1);
        });

        it('should render multiple script tags for array of schemas', () => {
            const { container } = render(
                React.createElement(StructuredDataScript, {
                    schemas: [mockOrganizationSchema, mockPersonSchema],
                })
            );

            const scripts = container.querySelectorAll('script[type="application/ld+json"]');
            expect(scripts.length).toBe(2);
        });

        it('should embed JSON content correctly', () => {
            const { container } = render(
                React.createElement(StructuredDataScript, {
                    schemas: mockOrganizationSchema,
                })
            );

            const script = container.querySelector('script[type="application/ld+json"]');
            const content = JSON.parse(script?.textContent || '{}');

            expect(content['@context']).toBe('https://schema.org');
            expect(content['@type']).toBe('Organization');
            expect(content.name).toBe(TEST_ORG.NAME);
        });
    });

    describe('SDS-002: Pretty Print', () => {
        it('should pretty-print JSON by default', () => {
            const { container } = render(
                React.createElement(StructuredDataScript, {
                    schemas: mockOrganizationSchema,
                })
            );

            const script = container.querySelector('script[type="application/ld+json"]');
            const content = script?.textContent || '';

            // Pretty-printed JSON has newlines and indentation
            expect(content).toContain('\n');
            expect(content).toContain('  '); // 2-space indent
        });

        it('should NOT pretty-print when prettyPrint is false', () => {
            const { container } = render(
                React.createElement(StructuredDataScript, {
                    schemas: mockOrganizationSchema,
                    prettyPrint: false,
                })
            );

            const script = container.querySelector('script[type="application/ld+json"]');
            const content = script?.textContent || '';

            // Minified JSON should not have indentation
            expect(content).not.toContain('  "');
        });
    });

    describe('SDS-003: Schema Types', () => {
        it('should handle Organization schema', () => {
            const { container } = render(
                React.createElement(StructuredDataScript, {
                    schemas: mockOrganizationSchema,
                })
            );

            const script = container.querySelector('script[type="application/ld+json"]');
            const content = JSON.parse(script?.textContent || '{}');

            expect(content['@type']).toBe('Organization');
        });

        it('should handle Person schema', () => {
            const { container } = render(
                React.createElement(StructuredDataScript, {
                    schemas: mockPersonSchema,
                })
            );

            const script = container.querySelector('script[type="application/ld+json"]');
            const content = JSON.parse(script?.textContent || '{}');

            expect(content['@type']).toBe('Person');
        });

        it('should handle Article schema', () => {
            const articleSchema = {
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: 'Test Article',
            };

            const { container } = render(
                React.createElement(StructuredDataScript, {
                    schemas: articleSchema,
                })
            );

            const script = container.querySelector('script[type="application/ld+json"]');
            const content = JSON.parse(script?.textContent || '{}');

            expect(content['@type']).toBe('Article');
            expect(content.headline).toBe('Test Article');
        });

        it('should handle BreadcrumbList schema', () => {
            const breadcrumbSchema = {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home' },
                ],
            };

            const { container } = render(
                React.createElement(StructuredDataScript, {
                    schemas: breadcrumbSchema,
                })
            );

            const script = container.querySelector('script[type="application/ld+json"]');
            const content = JSON.parse(script?.textContent || '{}');

            expect(content['@type']).toBe('BreadcrumbList');
            expect(content.itemListElement.length).toBe(1);
        });
    });

    describe('SDS-004: Multiple Schemas', () => {
        it('should render multiple schemas in correct order', () => {
            const { container } = render(
                React.createElement(StructuredDataScript, {
                    schemas: [mockOrganizationSchema, mockPersonSchema],
                })
            );

            const scripts = container.querySelectorAll('script[type="application/ld+json"]');
            const firstContent = JSON.parse(scripts[0]?.textContent || '{}');
            const secondContent = JSON.parse(scripts[1]?.textContent || '{}');

            expect(firstContent['@type']).toBe('Organization');
            expect(secondContent['@type']).toBe('Person');
        });

        it('should handle 3+ schemas', () => {
            const webSiteSchema = {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Test Site',
            };

            const { container } = render(
                React.createElement(StructuredDataScript, {
                    schemas: [mockOrganizationSchema, mockPersonSchema, webSiteSchema],
                })
            );

            const scripts = container.querySelectorAll('script[type="application/ld+json"]');
            expect(scripts.length).toBe(3);
        });
    });

    describe('SDS-005: Validation', () => {
        it('should not throw when validate is false (default)', () => {
            expect(() => {
                render(
                    React.createElement(StructuredDataScript, {
                        schemas: mockOrganizationSchema,
                        validate: false,
                    })
                );
            }).not.toThrow();
        });

        it('should handle validate option', () => {
            // Should not throw even with validation
            expect(() => {
                render(
                    React.createElement(StructuredDataScript, {
                        schemas: mockOrganizationSchema,
                        validate: true,
                    })
                );
            }).not.toThrow();
        });
    });

    describe('SDS-006: Empty/Invalid Cases', () => {
        it('should handle empty object gracefully', () => {
            const { container } = render(
                React.createElement(StructuredDataScript, {
                    schemas: {},
                })
            );

            const script = container.querySelector('script[type="application/ld+json"]');
            const content = JSON.parse(script?.textContent || '{}');

            expect(content).toEqual({});
        });

        it('should handle empty array', () => {
            const { container } = render(
                React.createElement(StructuredDataScript, {
                    schemas: [],
                })
            );

            const scripts = container.querySelectorAll('script[type="application/ld+json"]');
            expect(scripts.length).toBe(0);
        });
    });

    describe('SDS-007: Complex Schemas', () => {
        it('should handle nested objects', () => {
            const complexSchema = {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Ark Alliance',
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: '123 Main St',
                },
                contactPoint: {
                    '@type': 'ContactPoint',
                    email: 'contact@example.com',
                },
            };

            const { container } = render(
                React.createElement(StructuredDataScript, {
                    schemas: complexSchema,
                })
            );

            const script = container.querySelector('script[type="application/ld+json"]');
            const content = JSON.parse(script?.textContent || '{}');

            expect(content.address['@type']).toBe('PostalAddress');
            expect(content.contactPoint.email).toBe('contact@example.com');
        });

        it('should handle arrays in schema', () => {
            const orgWithSameAs = {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Ark Alliance',
                sameAs: [
                    'https://twitter.com/ark',
                    'https://github.com/ark',
                ],
            };

            const { container } = render(
                React.createElement(StructuredDataScript, {
                    schemas: orgWithSameAs,
                })
            );

            const script = container.querySelector('script[type="application/ld+json"]');
            const content = JSON.parse(script?.textContent || '{}');

            expect(content.sameAs.length).toBe(2);
            expect(content.sameAs[0]).toBe('https://twitter.com/ark');
        });
    });
});
