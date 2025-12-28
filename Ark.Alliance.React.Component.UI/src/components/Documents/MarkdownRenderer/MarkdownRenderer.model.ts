/**
 * @fileoverview MarkdownRenderer Component Model
 * @module components/Documents/MarkdownRenderer
 * 
 * Defines data structures, validation, and defaults for the MarkdownRenderer.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Mermaid theme options
 */
export const MermaidTheme = z.enum(['dark', 'default', 'forest', 'neutral']);

/**
 * Code syntax theme options
 */
export const SyntaxTheme = z.enum(['dark', 'light', 'github', 'monokai', 'dracula']);

/**
 * MarkdownRenderer model schema
 */
export const MarkdownRendererModelSchema = extendSchema({
    /** Markdown content to render */
    content: z.string().default(''),

    /** Enable Mermaid diagram rendering */
    enableMermaid: z.boolean().default(true),

    /** Mermaid theme */
    mermaidTheme: MermaidTheme.default('dark'),

    /** Enable GitHub Flavored Markdown */
    enableGfm: z.boolean().default(true),

    /** Enable syntax highlighting */
    enableSyntaxHighlight: z.boolean().default(true),

    /** Syntax highlighting theme */
    syntaxTheme: SyntaxTheme.default('dark'),

    /** Enable copy button on code blocks */
    enableCopyButton: z.boolean().default(true),

    /** Enable table of contents generation */
    enableToc: z.boolean().default(false),

    /** Maximum heading level for TOC (1-6) */
    tocMaxLevel: z.number().min(1).max(6).default(3),

    /** Enable link sanitization */
    sanitizeLinks: z.boolean().default(true),

    /** Open external links in new tab */
    externalLinksNewTab: z.boolean().default(true),

    /** Custom class for prose styling */
    proseSize: z.enum(['sm', 'base', 'lg', 'xl']).default('base'),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type MermaidThemeType = z.infer<typeof MermaidTheme>;
export type SyntaxThemeType = z.infer<typeof SyntaxTheme>;
export type MarkdownRendererModel = z.infer<typeof MarkdownRendererModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default MarkdownRenderer model values
 */
export const defaultMarkdownRendererModel: MarkdownRendererModel =
    MarkdownRendererModelSchema.parse({});

/**
 * Create a MarkdownRenderer model with custom values
 */
export function createMarkdownRendererModel(
    data: Partial<MarkdownRendererModel> = {}
): MarkdownRendererModel {
    return MarkdownRendererModelSchema.parse(data);
}

// ═══════════════════════════════════════════════════════════════════════════
// HEADING STRUCTURE (for TOC)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Represents a heading in the document for TOC generation
 */
export interface HeadingNode {
    id: string;
    text: string;
    level: number;
    children: HeadingNode[];
}

/**
 * Table of contents structure
 */
export interface TableOfContents {
    headings: HeadingNode[];
    flatList: { id: string; text: string; level: number }[];
}
