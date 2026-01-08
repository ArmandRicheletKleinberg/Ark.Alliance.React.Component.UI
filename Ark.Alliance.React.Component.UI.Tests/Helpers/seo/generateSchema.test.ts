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
