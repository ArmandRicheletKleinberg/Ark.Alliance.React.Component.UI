/**
 * @fileoverview GenericPanel Component
 * @module components/GenericPanel
 * 
 * Universal panel with dynamic theming, glassmorphism, gradients, and overlays.
 * This is a new component that does not modify the existing Panel.
 */

import { forwardRef, memo, type ReactNode, Children } from 'react';
import { useGenericPanel, type UseGenericPanelOptions } from './GenericPanel.viewmodel';
import { PanelGridOverlay } from './primitives/PanelGridOverlay';
import { PanelGlowEffect } from './primitives/PanelGlowEffect';
import { PanelEmptyState } from './primitives/PanelEmptyState';
import './GenericPanel.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface GenericPanelProps extends UseGenericPanelOptions {
    /** Main content */
    children?: ReactNode;
    /** Header slot (overrides title) */
    header?: ReactNode;
    /** Footer slot */
    footer?: ReactNode;
    /** Overlay slot (absolute positioned above content) */
    overlay?: ReactNode;
    /** Action buttons for header */
    headerActions?: ReactNode;
    /** Empty state custom content */
    emptyContent?: ReactNode;
    /** Additional CSS class */
    className?: string;
    /** Inline style overrides */
    style?: React.CSSProperties;
}

// ═══════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════

const CollapseIcon = ({ collapsed }: { collapsed: boolean }) => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{
            transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease',
        }}
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GenericPanel - Universal panel with dynamic theming
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <GenericPanel title="Settings">
 *   Content here
 * </GenericPanel>
 * 
 * // With glassmorphism
 * <GenericPanel
 *   title="Dashboard"
 *   glassBlur={12}
 *   useGradient
 *   gradientStart="#1e3a5f"
 *   gradientEnd="#0f172a"
 *   showGrid
 *   showGlow
 *   glowColor="rgba(59, 130, 246, 0.3)"
 * >
 *   <DashboardContent />
 * </GenericPanel>
 * 
 * // Sidebar layout
 * <GenericPanel
 *   layout="sidebar-left"
 *   sidebarWidth={320}
 *   collapsible
 * >
 *   <NavigationMenu />
 * </GenericPanel>
 * ```
 */
export const GenericPanel = memo(forwardRef<HTMLDivElement, GenericPanelProps>(
    function GenericPanel(props, ref) {
        const {
            children,
            header,
            footer,
            overlay,
            headerActions,
            emptyContent,
            className = '',
            style,
            ...panelOptions
        } = props;

        const vm = useGenericPanel(panelOptions);

        // Check if panel has children
        const hasChildren = Children.count(children) > 0;
        const shouldShowEmpty = vm.model.showEmptyState && !hasChildren && !vm.isCollapsed;

        // Merge dynamic styles with inline style prop
        const mergedStyles: React.CSSProperties = {
            ...vm.dynamicStyles,
            ...style,
            ...vm.cssVariables as React.CSSProperties,
        };

        // Render the panel content
        const renderPanel = () => (
            <div
                ref={ref}
                className={`${vm.panelClasses} ${className}`}
                style={mergedStyles}
                data-testid={vm.model.testId}
            >
                {/* Grid Overlay */}
                {vm.model.showGrid && (
                    <PanelGridOverlay
                        size={vm.model.gridSize}
                        color={vm.model.gridColor || vm.model.textColor}
                    />
                )}

                {/* Header */}
                {(header || vm.model.title) && (
                    <div className="ark-generic-panel__header">
                        <div className="ark-generic-panel__header-content">
                            {header || vm.model.title}
                        </div>
                        <div className="ark-generic-panel__header-actions">
                            {headerActions}
                            {vm.model.collapsible && (
                                <button
                                    className="ark-generic-panel__collapse-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        vm.toggleCollapse();
                                    }}
                                    aria-label={vm.isCollapsed ? 'Expand panel' : 'Collapse panel'}
                                    aria-expanded={!vm.isCollapsed}
                                    type="button"
                                >
                                    <CollapseIcon collapsed={vm.isCollapsed} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Body */}
                {!vm.isCollapsed && (
                    <div className={vm.bodyClasses}>
                        {shouldShowEmpty ? (
                            emptyContent || (
                                <PanelEmptyState
                                    message={vm.model.emptyMessage}
                                    icon={vm.model.emptyIcon}
                                />
                            )
                        ) : (
                            children
                        )}
                    </div>
                )}

                {/* Footer */}
                {footer && !vm.isCollapsed && (
                    <div className="ark-generic-panel__footer">
                        {footer}
                    </div>
                )}

                {/* Overlay */}
                {overlay && (
                    <div className="ark-generic-panel__overlay">
                        {overlay}
                    </div>
                )}
            </div>
        );

        // Wrap with glow effect if enabled
        if (vm.model.showGlow) {
            return (
                <PanelGlowEffect
                    color={vm.model.glowColor || vm.model.accentColor}
                    borderRadius={vm.model.borderRadius}
                >
                    {renderPanel()}
                </PanelGlowEffect>
            );
        }

        return renderPanel();
    }
));

GenericPanel.displayName = 'GenericPanel';

export default GenericPanel;
