/**
 * @fileoverview WindowPanel Component
 * @module components/Desktop/WindowPanel
 * 
 * A resizable, movable window panel component with title bar controls.
 */

import React, { memo, forwardRef } from 'react';
import { useWindowPanel, type UseWindowPanelOptions, type ResizeDirection } from './WindowPanel.viewmodel';
import './WindowPanel.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface WindowPanelProps extends UseWindowPanelOptions {
    /** Window content */
    children?: React.ReactNode;
}

// ═══════════════════════════════════════════════════════════════════════════
// RESIZE HANDLE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface ResizeHandleProps {
    direction: ResizeDirection;
    onResizeStart: (e: React.PointerEvent, direction: ResizeDirection) => void;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ direction, onResizeStart }) => (
    <div
        className={`ark-window-panel__resize-handle ark-window-panel__resize-handle--${direction}`}
        onPointerDown={(e) => onResizeStart(e, direction)}
    />
);

// ═══════════════════════════════════════════════════════════════════════════
// WINDOW CONTROL ICONS
// ═══════════════════════════════════════════════════════════════════════════

const MinusIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const SquareIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
);

const XIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * WindowPanel - A resizable, movable window container
 * 
 * @example
 * ```tsx
 * <WindowPanel
 *   title="My Application"
 *   icon="📁"
 *   position={{ x: 100, y: 100 }}
 *   size={{ width: 600, height: 400 }}
 *   onClose={() => console.log('closed')}
 * >
 *   <div>Window content here</div>
 * </WindowPanel>
 * ```
 */
export const WindowPanel = memo(forwardRef<HTMLDivElement, WindowPanelProps>(
    (props, ref) => {
        const { children, ...options } = props;
        const vm = useWindowPanel(options);

        // Don't render if minimized
        if (vm.model.isMinimized) {
            return null;
        }

        const resizeDirections: ResizeDirection[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

        return (
            <div
                ref={ref || vm.windowRef}
                className={vm.containerClasses}
                style={vm.containerStyle}
                onPointerDown={vm.handleFocus}
                data-testid={vm.model.testId}
                aria-label={vm.model.ariaLabel || vm.model.title}
            >
                {/* Resize Handles */}
                {vm.model.resizable && !vm.model.isMaximized && (
                    <>
                        {resizeDirections.map((dir) => (
                            <ResizeHandle
                                key={dir}
                                direction={dir}
                                onResizeStart={vm.handleResizeStart}
                            />
                        ))}
                    </>
                )}

                {/* Title Bar */}
                {vm.model.showTitleBar && (
                    <div
                        className="ark-window-panel__titlebar"
                        onPointerDown={vm.handleDragStart}
                    >
                        <div className="ark-window-panel__titlebar-left">
                            {vm.model.icon && (
                                <span className="ark-window-panel__icon">{vm.model.icon}</span>
                            )}
                            <span className="ark-window-panel__title">{vm.model.title}</span>
                        </div>
                        <div className="ark-window-panel__controls">
                            {vm.model.minimizable && (
                                <button
                                    className="ark-window-panel__control ark-window-panel__control--minimize"
                                    onClick={(e) => { e.stopPropagation(); vm.handleMinimize(); }}
                                    aria-label="Minimize"
                                >
                                    <MinusIcon />
                                </button>
                            )}
                            {vm.model.maximizable && (
                                <button
                                    className="ark-window-panel__control ark-window-panel__control--maximize"
                                    onClick={(e) => { e.stopPropagation(); vm.handleMaximize(); }}
                                    aria-label={vm.model.isMaximized ? 'Restore' : 'Maximize'}
                                >
                                    <SquareIcon />
                                </button>
                            )}
                            {vm.model.closable && (
                                <button
                                    className="ark-window-panel__control ark-window-panel__control--close"
                                    onClick={(e) => { e.stopPropagation(); vm.handleClose(); }}
                                    aria-label="Close"
                                >
                                    <XIcon />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="ark-window-panel__content">
                    {children}
                </div>
            </div>
        );
    }
));

WindowPanel.displayName = 'WindowPanel';

export default WindowPanel;
