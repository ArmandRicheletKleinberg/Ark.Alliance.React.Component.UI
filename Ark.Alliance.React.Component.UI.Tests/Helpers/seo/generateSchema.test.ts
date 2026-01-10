/**
 * @fileoverview SEO Helper Functions Unit Tests
 * @module tests/Helpers/seo
 * 
 * Tests Schema.org generation helper functions.
 */

import { describe, it, expect } from 'vitest';
import { TEST_URLS, TEST_ORG, TEST_PERSON, TEST_SOCIAL } from '../../fixtures/testConstants';
import {
    generateBreadcrumbListSchema,
    generateOrganizationSchema,
    generateWebSiteSchema,
    generatePersonSchema,
    generateArticleSchema,
    generateFAQPageSchema,
    validateSchema,
    SchemaType,
} from '../../../Ark.Alliance.React.Component.UI/src/Helpers/seo/generateSchema';

describe('SEO Helper Functions', () => {
    describe('SH-001: generateBreadcrumbListSchema', () => {
        it('should generate valid BreadcrumbList schema', () => {
            const items = [
                { position: 1, name: 'Home', item: TEST_URLS.HOME },
                { position: 2, name: 'Projects', item: TEST_URLS.PROJECTS },
            ];

            const schema = generateBreadcrumbListSchema(items);

            expect(schema['@context']).toBe('https://schema.org');
            expect(schema['@type']).toBe(SchemaType.BREADCRUMB_LIST);
            expect(schema.itemListElement.length).toBe(2);
            expect(schema.itemListElement[0].position).toBe(1);
        });

        it('should handle items without URLs', () => {
            const items = [
                { position: 1, name: 'Home' },
                { position: 2, name: 'Current Page' },
            ];

            const schema = generateBreadcrumbListSchema(items);

            expect(schema.itemListElement[0]).not.toHaveProperty('item');
        });
    });

    describe('SH-002: generateOrganizationSchema', () => {
        it('should generate valid Organization schema', () => {
            const org = {
                name: TEST_ORG.NAME,
                url: TEST_ORG.URL,
                logo: TEST_ORG.LOGO,
            };

            const schema = generateOrganizationSchema(org);

            expect(schema['@context']).toBe('https://schema.org');
            expect(schema['@type']).toBe(SchemaType.ORGANIZATION);
            expect(schema.name).toBe(TEST_ORG.NAME);
            expect(schema.logo).toBe(TEST_ORG.LOGO);
        });

        it('should include contact point when provided', () => {
            const org = {
                name: TEST_ORG.NAME,
                url: TEST_ORG.URL,
                contactPoint: {
                    email: TEST_ORG.EMAIL,
                    telephone: TEST_ORG.PHONE,
                },
            };

            const schema = generateOrganizationSchema(org);

            expect(schema.contactPoint['@type']).toBe('ContactPoint');
            expect(schema.contactPoint.email).toBe(TEST_ORG.EMAIL);
        });

        it('should include sameAs links', () => {
            const org = {
                name: TEST_ORG.NAME,
                url: TEST_ORG.URL,
                sameAs: [TEST_SOCIAL.TWITTER, TEST_SOCIAL.GITHUB],
            };

            const schema = generateOrganizationSchema(org);

            expect(schema.sameAs).toEqual(org.sameAs);
        });
    });

    describe('SH-003: generateWebSiteSchema', () => {
        it('should generate valid WebSite schema', () => {
            const schema = generateWebSiteSchema(
                'Ark Alliance CMS',
                'https://example.com',
                'AI-powered CMS'
            );

            expect(schema['@context']).toBe('https://schema.org');
            expect(schema['@type']).toBe(SchemaType.WEBSITE);
            expect(schema.name).toBe('Ark Alliance CMS');
            expect(schema.url).toBe('https://example.com');
            expect(schema.description).toBe('AI-powered CMS');
        });

        it('should work without description', () => {
            const schema = generateWebSiteSchema('Test Site', 'https://test.com');

            expect(schema).not.toHaveProperty('description');
        });
    });

    describe('SH-004: generatePersonSchema', () => {
        it('should generate valid Person schema', () => {
            const person = {
                name: 'Armand Richelet-Kleinberg',
                jobTitle: 'Software Architect',
                email: 'armand@example.com',
            };

            const schema = generatePersonSchema(person);

            expect(schema['@context']).toBe('https://schema.org');
            expect(schema['@type']).toBe(SchemaType.PERSON);
            expect(schema.name).toBe('Armand Richelet-Kleinberg');
            expect(schema.jobTitle).toBe('Software Architect');
        });

        it('should include image and sameAs', () => {
            const person = {
                name: 'John Doe',
                image: 'https://example.com/avatar.jpg',
                sameAs: ['https://twitter.com/johndoe'],
            };

            const schema = generatePersonSchema(person);

            expect(schema.image).toBe('https://example.com/avatar.jpg');
            expect(schema.sameAs).toEqual(person.sameAs);
        });
    });

    describe('SH-005: generateArticleSchema', () => {
        it('should generate Article schema', () => {
            const article = {
                headline: 'SEO Best Practices',
                description: 'Complete guide to SEO',
                author: { name: 'Armand' },
                publishedAt: '2026-01-07',
            };

            const schema = generateArticleSchema(article);

            expect(schema['@type']).toBe(SchemaType.ARTICLE);
            expect(schema.headline).toBe('SEO Best Practices');
            expect(schema.author['@type']).toBe(SchemaType.PERSON);
        });

        it('should generate BlogPosting schema', () => {
            const article = {
                headline: 'My Blog Post',
                author: { name: 'Author' },
                publishedAt: '2026-01-07',
            };

            const schema = generateArticleSchema(article, 'BlogPosting');

            expect(schema['@type']).toBe(SchemaType.BLOG_POSTING);
        });

        it('should include modified date', () => {
            const article = {
                headline: 'Updated Article',
                author: { name: 'Author' },
                publishedAt: '2026-01-01',
                modifiedAt: '2026-01-07',
            };

            const schema = generateArticleSchema(article);

            expect(schema.dateModified).toBe('2026-01-07');
        });
    });

    describe('SH-006: generateFAQPageSchema', () => {
        it('should generate FAQPage schema', () => {
            const faqs = [
                { question: 'What is SEO?', answer: 'Search Engine Optimization' },
                { question: 'What is AEO?', answer: 'Answer Engine Optimization' },
            ];

            const schema = generateFAQPageSchema(faqs);

            expect(schema['@type']).toBe(SchemaType.FAQ_PAGE);
            expect(schema.mainEntity.length).toBe(2);
            expect(schema.mainEntity[0]['@type']).toBe('Question');
            expect(schema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
        });
    });

    describe('SH-007: validateSchema', () => {
        it('should return true for valid schema', () => {
            const schema = {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Test',
            };

            expect(validateSchema(schema)).toBe(true);
        });

        it('should return false for schema missing @context', () => {
            const schema = {
                '@type': 'Organization',
                name: 'Test',
            };

            expect(validateSchema(schema)).toBe(false);
        });

        it('should return false for schema missing @type', () => {
            const schema = {
                '@context': 'https://schema.org',
                name: 'Test',
            };

            expect(validateSchema(schema)).toBe(false);
        });
    });
});

// ═══════════════════════════════════════════════════════════════════════════
// EDGE CASE & ERROR HANDLING TESTS (SH-008+) - Based on Real-World Research
// ═══════════════════════════════════════════════════════════════════════════

describe('SH-008: BreadcrumbList Error Handling', () => {
    it('should handle empty items array', () => {
        const schema = generateBreadcrumbListSchema([]);

        expect(schema['@type']).toBe(SchemaType.BREADCRUMB_LIST);
        expect(schema.itemListElement).toHaveLength(0);
    });

    it('should handle items with empty names', () => {
        const items = [
            { position: 1, name: '', item: TEST_URLS.HOME },
        ];

        const schema = generateBreadcrumbListSchema(items);

        expect(schema.itemListElement[0].name).toBe('');
    });

    it('should handle very long breadcrumb trails (100+ items)', () => {
        const items = Array.from({ length: 100 }, (_, i) => ({
            position: i + 1,
            name: `Level ${i + 1}`,
            item: `${TEST_URLS.HOME}/level-${i + 1}`,
        }));

        const schema = generateBreadcrumbListSchema(items);

        expect(schema.itemListElement).toHaveLength(100);
        expect(schema.itemListElement[99].position).toBe(100);
    });

    it('should handle Unicode names in breadcrumbs', () => {
        const items = [
            { position: 1, name: '首页', item: TEST_URLS.HOME },
            { position: 2, name: 'الرئيسية', item: `${TEST_URLS.HOME}/ar` },
            { position: 3, name: '🏠 Emoji Home', item: `${TEST_URLS.HOME}/emoji` },
        ];

        const schema = generateBreadcrumbListSchema(items);

        expect(schema.itemListElement[0].name).toBe('首页');
        expect(schema.itemListElement[2].name).toContain('🏠');
    });
});

describe('SH-009: Organization Schema Error Handling', () => {
    it('should handle minimal organization (name only)', () => {
        const org = { name: 'Minimal Org' };

        const schema = generateOrganizationSchema(org);

        expect(schema['@type']).toBe(SchemaType.ORGANIZATION);
        expect(schema.name).toBe('Minimal Org');
    });

    it('should handle organization with empty sameAs array', () => {
        const org = {
            name: TEST_ORG.NAME,
            url: TEST_ORG.URL,
            sameAs: [],
        };

        const schema = generateOrganizationSchema(org);

        expect(schema.sameAs).toEqual([]);
    });

    it('should handle special characters in organization name', () => {
        const org = {
            name: 'Test & Co. "Special" <Corp>',
            url: TEST_ORG.URL,
        };

        const schema = generateOrganizationSchema(org);

        expect(schema.name).toContain('&');
        expect(schema.name).toContain('"');
    });
});

describe('SH-010: Person Schema Error Handling', () => {
    it('should handle person with name only', () => {
        const person = { name: 'John Doe' };

        const schema = generatePersonSchema(person);

        expect(schema['@type']).toBe(SchemaType.PERSON);
        expect(schema.name).toBe('John Doe');
    });

    it('should handle person with complex sameAs URLs', () => {
        const person = {
            name: TEST_PERSON.NAME,
            sameAs: [
                'https://twitter.com/user?ref=123',
                'https://linkedin.com/in/user#section',
                TEST_SOCIAL.GITHUB,
            ],
        };

        const schema = generatePersonSchema(person);

        expect(schema.sameAs).toHaveLength(3);
    });
});

describe('SH-011: Article Schema Error Handling', () => {
    it('should handle article with minimal data', () => {
        const article = {
            headline: 'Test Article',
            author: { name: 'Anonymous' },
            publishedAt: new Date().toISOString(),
        };

        const schema = generateArticleSchema(article);

        expect(schema['@type']).toBe(SchemaType.ARTICLE);
        expect(schema.headline).toBe('Test Article');
    });

    it('should handle very long headline', () => {
        const article = {
            headline: 'A'.repeat(200),
            author: { name: 'Test Author' },
            publishedAt: new Date().toISOString(),
        };

        const schema = generateArticleSchema(article);

        expect(schema.headline).toHaveLength(200);
    });

    it('should handle article with nested author object', () => {
        const article = {
            headline: 'Test',
            author: {
                '@type': 'Person',
                name: TEST_PERSON.NAME,
            },
        };

        const schema = generateArticleSchema(article);

        expect(schema.author.name).toBe(TEST_PERSON.NAME);
    });
});

describe('SH-012: FAQPage Schema Error Handling', () => {
    it('should handle empty FAQ array', () => {
        const schema = generateFAQPageSchema([]);

        expect(schema['@type']).toBe(SchemaType.FAQ_PAGE);
        expect(schema.mainEntity).toHaveLength(0);
    });

    it('should handle FAQ with special characters in questions/answers', () => {
        const faqs = [
            { question: 'What is "SEO" & why matters?', answer: '<p>It helps with search</p>' },
        ];

        const schema = generateFAQPageSchema(faqs);

        expect(schema.mainEntity[0].name).toContain('"SEO"');
        expect(schema.mainEntity[0].acceptedAnswer.text).toContain('<p>');
    });

    it('should handle large FAQ list (50+ items)', () => {
        const faqs = Array.from({ length: 50 }, (_, i) => ({
            question: `Question ${i + 1}`,
            answer: `Answer ${i + 1}`,
        }));

        const schema = generateFAQPageSchema(faqs);

        expect(schema.mainEntity).toHaveLength(50);
    });
});

describe('SH-013: validateSchema Edge Cases', () => {
    it('should return false for null input', () => {
        expect(validateSchema(null as any)).toBe(false);
    });

    it('should return false for undefined input', () => {
        expect(validateSchema(undefined as any)).toBe(false);
    });

    it('should return false for non-object input', () => {
        expect(validateSchema('string' as any)).toBe(false);
        expect(validateSchema(123 as any)).toBe(false);
    });

    it('should return true for schema with all valid fields', () => {
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: TEST_PERSON.NAME,
            jobTitle: TEST_PERSON.JOB_TITLE,
            sameAs: [TEST_SOCIAL.LINKEDIN, TEST_SOCIAL.GITHUB],
        };

        expect(validateSchema(schema)).toBe(true);
    });
});

