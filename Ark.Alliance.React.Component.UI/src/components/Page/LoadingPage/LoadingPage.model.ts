/**
 * @fileoverview LoadingPage Model
 * @module components/Page/LoadingPage
 * 
 * Model for loading page with animated logo and progress.
 * 
 * @author Armand Richelet-Kleinberg with the assistance of Anthropic Claude Opus 4.5
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * LoadingPage model schema
 * Extends base component model with loading-specific properties
 */
export const LoadingPageModelSchema = extendSchema({
    /** Logo image URL */
    logoUrl: z.string().url().optional(),

    /** Application name */
    appName: z.string().optional(),

    /** Loading message(s) - single string or array for rotation */
    message: z.union([z.string(), z.array(z.string())]).optional(),

    /** Progress value (0-100) */
    progress: z.number().min(0).max(100).optional(),

    /** Show progress bar */
    showProgress: z.boolean().default(true),

    /** Animate logo (pulse/glow effect) */
    animated: z.boolean().default(true),

    /** Spinner type */
    spinnerType: z.enum(['dots', 'ring', 'pulse', 'bars']).default('ring'),

    /** Custom CSS class for logo */
    logoClassName: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type LoadingPageModel = z.infer<typeof LoadingPageModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

export const defaultLoadingPageModel: Partial<LoadingPageModel> = {
    showProgress: true,
    animated: true,
    spinnerType: 'ring',
    message: 'Loading...',
};

/**
 * Create a LoadingPage model
 * 
 * @example
 * ```ts
 * const model = createLoadingPageModel({
 *   logoUrl: '/logo.png',
 *   appName: 'My App',
 *   message: 'Loading resources...',
 *   progress: 75
 * });
 * ```
 */
export function createLoadingPageModel(data: Partial<LoadingPageModel> = {}): LoadingPageModel {
    return LoadingPageModelSchema.parse({ ...defaultLoadingPageModel, ...data });
}
