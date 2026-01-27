/**
 * @fileoverview HTMLViewer Component
 * @module components/Documents/HTMLViewer
 * 
 * A component for viewing HTML content with zoom, print, and fullscreen support.
 */

import React, { memo, forwardRef } from 'react';
import { useHTMLViewer, type UseHTMLViewerOptions } from './HTMLViewer.viewmodel';
import './HTMLViewer.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface HTMLViewerProps extends UseHTMLViewerOptions { }

// ═══════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════

const ZoomInIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
);

const ZoomOutIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
);

const PrintIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
    </svg>
);

const FullscreenIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="15 3 21 3 21 9" />
        <polyline points="9 21 3 21 3 15" />
        <line x1="21" y1="3" x2="14" y2="10" />
        <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
);

const RefreshIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
);

const LoadingSpinner = () => (
    <svg className="ark-html-viewer__spinner" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" opacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * HTMLViewer - HTML content viewer with zoom and controls
 * 
 * Features:
 * - Zoom in/out with percentage display
 * - Print support
 * - Fullscreen mode
 * - Content loading from URL
 * - Error handling
 * - Visual mode variants
 * 
 * @example
 * ```tsx
 * // View HTML content directly
 * <HTMLViewer content="<h1>Hello</h1><p>World</p>" />
 * 
 * // Load from URL
 * <HTMLViewer src="https://example.com/document.html" />
 * 
 * // With title and callbacks
 * <HTMLViewer
 *   title="My Document"
 *   content={htmlContent}
 *   onPrint={() => trackPrint()}
 *   visualMode="light"
 * />
 * ```
 */
export const HTMLViewer = memo(forwardRef<HTMLDivElement, HTMLViewerProps>(
    (props, ref) => {
        const vm = useHTMLViewer(props);

        return (
            <div
                ref={ref || vm.containerRef}
                className={vm.containerClasses}
                data-testid={vm.model.testId}
            >
                {/* Toolbar */}
                {vm.model.showToolbar && (
                    <div className="ark-html-viewer__toolbar">
                        <div className="ark-html-viewer__toolbar-left">
                            {vm.model.title && (
                                <span className="ark-html-viewer__title">{vm.model.title}</span>
                            )}
                        </div>

                        <div className="ark-html-viewer__toolbar-center">
                            {vm.model.showZoom && (
                                <div className="ark-html-viewer__zoom-controls">
                                    <button
                                        className="ark-html-viewer__btn"
                                        onClick={vm.zoomOut}
                                        disabled={vm.zoom <= vm.model.minZoom}
                                        title="Zoom Out"
                                    >
                                        <ZoomOutIcon />
                                    </button>
                                    <button
                                        className="ark-html-viewer__zoom-value"
                                        onClick={vm.resetZoom}
                                        title="Reset Zoom"
                                    >
                                        {vm.zoom}%
                                    </button>
                                    <button
                                        className="ark-html-viewer__btn"
                                        onClick={vm.zoomIn}
                                        disabled={vm.zoom >= vm.model.maxZoom}
                                        title="Zoom In"
                                    >
                                        <ZoomInIcon />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="ark-html-viewer__toolbar-right">
                            {vm.model.showRefresh && vm.model.src && (
                                <button
                                    className="ark-html-viewer__btn"
                                    onClick={vm.refresh}
                                    title="Refresh"
                                >
                                    <RefreshIcon />
                                </button>
                            )}
                            {vm.model.showPrint && (
                                <button
                                    className="ark-html-viewer__btn"
                                    onClick={vm.handlePrint}
                                    title="Print"
                                >
                                    <PrintIcon />
                                </button>
                            )}
                            {vm.model.showFullscreen && (
                                <button
                                    className="ark-html-viewer__btn"
                                    onClick={vm.toggleFullscreen}
                                    title={vm.isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                                >
                                    <FullscreenIcon />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="ark-html-viewer__viewport">
                    {vm.isLoading ? (
                        <div className="ark-html-viewer__loading">
                            <LoadingSpinner />
                            <span>Loading...</span>
                        </div>
                    ) : vm.error ? (
                        <div className="ark-html-viewer__error">
                            <span>⚠️ {vm.error}</span>
                            {vm.model.src && (
                                <button onClick={vm.refresh}>Retry</button>
                            )}
                        </div>
                    ) : (
                        <div
                            className="ark-html-viewer__content"
                            style={vm.contentStyle}
                            dangerouslySetInnerHTML={{ __html: vm.content }}
                        />
                    )}
                </div>
            </div>
        );
    }
));

HTMLViewer.displayName = 'HTMLViewer';

export default HTMLViewer;
