/**
 * @fileoverview MarkdownRenderer Component ViewModel
 * @module components/Documents/MarkdownRenderer
 * 
 * Business logic and state management for the MarkdownRenderer component.
 * Handles Mermaid diagram rendering, TOC generation, and content processing.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBaseViewModel } from '../../../core/base';
import type { BaseViewModelResult } from '../../../core/base';
import mermaid from 'mermaid';
import {
    defaultMarkdownRendererModel,
    MarkdownRendererModelSchema,
} from './MarkdownRenderer.model';
import type {
    MarkdownRendererModel,
    TableOfContents,
    HeadingNode,
    MermaidThemeType,
} from './MarkdownRenderer.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * MarkdownRenderer ViewModel options
 */
export interface UseMarkdownRendererOptions extends Partial<MarkdownRendererModel> {
    /** Callback when content is rendered */
    onRender?: () => void;

    /** Callback when heading is clicked (for TOC navigation) */
    onHeadingClick?: (id: string) => void;

    /** Callback when link is clicked */
    onLinkClick?: (href: string, event: React.MouseEvent) => void;

    /** Callback when code is copied */
    onCodeCopy?: (code: string) => void;
}

/**
 * Mermaid diagram render state
 */
export interface MermaidDiagramState {
    id: string;
    code: string;
    svg: string | null;
    error: string | null;
    isLoading: boolean;
}

/**
 * MarkdownRenderer ViewModel return type
 */
export interface UseMarkdownRendererResult extends BaseViewModelResult<MarkdownRendererModel> {
    /** Table of contents structure */
    tableOfContents: TableOfContents | null;

    /** Mermaid diagrams state */
    mermaidDiagrams: Map<string, MermaidDiagramState>;

    /** Render a Mermaid diagram */
    renderMermaidDiagram: (id: string, code: string) => Promise<string | null>;

    /** Copy code to clipboard */
    copyCode: (code: string) => Promise<boolean>;

    /** Handle heading click */
    handleHeadingClick: (id: string) => void;

    /** Handle link click */
    handleLinkClick: (href: string, event: React.MouseEvent) => void;

    /** Generate ID from heading text */
    generateHeadingId: (text: string) => string;

    /** Check if link is external */
    isExternalLink: (href: string) => boolean;

    /** Prse class based on size */
    proseClass: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// MERMAID INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

let mermaidInitialized = false;

/**
 * Initialize Mermaid with theme
 */
function initializeMermaid(theme: MermaidThemeType): void {
    mermaid.initialize({
        startOnLoad: false,
        theme: theme,
        securityLevel: 'loose',
        fontFamily: 'var(--ark-font-mono, monospace)',
        flowchart: {
            htmlLabels: true,
            curve: 'basis',
            padding: 15,
        },
        sequence: {
            diagramMarginX: 50,
            diagramMarginY: 10,
            actorMargin: 50,
            width: 150,
            height: 65,
            boxMargin: 10,
            useMaxWidth: true,
        },
        gantt: {
            titleTopMargin: 25,
            barHeight: 20,
            barGap: 4,
            topPadding: 50,
            leftPadding: 75,
        },
    });
    mermaidInitialized = true;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * MarkdownRenderer ViewModel hook.
 * 
 * Provides functionality for:
 * - Mermaid diagram rendering
 * - Table of contents generation
 * - Code block copy functionality
 * - Link handling (external vs internal)
 * 
 * @example
 * ```tsx
 * function MyMarkdownViewer({ content }: { content: string }) {
 *   const vm = useMarkdownRenderer({
 *     content,
 *     enableMermaid: true,
 *     onCodeCopy: (code) => toast.success('Copied!'),
 *   });
 *   
 *   return <MarkdownRenderer {...vm} />;
 * }
 * ```
 */
export function useMarkdownRenderer(
    options: UseMarkdownRendererOptions = {}
): UseMarkdownRendererResult {
    // Parse model options
    const modelOptions = useMemo(() => {
        const { onRender, onHeadingClick, onLinkClick, onCodeCopy, ...modelData } = options;
        return MarkdownRendererModelSchema.parse({
            ...defaultMarkdownRendererModel,
            ...modelData
        });
    }, [options]);

    // Use base ViewModel
    const base = useBaseViewModel<MarkdownRendererModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'markdown',
        onMount: () => {
            if (modelOptions.enableMermaid && !mermaidInitialized) {
                initializeMermaid(modelOptions.mermaidTheme);
            }
        },
    });

    // Mermaid diagrams state
    const [mermaidDiagrams, setMermaidDiagrams] = useState<Map<string, MermaidDiagramState>>(
        new Map()
    );

    // ═══════════════════════════════════════════════════════════════════════
    // MERMAID RENDERING
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Render a Mermaid diagram
     */
    const renderMermaidDiagram = useCallback(async (
        id: string,
        code: string
    ): Promise<string | null> => {
        if (!base.model.enableMermaid) return null;

        // Initialize if needed
        if (!mermaidInitialized) {
            initializeMermaid(base.model.mermaidTheme);
        }

        // Set loading state
        setMermaidDiagrams(prev => {
            const next = new Map(prev);
            next.set(id, { id, code, svg: null, error: null, isLoading: true });
            return next;
        });

        try {
            const uniqueId = `mermaid-${id}-${Date.now()}`;
            const { svg } = await mermaid.render(uniqueId, code);

            setMermaidDiagrams(prev => {
                const next = new Map(prev);
                next.set(id, { id, code, svg, error: null, isLoading: false });
                return next;
            });

            base.emit('mermaid:rendered', { id, success: true });
            return svg;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to render diagram';

            setMermaidDiagrams(prev => {
                const next = new Map(prev);
                next.set(id, { id, code, svg: null, error: errorMessage, isLoading: false });
                return next;
            });

            base.emit('mermaid:error', { id, error: errorMessage });
            return null;
        }
    }, [base]);

    // ═══════════════════════════════════════════════════════════════════════
    // TABLE OF CONTENTS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Generate table of contents from content
     */
    const tableOfContents = useMemo((): TableOfContents | null => {
        if (!base.model.enableToc || !base.model.content) return null;

        const headingRegex = /^(#{1,6})\s+(.+)$/gm;
        const flatList: { id: string; text: string; level: number }[] = [];

        let match;
        while ((match = headingRegex.exec(base.model.content)) !== null) {
            const level = match[1].length;
            if (level <= base.model.tocMaxLevel) {
                const text = match[2].trim();
                const id = generateHeadingId(text);
                flatList.push({ id, text, level });
            }
        }

        // Build nested structure
        const headings: HeadingNode[] = [];
        const stack: HeadingNode[] = [];

        for (const item of flatList) {
            const node: HeadingNode = { ...item, children: [] };

            while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
                stack.pop();
            }

            if (stack.length === 0) {
                headings.push(node);
            } else {
                stack[stack.length - 1].children.push(node);
            }

            stack.push(node);
        }

        return { headings, flatList };
    }, [base.model.content, base.model.enableToc, base.model.tocMaxLevel]);

    // ═══════════════════════════════════════════════════════════════════════
    // UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Generate slug ID from heading text
     */
    const generateHeadingId = useCallback((text: string): string => {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    }, []);

    /**
     * Check if link is external
     */
    const isExternalLink = useCallback((href: string): boolean => {
        if (!href) return false;
        try {
            const url = new URL(href, window.location.origin);
            return url.origin !== window.location.origin;
        } catch {
            return false;
        }
    }, []);

    /**
     * Copy code to clipboard
     */
    const copyCode = useCallback(async (code: string): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(code);
            base.emit('code:copied', { code: code.substring(0, 100) });
            options.onCodeCopy?.(code);
            return true;
        } catch (err) {
            console.error('[MarkdownRenderer] Copy failed:', err);
            return false;
        }
    }, [base, options.onCodeCopy]);

    /**
     * Handle heading click
     */
    const handleHeadingClick = useCallback((id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        base.emit('heading:click', { id });
        options.onHeadingClick?.(id);
    }, [base, options.onHeadingClick]);

    /**
     * Handle link click
     */
    const handleLinkClick = useCallback((href: string, event: React.MouseEvent) => {
        base.emit('link:click', { href, isExternal: isExternalLink(href) });
        options.onLinkClick?.(href, event);
    }, [base, isExternalLink, options.onLinkClick]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED PROPERTIES
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Prose class based on size setting
     */
    const proseClass = useMemo(() => {
        const sizeClasses = {
            sm: 'ark-prose--sm',
            base: 'ark-prose--base',
            lg: 'ark-prose--lg',
            xl: 'ark-prose--xl',
        };
        return `ark-prose ${sizeClasses[base.model.proseSize]}`;
    }, [base.model.proseSize]);

    // ═══════════════════════════════════════════════════════════════════════
    // EFFECTS
    // ═══════════════════════════════════════════════════════════════════════

    // Re-initialize Mermaid when theme changes
    useEffect(() => {
        if (base.model.enableMermaid) {
            initializeMermaid(base.model.mermaidTheme);
        }
    }, [base.model.mermaidTheme, base.model.enableMermaid]);

    // Call onRender when content changes
    useEffect(() => {
        options.onRender?.();
    }, [base.model.content]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        tableOfContents,
        mermaidDiagrams,
        renderMermaidDiagram,
        copyCode,
        handleHeadingClick,
        handleLinkClick,
        generateHeadingId,
        isExternalLink,
        proseClass,
    };
}

export default useMarkdownRenderer;
