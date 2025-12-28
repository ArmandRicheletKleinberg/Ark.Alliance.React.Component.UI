/**
 * @fileoverview MarkdownRenderer Component
 * @module components/Documents/MarkdownRenderer
 * 
 * A full-featured Markdown renderer with:
 * - GitHub Flavored Markdown (tables, task lists, strikethrough)
 * - Mermaid diagram support with lazy rendering
 * - Syntax highlighting for code blocks
 * - Copy to clipboard functionality
 * - Table of contents generation
 * - Dark mode optimized styling
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <MarkdownRenderer content={markdownText} />
 * 
 * // With Mermaid diagrams
 * <MarkdownRenderer
 *   content={markdownWithDiagrams}
 *   enableMermaid
 *   mermaidTheme="dark"
 * />
 * 
 * // With table of contents
 * <MarkdownRenderer
 *   content={longDocument}
 *   enableToc
 *   tocMaxLevel={3}
 * />
 * ```
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useMarkdownRenderer } from './MarkdownRenderer.viewmodel';
import type { UseMarkdownRendererOptions, MermaidDiagramState } from './MarkdownRenderer.viewmodel';
import './MarkdownRenderer.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * MarkdownRenderer component props
 */
export interface MarkdownRendererProps extends UseMarkdownRendererOptions {
    /** Additional CSS class */
    className?: string;

    /** Custom component overrides for ReactMarkdown */
    components?: Record<string, React.ComponentType<any>>;
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Mermaid Diagram Component
 */
interface MermaidDiagramProps {
    code: string;
    diagramId: string;
    renderDiagram: (id: string, code: string) => Promise<string | null>;
    state?: MermaidDiagramState;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
    code,
    diagramId,
    renderDiagram,
    state
}) => {
    const [localState, setLocalState] = useState<{
        svg: string | null;
        error: string | null;
        isLoading: boolean;
    }>({ svg: null, error: null, isLoading: true });

    const hasRendered = useRef(false);

    useEffect(() => {
        if (hasRendered.current) return;
        hasRendered.current = true;

        renderDiagram(diagramId, code).then(svg => {
            setLocalState({ svg, error: svg ? null : 'Render failed', isLoading: false });
        });
    }, [code, diagramId, renderDiagram]);

    const currentState = state || localState;

    if (currentState.isLoading) {
        return (
            <div className="ark-mermaid ark-mermaid--loading">
                <div className="ark-mermaid__spinner">
                    <svg className="ark-mermaid__spinner-icon" viewBox="0 0 24 24">
                        <circle
                            cx="12" cy="12" r="10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray="32"
                            strokeLinecap="round"
                        />
                    </svg>
                    <span>Rendering diagram...</span>
                </div>
            </div>
        );
    }

    if (currentState.error) {
        return (
            <div className="ark-mermaid ark-mermaid--error">
                <div className="ark-mermaid__error-header">
                    <svg className="ark-mermaid__error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Diagram Error</span>
                </div>
                <pre className="ark-mermaid__error-message">{currentState.error}</pre>
                <details className="ark-mermaid__source">
                    <summary>Show source</summary>
                    <pre>{code}</pre>
                </details>
            </div>
        );
    }

    return (
        <div
            className="ark-mermaid"
            dangerouslySetInnerHTML={{ __html: currentState.svg || '' }}
        />
    );
};

/**
 * Code Block Component with copy button
 */
interface CodeBlockProps {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    enableMermaid: boolean;
    enableCopyButton: boolean;
    renderDiagram: (id: string, code: string) => Promise<string | null>;
    copyCode: (code: string) => Promise<boolean>;
    diagramCounter: React.MutableRefObject<number>;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
    inline,
    className,
    children,
    enableMermaid,
    enableCopyButton,
    renderDiagram,
    copyCode,
    diagramCounter,
}) => {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const codeContent = String(children).replace(/\n$/, '');

    // Handle Mermaid diagrams
    if (!inline && language === 'mermaid' && enableMermaid) {
        const diagramId = `diagram-${diagramCounter.current++}`;
        return (
            <MermaidDiagram
                code={codeContent}
                diagramId={diagramId}
                renderDiagram={renderDiagram}
            />
        );
    }

    // Inline code
    if (inline) {
        return (
            <code className="ark-code ark-code--inline">
                {children}
            </code>
        );
    }

    // Handle copy
    const handleCopy = async () => {
        const success = await copyCode(codeContent);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Block code with syntax highlighting
    return (
        <div className="ark-code-block">
            {/* Language badge */}
            {language && (
                <div className="ark-code-block__language">{language}</div>
            )}

            {/* Copy button */}
            {enableCopyButton && (
                <button
                    onClick={handleCopy}
                    className="ark-code-block__copy"
                    title={copied ? 'Copied!' : 'Copy code'}
                    aria-label={copied ? 'Copied!' : 'Copy code'}
                >
                    {copied ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    )}
                </button>
            )}

            <pre className="ark-code-block__pre">
                <code className={`ark-code-block__code ${className || ''}`}>
                    {children}
                </code>
            </pre>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * MarkdownRenderer Component
 * 
 * Renders Markdown content with full support for:
 * - GitHub Flavored Markdown
 * - Mermaid diagrams
 * - Code blocks with copy functionality
 * - Table of contents
 * - Dark/light mode theming
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
    className = '',
    components: customComponents = {},
    ...options
}) => {
    const vm = useMarkdownRenderer(options);
    const diagramCounterRef = useRef(0);

    // Reset diagram counter when content changes
    useEffect(() => {
        diagramCounterRef.current = 0;
    }, [vm.model.content]);

    // Build custom components for ReactMarkdown
    const markdownComponents = useMemo(() => ({
        // Headings with IDs for TOC
        h1: ({ children, ...props }: any) => {
            const id = vm.generateHeadingId(String(children));
            return <h1 id={id} className="ark-heading ark-heading--1" {...props}>{children}</h1>;
        },
        h2: ({ children, ...props }: any) => {
            const id = vm.generateHeadingId(String(children));
            return <h2 id={id} className="ark-heading ark-heading--2" {...props}>{children}</h2>;
        },
        h3: ({ children, ...props }: any) => {
            const id = vm.generateHeadingId(String(children));
            return <h3 id={id} className="ark-heading ark-heading--3" {...props}>{children}</h3>;
        },
        h4: ({ children, ...props }: any) => {
            const id = vm.generateHeadingId(String(children));
            return <h4 id={id} className="ark-heading ark-heading--4" {...props}>{children}</h4>;
        },
        h5: ({ children, ...props }: any) => {
            const id = vm.generateHeadingId(String(children));
            return <h5 id={id} className="ark-heading ark-heading--5" {...props}>{children}</h5>;
        },
        h6: ({ children, ...props }: any) => {
            const id = vm.generateHeadingId(String(children));
            return <h6 id={id} className="ark-heading ark-heading--6" {...props}>{children}</h6>;
        },

        // Paragraph
        p: ({ children, ...props }: any) => (
            <p className="ark-paragraph" {...props}>{children}</p>
        ),

        // Links
        a: ({ href, children, ...props }: any) => {
            const isExternal = vm.isExternalLink(href || '');
            return (
                <a
                    href={href}
                    className="ark-link"
                    target={isExternal && vm.model.externalLinksNewTab ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    onClick={(e) => vm.handleLinkClick(href || '', e)}
                    {...props}
                >
                    {children}
                    {isExternal && (
                        <svg className="ark-link__external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    )}
                </a>
            );
        },

        // Lists
        ul: ({ children, ...props }: any) => (
            <ul className="ark-list ark-list--unordered" {...props}>{children}</ul>
        ),
        ol: ({ children, ...props }: any) => (
            <ol className="ark-list ark-list--ordered" {...props}>{children}</ol>
        ),
        li: ({ children, ...props }: any) => (
            <li className="ark-list__item" {...props}>{children}</li>
        ),

        // Blockquote
        blockquote: ({ children, ...props }: any) => (
            <blockquote className="ark-blockquote" {...props}>{children}</blockquote>
        ),

        // Tables
        table: ({ children, ...props }: any) => (
            <div className="ark-table-wrapper">
                <table className="ark-table" {...props}>{children}</table>
            </div>
        ),
        thead: ({ children, ...props }: any) => (
            <thead className="ark-table__head" {...props}>{children}</thead>
        ),
        tbody: ({ children, ...props }: any) => (
            <tbody className="ark-table__body" {...props}>{children}</tbody>
        ),
        tr: ({ children, ...props }: any) => (
            <tr className="ark-table__row" {...props}>{children}</tr>
        ),
        th: ({ children, ...props }: any) => (
            <th className="ark-table__th" {...props}>{children}</th>
        ),
        td: ({ children, ...props }: any) => (
            <td className="ark-table__td" {...props}>{children}</td>
        ),

        // Horizontal rule
        hr: (props: any) => <hr className="ark-hr" {...props} />,

        // Images
        img: ({ src, alt, ...props }: any) => (
            <img src={src} alt={alt} className="ark-image" loading="lazy" {...props} />
        ),

        // Strong/Bold
        strong: ({ children, ...props }: any) => (
            <strong className="ark-strong" {...props}>{children}</strong>
        ),

        // Emphasis/Italic
        em: ({ children, ...props }: any) => (
            <em className="ark-em" {...props}>{children}</em>
        ),

        // Strikethrough
        del: ({ children, ...props }: any) => (
            <del className="ark-del" {...props}>{children}</del>
        ),

        // Code blocks
        code: ({ inline, className, children, ...props }: any) => (
            <CodeBlock
                inline={inline}
                className={className}
                enableMermaid={vm.model.enableMermaid}
                enableCopyButton={vm.model.enableCopyButton}
                renderDiagram={vm.renderMermaidDiagram}
                copyCode={vm.copyCode}
                diagramCounter={diagramCounterRef}
                {...props}
            >
                {children}
            </CodeBlock>
        ),

        // Task list items (GFM)
        input: ({ type, checked, ...props }: any) => {
            if (type === 'checkbox') {
                return (
                    <input
                        type="checkbox"
                        checked={checked}
                        disabled
                        className="ark-checkbox"
                        {...props}
                    />
                );
            }
            return <input type={type} {...props} />;
        },

        // Custom component overrides
        ...customComponents,
    }), [vm, customComponents]);

    // Plugins
    const remarkPlugins = useMemo(() => {
        const plugins: any[] = [];
        if (vm.model.enableGfm) {
            plugins.push(remarkGfm);
        }
        return plugins;
    }, [vm.model.enableGfm]);

    return (
        <div
            className={`ark-markdown ${vm.proseClass} ${className}`.trim()}
            data-testid={vm.model.testId}
        >
            {/* Table of Contents */}
            {vm.tableOfContents && (
                <nav className="ark-toc">
                    <h4 className="ark-toc__title">Table of Contents</h4>
                    <ul className="ark-toc__list">
                        {vm.tableOfContents.flatList.map(item => (
                            <li
                                key={item.id}
                                className="ark-toc__item"
                                style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}
                            >
                                <button
                                    className="ark-toc__link"
                                    onClick={() => vm.handleHeadingClick(item.id)}
                                >
                                    {item.text}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            {/* Markdown Content */}
            <div className="ark-markdown__content">
                <ReactMarkdown
                    remarkPlugins={remarkPlugins}
                    components={markdownComponents}
                >
                    {vm.model.content}
                </ReactMarkdown>
            </div>
        </div>
    );
};

MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer;
