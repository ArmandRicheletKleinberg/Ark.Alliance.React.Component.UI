/**
 * @fileoverview HTMLViewer Component Model
 * @module components/Documents/HTMLViewer
 * 
 * Defines the data structure for an HTML content viewer.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Viewer visual mode
 */
export const ViewerVisualMode = z.enum(['normal', 'neon', 'minimal', 'light']);

/**
 * Content fit mode
 */
export const ContentFitMode = z.enum(['contain', 'cover', 'auto', 'stretch']);

/**
 * HTMLViewer model schema
 */
export const HTMLViewerModelSchema = extendSchema({
    /** HTML content to display */
    content: z.string().default(''),

    /** Source URL to fetch content from (alternative to content) */
    src: z.string().optional(),

    /** Page title */
    title: z.string().optional(),

    /** Visual mode */
    visualMode: ViewerVisualMode.default('neon'),

    /** Content fit mode */
    fitMode: ContentFitMode.default('auto'),

    /** Whether to show the toolbar */
    showToolbar: z.boolean().default(true),

    /** Whether to show zoom controls */
    showZoom: z.boolean().default(true),

    /** Whether to show print button */
    showPrint: z.boolean().default(true),

    /** Whether to show fullscreen button */
    showFullscreen: z.boolean().default(true),

    /** Whether to show refresh button */
    showRefresh: z.boolean().default(true),

    /** Initial zoom level (percentage) */
    zoom: z.number().min(25).max(400).default(100),

    /** Min zoom level */
    minZoom: z.number().default(25),

    /** Max zoom level */
    maxZoom: z.number().default(400),

    /** Zoom step */
    zoomStep: z.number().default(25),

    /** Allow copy/select content */
    allowCopy: z.boolean().default(true),

    /** Enable sandbox for security */
    sandbox: z.boolean().default(true),

    /** Min height in pixels */
    minHeight: z.number().default(300),

    /** Loading state */
    isLoading: z.boolean().default(false),

    /** Error message */
    error: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type ViewerVisualModeType = z.infer<typeof ViewerVisualMode>;
export type ContentFitModeType = z.infer<typeof ContentFitMode>;
export type HTMLViewerModel = z.infer<typeof HTMLViewerModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default HTML viewer model
 */
export const defaultHTMLViewerModel: HTMLViewerModel = HTMLViewerModelSchema.parse({});

/**
 * Create an HTML viewer model with custom values
 */
export function createHTMLViewerModel(data: Partial<HTMLViewerModel> = {}): HTMLViewerModel {
    return HTMLViewerModelSchema.parse({ ...defaultHTMLViewerModel, ...data });
}
