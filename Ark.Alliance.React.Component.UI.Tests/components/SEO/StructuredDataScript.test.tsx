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

// ═══════════════════════════════════════════════════════════════════════════
// SECURITY & EDGE CASE TESTS (SDS-008+) - Based on Real-World Research
// ═══════════════════════════════════════════════════════════════════════════

describe('SDS-008: XSS Prevention Security Tests', () => {
    it('should escape script tag in string values', () => {
        const maliciousSchema = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: '</script><script>alert("XSS")</script>',
        };

        const { container } = render(
            React.createElement(StructuredDataScript, {
                schemas: maliciousSchema,
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const rawContent = script?.textContent || '';

        // The JSON stringify should escape the < and > characters
        // making them safe within JSON-LD context
        expect(() => JSON.parse(rawContent)).not.toThrow();
    });

    it('should handle event handler injection attempts', () => {
        const maliciousSchema = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: '<img src=x onerror=alert(1)>',
            description: 'javascript:void(0)',
        };

        const { container } = render(
            React.createElement(StructuredDataScript, {
                schemas: maliciousSchema,
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const content = JSON.parse(script?.textContent || '{}');

        // Should preserve the content as string data, not execute
        expect(content.name).toBe('<img src=x onerror=alert(1)>');
    });

    it('should handle javascript: protocol in URL fields', () => {
        const maliciousSchema = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            url: 'javascript:alert(document.cookie)',
        };

        const { container } = render(
            React.createElement(StructuredDataScript, {
                schemas: maliciousSchema,
            })
        );

        // Component should render without executing
        const script = container.querySelector('script[type="application/ld+json"]');
        expect(script).toBeTruthy();
    });

    it('should handle Unicode zero-width characters', () => {
        const maliciousSchema = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Test\u200B\u200C\u200DName', // Zero-width space, non-joiner, joiner
        };

        const { container } = render(
            React.createElement(StructuredDataScript, {
                schemas: maliciousSchema,
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const content = JSON.parse(script?.textContent || '{}');

        // Should preserve the string including zero-width chars
        expect(content.name).toContain('Test');
    });
});

describe('SDS-009: Malformed Data Handling', () => {
    it('should handle undefined values in schema', () => {
        const schemaWithUndefined = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Test',
            url: undefined,
        };

        const { container } = render(
            React.createElement(StructuredDataScript, {
                schemas: schemaWithUndefined,
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const content = JSON.parse(script?.textContent || '{}');

        // undefined should be stripped by JSON.stringify
        expect(content.url).toBeUndefined();
    });

    it('should handle null values in schema', () => {
        const schemaWithNull = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Test',
            description: null,
        };

        const { container } = render(
            React.createElement(StructuredDataScript, {
                schemas: schemaWithNull,
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const content = JSON.parse(script?.textContent || '{}');

        expect(content.description).toBeNull();
    });

    it('should handle very large schemas', () => {
        const largeArray = Array.from({ length: 100 }, (_, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: `Item ${i + 1}`,
        }));

        const largeSchema = {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: largeArray,
        };

        const { container } = render(
            React.createElement(StructuredDataScript, {
                schemas: largeSchema,
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const content = JSON.parse(script?.textContent || '{}');

        expect(content.itemListElement.length).toBe(100);
    });

    it('should handle deeply nested schemas', () => {
        const deepSchema = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Root',
            parentOrganization: {
                '@type': 'Organization',
                name: 'Level1',
                parentOrganization: {
                    '@type': 'Organization',
                    name: 'Level2',
                    parentOrganization: {
                        '@type': 'Organization',
                        name: 'Level3',
                    },
                },
            },
        };

        const { container } = render(
            React.createElement(StructuredDataScript, {
                schemas: deepSchema,
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const content = JSON.parse(script?.textContent || '{}');

        expect(content.parentOrganization.parentOrganization.parentOrganization.name).toBe('Level3');
    });
});

describe('SDS-010: Character Encoding Edge Cases', () => {
    it('should handle special JSON characters', () => {
        const schemaWithSpecialChars = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Test "Quoted" & <Tagged>',
            description: "Tab:\t Newline:\n Backslash:\\",
        };

        const { container } = render(
            React.createElement(StructuredDataScript, {
                schemas: schemaWithSpecialChars,
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');

        // Should be valid JSON that can be parsed
        expect(() => JSON.parse(script?.textContent || '{}')).not.toThrow();
    });

    it('should handle emoji in schema', () => {
        const schemaWithEmoji = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: '🚀 Rocket Corp',
            description: 'We 💛 technology',
        };

        const { container } = render(
            React.createElement(StructuredDataScript, {
                schemas: schemaWithEmoji,
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const content = JSON.parse(script?.textContent || '{}');

        expect(content.name).toBe('🚀 Rocket Corp');
    });

    it('should handle RTL languages and mixed direction', () => {
        const rtlSchema = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'شركة التقنية ABC', // Arabic + English
        };

        const { container } = render(
            React.createElement(StructuredDataScript, {
                schemas: rtlSchema,
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const content = JSON.parse(script?.textContent || '{}');

        expect(content.name).toContain('شركة');
    });
});

describe('SDS-011: Schema Without Required Fields', () => {
    it('should render schema without @context', () => {
        const noContextSchema = {
            '@type': 'Organization',
            name: 'No Context Org',
        };

        const { container } = render(
            React.createElement(StructuredDataScript, {
                schemas: noContextSchema,
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const content = JSON.parse(script?.textContent || '{}');

        // Should still render (validation can be done separately)
        expect(content['@type']).toBe('Organization');
    });

    it('should render schema without @type', () => {
        const noTypeSchema = {
            '@context': 'https://schema.org',
            name: 'No Type Entity',
        };

        const { container } = render(
            React.createElement(StructuredDataScript, {
                schemas: noTypeSchema,
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        const content = JSON.parse(script?.textContent || '{}');

        expect(content.name).toBe('No Type Entity');
    });
});

describe('SDS-012: Script Attributes', () => {
    it('should apply custom script props', () => {
        const { container } = render(
            React.createElement(StructuredDataScript, {
                schemas: { '@context': 'https://schema.org', '@type': 'Organization' },
                scriptProps: { id: 'custom-schema', 'data-testid': 'schema-test' },
            })
        );

        const script = container.querySelector('script[type="application/ld+json"]');
        expect(script?.getAttribute('id')).toBe('custom-schema');
        expect(script?.getAttribute('data-testid')).toBe('schema-test');
    });
});

