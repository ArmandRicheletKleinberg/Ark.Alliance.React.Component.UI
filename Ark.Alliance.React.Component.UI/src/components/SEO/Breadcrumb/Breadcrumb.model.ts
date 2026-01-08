/**
 * @fileoverview Breadcrumb Component Model
 * @module components/SEO/Breadcrumb
 */

import { z } from 'zod';
import { extendSEOSchema, defaultBaseSEOModel } from '../../../core/base/SEO';

// ═══════════════════════════════════════════════════════════════════════════
// BREADCRUMB ITEM SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const BreadcrumbItemSchema = z.object({
    /** Unique key for React rendering */
    key: z.string(),
    /** Display label */
    label: z.string(),
    /** URL href (optional for current page) */
    href: z.string().optional(),
    /** Icon name (FontAwesome) */
    icon: z.string().optional(),
    /** Whether this is the current/active page */
    current: z.boolean().default(false),
    /** Position in breadcrumb trail (for schema.org) */
    position: z.number().positive(),
});

export type BreadcrumbItemModel = z.infer<typeof BreadcrumbItemSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// BREADCRUMB SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const BreadcrumbSchema = extendSEOSchema({
    /** Breadcrumb items */
    items: z.array(BreadcrumbItemSchema).min(1),

    /** Separator character/element */
    separator: z.enum(['/', '>', '→', '·']).default('/'),

    /** Custom separator component/string */
    customSeparator: z.string().optional(),

    /** Show home icon for first item */
    showHomeIcon: z.boolean().default(false),

    /** Size variant */
    size: z.enum(['sm', 'md', 'lg']).default('md'),

    /** Visual variant */
    variant: z.enum(['default', 'minimal', 'pills']).default('default'),
});

export type BreadcrumbModel = z.infer<typeof BreadcrumbSchema>;

/**
 * Default breadcrumb model
 */
export const defaultBreadcrumbModel: Partial<BreadcrumbModel> = {
    ...defaultBaseSEOModel,
    items: [],
    separator: '/',
    showHomeIcon: false,
    size: 'md',
    variant: 'default',
};
