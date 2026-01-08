/**
 * @fileoverview SEO Helper - Schema.org JSON-LD Generation
 * @module Helpers/seo
 * @description Type-safe Schema.org structured data generators for common schema types.
 * Supports BreadcrumbList, Organization, WebSite, Person, Article, FAQPage, and more.
 */

/**
 * Schema.org context constant
 */
export const SCHEMA_CONTEXT = 'https://schema.org';

/**
 * Common Schema.org types
 */
export enum SchemaType {
    BREADCRUMB_LIST = 'BreadcrumbList',
    ORGANIZATION = 'Organization',
    WEBSITE = 'WebSite',
    WEB_PAGE = 'WebPage',
    ARTICLE = 'Article',
    BLOG_POSTING = 'BlogPosting',
    PERSON = 'Person',
    FAQ_PAGE = 'FAQPage',
    CREATIVE_WORK = 'CreativeWork',
    HOW_TO = 'HowTo',
    ITEM_LIST = 'ItemList',
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface BreadcrumbItem {
    position: number;
    name: string;
    item?: string; // URL
}

export interface PersonSchema {
    name: string;
    url?: string;
    email?: string;
    jobTitle?: string;
    image?: string;
    sameAs?: string[];
}

export interface OrganizationSchema {
    name: string;
    url: string;
    logo?: string;
    sameAs?: string[];
    contactPoint?: {
        email?: string;
        telephone?: string;
        contactType?: string;
    };
    address?: string;
}

export interface ArticleSchema {
    headline: string;
    description?: string;
    author: PersonSchema;
    publishedAt: string; // ISO 8601
    modifiedAt?: string;
    image?: string;
    url?: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA GENERATORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate BreadcrumbList schema
 * @see https://schema.org/BreadcrumbList
 */
export function generateBreadcrumbListSchema(items: BreadcrumbItem[]): Record<string, any> {
    return {
        '@context': SCHEMA_CONTEXT,
        '@type': SchemaType.BREADCRUMB_LIST,
        itemListElement: items.map((item) => ({
            '@type': 'ListItem',
            position: item.position,
            name: item.name,
            ...(item.item && { item: item.item }),
        })),
    };
}

/**
 * Generate Organization schema
 * @see https://schema.org/Organization
 */
export function generateOrganizationSchema(org: OrganizationSchema): Record<string, any> {
    return {
        '@context': SCHEMA_CONTEXT,
        '@type': SchemaType.ORGANIZATION,
        name: org.name,
        url: org.url,
        ...(org.logo && { logo: org.logo }),
        ...(org.sameAs && { sameAs: org.sameAs }),
        ...(org.contactPoint && {
            contactPoint: {
                '@type': 'ContactPoint',
                ...org.contactPoint,
            },
        }),
        ...(org.address && {
            address: {
                '@type': 'PostalAddress',
                streetAddress: org.address,
            },
        }),
    };
}

/**
 * Generate WebSite schema
 * @see https://schema.org/WebSite
 */
export function generateWebSiteSchema(name: string, url: string, description?: string): Record<string, any> {
    return {
        '@context': SCHEMA_CONTEXT,
        '@type': SchemaType.WEBSITE,
        name,
        url,
        ...(description && { description }),
    };
}

/**
 * Generate Person schema
 * @see https://schema.org/Person
 */
export function generatePersonSchema(person: PersonSchema): Record<string, any> {
    return {
        '@context': SCHEMA_CONTEXT,
        '@type': SchemaType.PERSON,
        name: person.name,
        ...(person.url && { url: person.url }),
        ...(person.email && { email: person.email }),
        ...(person.jobTitle && { jobTitle: person.jobTitle }),
        ...(person.image && { image: person.image }),
        ...(person.sameAs && { sameAs: person.sameAs }),
    };
}

/**
 * Generate Article schema
 * @see https://schema.org/Article
 */
export function generateArticleSchema(article: ArticleSchema, type: 'Article' | 'BlogPosting' = 'Article'): Record<string, any> {
    return {
        '@context': SCHEMA_CONTEXT,
        '@type': type === 'BlogPosting' ? SchemaType.BLOG_POSTING : SchemaType.ARTICLE,
        headline: article.headline,
        ...(article.description && { description: article.description }),
        author: generatePersonSchema(article.author),
        datePublished: article.publishedAt,
        ...(article.modifiedAt && { dateModified: article.modifiedAt }),
        ...(article.image && { image: article.image }),
        ...(article.url && { url: article.url }),
    };
}

/**
 * Generate FAQPage schema
 * @see https://schema.org/FAQPage
 */
export function generateFAQPageSchema(faqs: FAQItem[]): Record<string, any> {
    return {
        '@context': SCHEMA_CONTEXT,
        '@type': SchemaType.FAQ_PAGE,
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}

/**
 * Validate schema object (basic validation)
 * @param schema - Schema object to validate
 * @returns true if valid, false otherwise
 */
export function validateSchema(schema: Record<string, any>): boolean {
    if (!schema['@context'] || !schema['@type']) {
        console.warn('Invalid schema: missing @context or @type', schema);
        return false;
    }
    return true;
}

/**
 * Convert schema object to JSON-LD script string
 * @param schema - Schema object
 * @returns JSON-LD script tag string
 */
export function schemaToScriptTag(schema: Record<string, any>): string {
    return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}
