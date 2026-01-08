/**
 * @fileoverview Base SEO Model Schema  
 * @module core/base/SEO
 * @description Base model for all SEO-related components with common schema properties.
 */

import { z } from 'zod';
import { BaseModelSchema } from '../BaseComponentModel';

/**
 * Base SEO Model Schema
 * 
 * Common properties for SEO components:
 * - baseUrl: Base URL for generating absolute URLs in schemas
 * - generateSchema: Whether to generate JSON-LD structured data
 * 
 * Extends BaseModelSchema with SEO-specific properties.
 */
export const BaseSEOModelSchema = BaseModelSchema.extend({
    /**
     * Base URL for schema generation (e.g., 'https://example.com')
     * Used to convert relative URLs to absolute URLs in JSON-LD schemas
     */
    baseUrl: z.string().url().optional(),

    /**
     * Whether to generate JSON-LD structured data
     * @default true
     */
    generateSchema: z.boolean().default(true),
});

export type BaseSEOModel = z.infer<typeof BaseSEOModelSchema>;

/**
 * Default BaseSEOModel values
 */
export const defaultBaseSEOModel: Partial<BaseSEOModel> = {
    generateSchema: true,
    disabled: false,
    loading: false,
};

/**
 * Extend BaseSEOModel with component-specific properties
 * Follows same pattern as extendSchema from BaseComponentModel
 * 
 * @example
 * ```typescript
 * export const MyComponentSchema = extendSEOSchema({
 *   myProp: z.string(),
 * });
 * ```
 */
export function extendSEOSchema<T extends z.ZodRawShape>(
    extension: T
): z.ZodObject<typeof BaseSEOModelSchema.shape & T> {
    return BaseSEOModelSchema.extend(extension);
}
