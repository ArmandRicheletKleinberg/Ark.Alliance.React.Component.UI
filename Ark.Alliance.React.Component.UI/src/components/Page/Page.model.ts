/**
 * @fileoverview Page Component Model
 * @module components/Page
 * 
 * Model definitions for the Page layout component.
 * Provides a standardized page wrapper with header, content, and metadata.
 */

import { z } from 'zod';
import { extendSchema } from '../../core/base';
import { PaddingSchema, type Padding } from '../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Page breadcrumb item schema
 */
export const BreadcrumbItemSchema = z.object({
    /** Display label */
    label: z.string(),
    /** Navigation path/URL */
    path: z.string().optional(),
    /** Icon (emoji or string) */
    icon: z.string().optional(),
});

/**
 * Page model schema extending BaseModel
 */
export const PageModelSchema = extendSchema({
    /** Page title displayed in header */
    title: z.string(),

    /** Page subtitle or description */
    subtitle: z.string().optional(),

    /** Page icon (emoji or icon component key) */
    icon: z.string().optional(),

    /** Item count badge (e.g., "5 components") */
    itemCount: z.number().optional(),

    /** Item count label (default: "items") */
    itemLabel: z.string().default('items'),

    /** Breadcrumb navigation items */
    breadcrumbs: z.array(BreadcrumbItemSchema).optional(),

    /** Show header section */
    showHeader: z.boolean().default(true),

    /** Show back button */
    showBackButton: z.boolean().default(false),

    /** Header variant (component-specific) */
    headerVariant: z.enum(['default', 'compact', 'hero']).default('default'),

    /** Layout variant (component-specific) */
    layout: z.enum(['default', 'centered', 'wide']).default('default'),

    /** Content padding */
    padding: PaddingSchema.default('md'),

    /** Dark mode */
    isDark: z.boolean().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type BreadcrumbItem = z.infer<typeof BreadcrumbItemSchema>;
export type PageModel = z.infer<typeof PageModelSchema>;

/**
 * Default page model values
 */
export const defaultPageModel: PageModel = PageModelSchema.parse({
    title: '',
});

/**
 * Factory function to create a Page model
 * @param data - Partial page model data
 * @returns Validated PageModel
 */
export function createPageModel(data: Partial<PageModel> = {}): PageModel {
    return PageModelSchema.parse({ ...defaultPageModel, ...data });
}
