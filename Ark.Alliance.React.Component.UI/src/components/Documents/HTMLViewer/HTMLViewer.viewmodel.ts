/**
 * @fileoverview HTMLViewer Component ViewModel
 * @module components/Documents/HTMLViewer
 * 
 * Business logic for the HTML content viewer.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { HTMLViewerModel } from './HTMLViewer.model';
import { defaultHTMLViewerModel, HTMLViewerModelSchema } from './HTMLViewer.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * HTMLViewer ViewModel options
 */
export interface UseHTMLViewerOptions extends Partial<HTMLViewerModel> {
    /** Callback when content is loaded */
    onLoad?: () => void;

    /** Callback on error */
    onError?: (error: string) => void;

    /** Callback on print */
    onPrint?: () => void;

    /** Callback on zoom change */
    onZoomChange?: (zoom: number) => void;
}

/**
 * HTMLViewer ViewModel result
 */
export interface UseHTMLViewerResult extends BaseViewModelResult<HTMLViewerModel> {
    /** Container ref */
    containerRef: React.RefObject<HTMLDivElement>;

    /** Current content */
    content: string;

    /** Current zoom level */
    zoom: number;

    /** Is loading */
    isLoading: boolean;

    /** Error message */
    error: string | undefined;

    /** Is fullscreen */
    isFullscreen: boolean;

    /** Zoom in */
    zoomIn: () => void;

    /** Zoom out */
    zoomOut: () => void;

    /** Set zoom level */
    setZoom: (zoom: number) => void;

    /** Reset zoom to 100% */
    resetZoom: () => void;

    /** Toggle fullscreen */
    toggleFullscreen: () => void;

    /** Print content */
    handlePrint: () => void;

    /** Refresh content from src */
    refresh: () => void;

    /** Container classes */
    containerClasses: string;

    /** Content style */
    contentStyle: React.CSSProperties;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * HTMLViewer ViewModel hook
 */
export function useHTMLViewer(options: UseHTMLViewerOptions = {}): UseHTMLViewerResult {
    const {
        onLoad,
        onError,
        onPrint,
        onZoomChange,
        ...modelData
    } = options;

    // Parse model
    const modelOptions = useMemo(() => {
        return HTMLViewerModelSchema.parse({ ...defaultHTMLViewerModel, ...modelData });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(modelData)]);

    // Base ViewModel
    const base = useBaseViewModel<HTMLViewerModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'html-viewer',
    });

    // ═══════════════════════════════════════════════════════════════════════
    // REFS
    // ═══════════════════════════════════════════════════════════════════════

    const containerRef = useRef<HTMLDivElement>(null);

    // ═══════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════

    const [content, setContent] = useState(modelOptions.content);
    const [zoom, setZoomState] = useState(modelOptions.zoom);
    const [isLoading, setIsLoading] = useState(modelOptions.isLoading);
    const [error, setError] = useState<string | undefined>(modelOptions.error);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // ═══════════════════════════════════════════════════════════════════════
    // FETCH CONTENT
    // ═══════════════════════════════════════════════════════════════════════

    const fetchContent = useCallback(async () => {
        if (!base.model.src) return;

        setIsLoading(true);
        setError(undefined);

        try {
            const response = await fetch(base.model.src);
            if (!response.ok) {
                throw new Error(`Failed to load: ${response.status}`);
            }
            const html = await response.text();
            setContent(html);
            onLoad?.();
            base.emit('load', { src: base.model.src });
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to load content';
            setError(errorMsg);
            onError?.(errorMsg);
            base.emit('error', { error: errorMsg });
        } finally {
            setIsLoading(false);
        }
    }, [base, onLoad, onError]);

    // Load from src on mount/change
    useEffect(() => {
        if (base.model.src) {
            fetchContent();
        } else if (base.model.content !== content) {
            setContent(base.model.content);
        }
    }, [base.model.src, base.model.content, fetchContent, content]);

    // ═══════════════════════════════════════════════════════════════════════
    // ZOOM CONTROLS
    // ═══════════════════════════════════════════════════════════════════════

    const setZoom = useCallback((newZoom: number) => {
        const clamped = Math.max(base.model.minZoom, Math.min(base.model.maxZoom, newZoom));
        setZoomState(clamped);
        onZoomChange?.(clamped);
        base.emit('zoom', { zoom: clamped });
    }, [base, onZoomChange]);

    const zoomIn = useCallback(() => {
        setZoom(zoom + base.model.zoomStep);
    }, [zoom, base.model.zoomStep, setZoom]);

    const zoomOut = useCallback(() => {
        setZoom(zoom - base.model.zoomStep);
    }, [zoom, base.model.zoomStep, setZoom]);

    const resetZoom = useCallback(() => {
        setZoom(100);
    }, [setZoom]);

    // ═══════════════════════════════════════════════════════════════════════
    // FULLSCREEN
    // ═══════════════════════════════════════════════════════════════════════

    const toggleFullscreen = useCallback(() => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen?.();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen?.();
            setIsFullscreen(false);
        }
    }, []);

    // Listen for fullscreen change
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // PRINT
    // ═══════════════════════════════════════════════════════════════════════

    const handlePrint = useCallback(() => {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (doc) {
            doc.open();
            doc.write(`
                <html>
                <head>
                    <title>${base.model.title || 'Document'}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        img { max-width: 100%; }
                    </style>
                </head>
                <body>${content}</body>
                </html>
            `);
            doc.close();

            setTimeout(() => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();
                setTimeout(() => document.body.removeChild(iframe), 1000);
            }, 500);
        }

        onPrint?.();
        base.emit('print', {});
    }, [content, base, onPrint]);

    // ═══════════════════════════════════════════════════════════════════════
    // REFRESH
    // ═══════════════════════════════════════════════════════════════════════

    const refresh = useCallback(() => {
        if (base.model.src) {
            fetchContent();
        }
    }, [base.model.src, fetchContent]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED STYLES
    // ═══════════════════════════════════════════════════════════════════════

    const containerClasses = useMemo(() => {
        const classes = [
            'ark-html-viewer',
            `ark-html-viewer--${base.model.visualMode}`,
        ];
        if (isFullscreen) classes.push('ark-html-viewer--fullscreen');
        if (isLoading) classes.push('ark-html-viewer--loading');
        if (base.model.className) classes.push(base.model.className);
        return classes.join(' ');
    }, [base.model, isFullscreen, isLoading]);

    const contentStyle = useMemo((): React.CSSProperties => ({
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'top left',
        width: zoom !== 100 ? `${10000 / zoom}%` : '100%',
        minHeight: base.model.minHeight,
        userSelect: base.model.allowCopy ? 'text' : 'none',
    }), [zoom, base.model.minHeight, base.model.allowCopy]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        containerRef: containerRef as React.RefObject<HTMLDivElement>,
        content,
        zoom,
        isLoading,
        error,
        isFullscreen,
        zoomIn,
        zoomOut,
        setZoom,
        resetZoom,
        toggleFullscreen,
        handlePrint,
        refresh,
        containerClasses,
        contentStyle,
    };
}

export default useHTMLViewer;
