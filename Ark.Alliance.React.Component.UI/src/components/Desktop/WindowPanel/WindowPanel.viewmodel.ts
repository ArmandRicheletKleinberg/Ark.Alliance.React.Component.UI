/**
 * @fileoverview WindowPanel Component ViewModel
 * @module components/Desktop/WindowPanel
 * 
 * Business logic and state management for the WindowPanel component.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { WindowPanelModel } from './WindowPanel.model';
import { defaultWindowPanelModel, WindowPanelModelSchema } from './WindowPanel.model';
import type { Position, Size } from '../types';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Resize direction for window resizing
 */
export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

/**
 * WindowPanel ViewModel options
 */
export interface UseWindowPanelOptions extends Partial<WindowPanelModel> {
    /** Callback when window is closed */
    onClose?: () => void;

    /** Callback when window is minimized */
    onMinimize?: () => void;

    /** Callback when window is maximized */
    onMaximize?: (isMaximized: boolean) => void;

    /** Callback when window is focused */
    onFocus?: () => void;

    /** Callback when window position changes */
    onMove?: (position: Position) => void;

    /** Callback when window size changes */
    onResize?: (size: Size) => void;
}

/**
 * WindowPanel ViewModel return type
 */
export interface UseWindowPanelResult extends BaseViewModelResult<WindowPanelModel> {
    /** Current window position */
    position: Position;

    /** Current window size */
    size: Size;

    /** Whether window is being dragged */
    isDragging: boolean;

    /** Whether window is being resized */
    isResizing: boolean;

    /** Current resize direction */
    resizeDirection: ResizeDirection | null;

    /** Close the window */
    handleClose: () => void;

    /** Minimize the window */
    handleMinimize: () => void;

    /** Toggle maximize state */
    handleMaximize: () => void;

    /** Focus the window */
    handleFocus: () => void;

    /** Start dragging the window */
    handleDragStart: (e: React.PointerEvent) => void;

    /** Start resizing the window */
    handleResizeStart: (e: React.PointerEvent, direction: ResizeDirection) => void;

    /** Computed container classes */
    containerClasses: string;

    /** Computed container style */
    containerStyle: React.CSSProperties;

    /** Ref for the window element */
    windowRef: React.RefObject<HTMLDivElement>;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * WindowPanel ViewModel hook
 */
export function useWindowPanel(options: UseWindowPanelOptions = {}): UseWindowPanelResult {
    const {
        onClose,
        onMinimize,
        onMaximize,
        onFocus,
        onMove,
        onResize,
        ...modelData
    } = options;

    // Parse model options
    const modelOptions = useMemo(() => {
        return WindowPanelModelSchema.parse({ ...defaultWindowPanelModel, ...modelData });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(modelData)]);

    // Use base ViewModel
    const base = useBaseViewModel<WindowPanelModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'window-panel',
    });

    // ═══════════════════════════════════════════════════════════════════════
    // LOCAL STATE
    // ═══════════════════════════════════════════════════════════════════════

    const [position, setPosition] = useState<Position>(modelOptions.position);
    const [size, setSize] = useState<Size>(modelOptions.size);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<ResizeDirection | null>(null);

    const windowRef = useRef<HTMLDivElement>(null);
    const dragStartRef = useRef<{ x: number; y: number } | null>(null);
    const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number; posX: number; posY: number } | null>(null);

    // Sync position/size when props change
    useEffect(() => {
        setPosition(modelOptions.position);
    }, [modelOptions.position]);

    useEffect(() => {
        setSize(modelOptions.size);
    }, [modelOptions.size]);

    // ═══════════════════════════════════════════════════════════════════════
    // DRAG HANDLING
    // ═══════════════════════════════════════════════════════════════════════

    const handleDragStart = useCallback((e: React.PointerEvent) => {
        if (!base.model.movable || base.model.isMaximized) return;

        onFocus?.();
        base.emit('focus', { id: base.model.id });

        setIsDragging(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
    }, [base, onFocus]);

    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            if (!isDragging || !dragStartRef.current) return;

            const dx = e.clientX - dragStartRef.current.x;
            const dy = e.clientY - dragStartRef.current.y;

            const newPosition = {
                x: position.x + dx,
                y: position.y + dy,
            };

            setPosition(newPosition);
            dragStartRef.current = { x: e.clientX, y: e.clientY };
        };

        const handlePointerUp = () => {
            if (isDragging) {
                setIsDragging(false);
                dragStartRef.current = null;
                onMove?.(position);
                base.emit('move', { id: base.model.id, position });
            }
        };

        if (isDragging) {
            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', handlePointerUp);
        }

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isDragging, position, base, onMove]);

    // ═══════════════════════════════════════════════════════════════════════
    // RESIZE HANDLING
    // ═══════════════════════════════════════════════════════════════════════

    const handleResizeStart = useCallback((e: React.PointerEvent, direction: ResizeDirection) => {
        if (!base.model.resizable || base.model.isMaximized) return;

        setIsResizing(true);
        setResizeDirection(direction);
        resizeStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            width: size.width,
            height: size.height,
            posX: position.x,
            posY: position.y,
        };
        e.preventDefault();
        e.stopPropagation();
    }, [base.model.resizable, base.model.isMaximized, size, position]);

    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            if (!isResizing || !resizeStartRef.current || !resizeDirection) return;

            const dx = e.clientX - resizeStartRef.current.x;
            const dy = e.clientY - resizeStartRef.current.y;

            let newWidth = resizeStartRef.current.width;
            let newHeight = resizeStartRef.current.height;
            let newX = resizeStartRef.current.posX;
            let newY = resizeStartRef.current.posY;

            // Handle resize based on direction
            if (resizeDirection.includes('e')) newWidth += dx;
            if (resizeDirection.includes('w')) {
                newWidth -= dx;
                newX += dx;
            }
            if (resizeDirection.includes('s')) newHeight += dy;
            if (resizeDirection.includes('n')) {
                newHeight -= dy;
                newY += dy;
            }

            // Apply min/max constraints
            const minW = base.model.minSize.width;
            const minH = base.model.minSize.height;
            const maxW = base.model.maxSize?.width;
            const maxH = base.model.maxSize?.height;

            if (newWidth < minW) {
                if (resizeDirection.includes('w')) newX -= (minW - newWidth);
                newWidth = minW;
            }
            if (maxW && newWidth > maxW) newWidth = maxW;
            if (newHeight < minH) {
                if (resizeDirection.includes('n')) newY -= (minH - newHeight);
                newHeight = minH;
            }
            if (maxH && newHeight > maxH) newHeight = maxH;

            setSize({ width: newWidth, height: newHeight });
            setPosition({ x: newX, y: newY });
        };

        const handlePointerUp = () => {
            if (isResizing) {
                setIsResizing(false);
                setResizeDirection(null);
                resizeStartRef.current = null;
                onResize?.(size);
                base.emit('resize', { id: base.model.id, size });
            }
        };

        if (isResizing) {
            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', handlePointerUp);
        }

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isResizing, resizeDirection, size, position, base, onResize]);

    // ═══════════════════════════════════════════════════════════════════════
    // WINDOW CONTROL HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleClose = useCallback(() => {
        if (!base.model.closable) return;
        base.emit('close', { id: base.model.id });
        onClose?.();
    }, [base, onClose]);

    const handleMinimize = useCallback(() => {
        if (!base.model.minimizable) return;
        base.emit('minimize', { id: base.model.id });
        onMinimize?.();
    }, [base, onMinimize]);

    const handleMaximize = useCallback(() => {
        if (!base.model.maximizable) return;
        const newState = !base.model.isMaximized;
        base.updateModel({ isMaximized: newState });
        base.emit('maximize', { id: base.model.id, isMaximized: newState });
        onMaximize?.(newState);
    }, [base, onMaximize]);

    const handleFocus = useCallback(() => {
        base.emit('focus', { id: base.model.id });
        onFocus?.();
    }, [base, onFocus]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED STYLES
    // ═══════════════════════════════════════════════════════════════════════

    const containerClasses = useMemo(() => {
        const classes = [
            'ark-window-panel',
            `ark-window-panel--${base.model.visualMode}`,
        ];
        if (base.model.isMaximized) classes.push('ark-window-panel--maximized');
        if (base.model.isMinimized) classes.push('ark-window-panel--minimized');
        if (base.model.isFocused) classes.push('ark-window-panel--focused');
        if (isDragging) classes.push('ark-window-panel--dragging');
        if (isResizing) classes.push('ark-window-panel--resizing');
        if (base.model.className) classes.push(base.model.className);
        return classes.join(' ');
    }, [base.model, isDragging, isResizing]);

    const containerStyle = useMemo((): React.CSSProperties => {
        if (base.model.isMinimized) {
            return { display: 'none' };
        }

        if (base.model.isMaximized) {
            return {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: 'calc(100% - 48px)', // Account for taskbar
                zIndex: base.model.zIndex,
                borderRadius: 0,
            };
        }

        return {
            position: 'absolute',
            top: position.y,
            left: position.x,
            width: size.width,
            height: size.height,
            zIndex: base.model.zIndex,
            borderRadius: base.model.borderRadius,
            transition: isDragging || isResizing ? 'none' : 'box-shadow 0.2s',
        };
    }, [base.model, position, size, isDragging, isResizing]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        position,
        size,
        isDragging,
        isResizing,
        resizeDirection,
        handleClose,
        handleMinimize,
        handleMaximize,
        handleFocus,
        handleDragStart,
        handleResizeStart,
        containerClasses,
        containerStyle,
        windowRef: windowRef as React.RefObject<HTMLDivElement>,
    };
}

export default useWindowPanel;
