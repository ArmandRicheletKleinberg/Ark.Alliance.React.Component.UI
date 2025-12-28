/**
 * @fileoverview DesktopPage Component
 * @module components/Desktop/DesktopPage
 * 
 * A full desktop environment page that inherits from Page layout.
 * Features: Taskbar, movable icons, resizable windows, customizable theme.
 */

import React, { memo, forwardRef, useMemo } from 'react';
import { useDesktopPage, type UseDesktopPageOptions } from './DesktopPage.viewmodel';
import { WindowPanel } from '../WindowPanel';
import { DesktopIcon } from '../DesktopIcon';
import { Taskbar } from '../Taskbar';
import { StartMenu } from '../StartMenu';
import type { AppConfig, DesktopIconConfig, Position } from '../types';
import './DesktopPage.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * App component renderer function
 */
export type AppComponentRenderer = (appId: string) => React.ReactNode;

/**
 * DesktopPage props
 */
export interface DesktopPageProps extends UseDesktopPageOptions {
    /** 
     * Render function for app content inside windows
     * Receives appId and should return the component to render
     */
    renderApp?: AppComponentRenderer;

    /** Additional children to render in the desktop area */
    children?: React.ReactNode;
}

// ═══════════════════════════════════════════════════════════════════════════
// DRAGGABLE DESKTOP ICON WRAPPER
// ═══════════════════════════════════════════════════════════════════════════

interface DraggableDesktopIconProps {
    config: DesktopIconConfig;
    position: Position | undefined;
    visualMode: 'normal' | 'neon' | 'minimal' | 'glass';
    onDoubleClick: (appId: string) => void;
    onMove: (iconId: string, position: Position) => void;
}

const DraggableDesktopIcon: React.FC<DraggableDesktopIconProps> = ({
    config,
    position,
    visualMode,
    onDoubleClick,
    onMove,
}) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStart, setDragStart] = React.useState<{ x: number; y: number; iconX: number; iconY: number } | null>(null);
    const [localPosition, setLocalPosition] = React.useState(position);

    React.useEffect(() => {
        setLocalPosition(position);
    }, [position]);

    const handlePointerDown = (e: React.PointerEvent) => {
        // Only start drag on left mouse button
        if (e.button !== 0) return;

        const currentPos = localPosition || { x: 0, y: 0 };
        setDragStart({
            x: e.clientX,
            y: e.clientY,
            iconX: currentPos.x,
            iconY: currentPos.y,
        });
        setIsDragging(true);
        e.preventDefault();
    };

    React.useEffect(() => {
        if (!isDragging || !dragStart) return;

        const handlePointerMove = (e: PointerEvent) => {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            setLocalPosition({
                x: dragStart.iconX + dx,
                y: dragStart.iconY + dy,
            });
        };

        const handlePointerUp = () => {
            setIsDragging(false);
            if (localPosition) {
                onMove(config.id, localPosition);
            }
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isDragging, dragStart, localPosition, config.id, onMove]);

    const style: React.CSSProperties = localPosition ? {
        position: 'absolute',
        left: localPosition.x,
        top: localPosition.y,
        cursor: isDragging ? 'grabbing' : 'pointer',
    } : {};

    return (
        <div
            style={style}
            onPointerDown={handlePointerDown}
            className={`ark-desktop-page__icon ${isDragging ? 'ark-desktop-page__icon--dragging' : ''}`}
        >
            <DesktopIcon
                label={config.label}
                icon={config.icon}
                appId={config.appId}
                visualMode={visualMode}
                onDoubleClick={onDoubleClick}
            />
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * DesktopPage - Full desktop environment page
 * 
 * Features:
 * - Taskbar with window buttons and system tray
 * - Desktop icons with drag-and-drop positioning (saved to cookies)
 * - Start menu for app launching
 * - Multiple resizable/movable windows
 * - Theme support (dark, light, neon, glass)
 * 
 * @example
 * ```tsx
 * <DesktopPage
 *   theme="dark"
 *   apps={[
 *     { id: 'notepad', title: 'Notepad', icon: '📝' },
 *     { id: 'browser', title: 'Browser', icon: '🌐' },
 *   ]}
 *   icons={[
 *     { id: 'icon1', label: 'Notepad', icon: '📝', appId: 'notepad' },
 *   ]}
 *   renderApp={(appId) => {
 *     if (appId === 'notepad') return <NotepadApp />;
 *     return <div>Unknown app</div>;
 *   }}
 * />
 * ```
 */
export const DesktopPage = memo(forwardRef<HTMLDivElement, DesktopPageProps>(
    (props, ref) => {
        const { renderApp, children, ...options } = props;
        const vm = useDesktopPage(options);

        // Convert apps to start menu format
        const startMenuApps = useMemo(() => {
            return vm.model.apps.map(app => ({
                id: app.id,
                title: app.title,
                icon: app.icon,
                category: app.category,
                pinned: app.pinned,
            }));
        }, [vm.model.apps]);

        // Convert windows to taskbar format
        const taskbarWindows = useMemo(() => {
            return vm.windows.map(win => {
                const app = vm.getAppConfig(win.appId);
                return {
                    id: win.id,
                    title: win.title,
                    icon: app?.icon,
                    isMinimized: win.isMinimized,
                };
            });
        }, [vm.windows, vm.getAppConfig]);

        return (
            <div
                ref={ref}
                className={vm.containerClasses}
                style={vm.backgroundStyle}
                onClick={vm.closeStartMenu}
                data-testid={vm.model.testId}
            >
                {/* Background Animation Overlay */}
                {vm.model.background.showAnimation && (
                    <div className="ark-desktop-page__bg-animation" />
                )}

                {/* Desktop Content Area */}
                <div className={vm.contentClasses}>
                    {/* Desktop Icons */}
                    <div className="ark-desktop-page__icons">
                        {vm.model.icons.map((iconConfig, index) => {
                            const savedPosition = vm.iconPositions.get(iconConfig.id);
                            const defaultPosition = {
                                x: (index % 6) * 110 + 20,
                                y: Math.floor(index / 6) * 110 + 20,
                            };

                            return (
                                <DraggableDesktopIcon
                                    key={iconConfig.id}
                                    config={iconConfig}
                                    position={savedPosition || defaultPosition}
                                    visualMode={vm.model.visualMode}
                                    onDoubleClick={vm.openApp}
                                    onMove={vm.updateIconPosition}
                                />
                            );
                        })}
                    </div>

                    {/* Windows */}
                    {vm.windows.map(win => {
                        const app = vm.getAppConfig(win.appId);

                        return (
                            <WindowPanel
                                key={win.id}
                                title={win.title}
                                icon={app?.icon}
                                position={win.position}
                                size={win.size}
                                isMinimized={win.isMinimized}
                                isMaximized={win.isMaximized}
                                isFocused={win.id === vm.activeWindowId}
                                zIndex={win.zIndex}
                                visualMode={vm.model.visualMode}
                                onClose={() => vm.closeWindow(win.id)}
                                onMinimize={() => vm.toggleMinimize(win.id)}
                                onMaximize={() => vm.toggleMaximize(win.id)}
                                onFocus={() => vm.focusWindow(win.id)}
                                onMove={(pos) => vm.updateWindow(win.id, { position: pos })}
                                onResize={(size) => vm.updateWindow(win.id, { size })}
                            >
                                {renderApp?.(win.appId)}
                            </WindowPanel>
                        );
                    })}

                    {/* Additional children */}
                    {children}
                </div>

                {/* Start Menu */}
                <div onClick={(e) => e.stopPropagation()}>
                    <StartMenu
                        isOpen={vm.startMenuOpen}
                        apps={startMenuApps}
                        visualMode={vm.model.visualMode}
                        onAppClick={vm.openApp}
                        onClose={vm.closeStartMenu}
                    />
                </div>

                {/* Taskbar */}
                {vm.model.showTaskbar && (
                    <Taskbar
                        position="bottom"
                        height={vm.model.taskbarHeight}
                        windows={taskbarWindows}
                        activeWindowId={vm.activeWindowId}
                        startMenuOpen={vm.startMenuOpen}
                        statusText={vm.model.statusText}
                        visualMode={vm.model.visualMode}
                        onStartClick={vm.toggleStartMenu}
                        onWindowClick={vm.handleTaskbarWindowClick}
                    />
                )}
            </div>
        );
    }
));

DesktopPage.displayName = 'DesktopPage';

export default DesktopPage;
