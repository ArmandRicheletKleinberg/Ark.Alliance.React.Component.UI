/**
 * @fileoverview MarkdownRenderer Component Barrel Export
 * @module components/Documents/MarkdownRenderer
 */

// Component
export { MarkdownRenderer, type MarkdownRendererProps } from './MarkdownRenderer';
export { default } from './MarkdownRenderer';

// ViewModel
export {
    useMarkdownRenderer,
    type UseMarkdownRendererOptions,
    type UseMarkdownRendererResult,
    type MermaidDiagramState,
} from './MarkdownRenderer.viewmodel';

// Model
export {
    MarkdownRendererModelSchema,
    MermaidTheme,
    SyntaxTheme,
    defaultMarkdownRendererModel,
    createMarkdownRendererModel,
    type MarkdownRendererModel,
    type MermaidThemeType,
    type SyntaxThemeType,
    type HeadingNode,
    type TableOfContents,
} from './MarkdownRenderer.model';
