/**
 * @fileoverview Taskbar Component
 * @module components/Desktop/Taskbar
 * 
 * A desktop taskbar with start button, window buttons, and system tray.
 */

import React, { memo, forwardRef } from 'react';
import { useTaskbar, type UseTaskbarOptions } from './Taskbar.viewmodel';
import './Taskbar.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface TaskbarProps extends UseTaskbarOptions {
    /** Custom start button content */
    startButtonContent?: React.ReactNode;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT START BUTTON ICON
// ═══════════════════════════════════════════════════════════════════════════

const DefaultStartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Taskbar - A desktop taskbar component
 * 
 * @example
 * ```tsx
 * <Taskbar
 *   windows={windows}
 *   activeWindowId={activeId}
 *   onStartClick={() => setStartOpen(!startOpen)}
 *   onWindowClick={(id) => focusWindow(id)}
 * />
 * ```
 */
export const Taskbar = memo(forwardRef<HTMLDivElement, TaskbarProps>(
    (props, ref) => {
        const { startButtonContent, ...options } = props;
        const vm = useTaskbar(options);

        return (
            <div
                ref={ref}
                className={vm.containerClasses}
                style={vm.containerStyle}
                data-testid={vm.model.testId}
                aria-label={vm.model.ariaLabel || 'Taskbar'}
            >
                {/* Start Button */}
                <button
                    className={`ark-taskbar__start-button ${vm.model.startMenuOpen ? 'ark-taskbar__start-button--active' : ''}`}
                    onClick={vm.handleStartClick}
                    title="Start"
                    aria-label="Start Menu"
                >
                    {startButtonContent || (
                        vm.model.startButtonIcon ? (
                            <span className="ark-taskbar__start-icon">{vm.model.startButtonIcon}</span>
                        ) : (
                            <DefaultStartIcon />
                        )
                    )}
                </button>

                {/* Window Buttons */}
                <div className="ark-taskbar__windows">
                    {vm.model.windows.map((win) => {
                        const isActive = vm.isWindowActive(win.id) && !win.isMinimized;

                        return (
                            <button
                                key={win.id}
                                className={`ark-taskbar__window-button ${isActive ? 'ark-taskbar__window-button--active' : ''}`}
                                onClick={() => vm.handleWindowClick(win.id)}
                            >
                                {win.icon && <span className="ark-taskbar__window-icon">{win.icon}</span>}
                                <span className="ark-taskbar__window-title">{win.title}</span>
                                {isActive && <div className="ark-taskbar__window-indicator" />}
                            </button>
                        );
                    })}
                </div>

                {/* System Tray */}
                {vm.model.showTray && (
                    <div className="ark-taskbar__tray">
                        {/* Clock */}
                        {vm.model.showClock && (
                            <div className="ark-taskbar__clock">
                                <span className="ark-taskbar__clock-time">{vm.timeString}</span>
                                <span className="ark-taskbar__clock-date">{vm.dateString}</span>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="ark-taskbar__divider" />

                        {/* Status */}
                        <div className="ark-taskbar__status">
                            <span className="ark-taskbar__status-indicator" />
                            {vm.model.statusText}
                        </div>
                    </div>
                )}
            </div>
        );
    }
));

Taskbar.displayName = 'Taskbar';

export default Taskbar;
