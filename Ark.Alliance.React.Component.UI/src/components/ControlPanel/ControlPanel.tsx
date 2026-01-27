/**
 * @fileoverview ControlPanel Primitive Component
 * @module components/ControlPanel
 * 
 * Standardized control panel component that abstracts common patterns
 * from FinancialChartControls and Chart3D/ControlPanel.
 * 
 * Built using composition with Panel.tsx primitive, NOT modification.
 */

import { forwardRef, memo, type ReactNode } from 'react';
import { useControlPanel, type UseControlPanelOptions } from './ControlPanel.viewmodel';
import type { HeaderAction } from './ControlPanel.model';
import './ControlPanel.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ControlPanel component props
 */
export interface ControlPanelProps extends UseControlPanelOptions {
    /** Panel content - typically sections with controls */
    children: ReactNode;
    /** Header content (overrides title if provided) */
    header?: ReactNode;
    /** Footer content */
    footer?: ReactNode;
    /** Additional CSS class */
    className?: string;
    /** Inline styles */
    style?: React.CSSProperties;
}

/**
 * ControlPanelSection component props
 */
export interface ControlPanelSectionProps {
    /** Section title */
    title: string;
    /** Section content */
    children: ReactNode;
    /** Section icon */
    icon?: ReactNode;
    /** Additional CSS class */
    className?: string;
}

/**
 * ControlPanelRow component props
 */
export interface ControlPanelRowProps {
    /** Row label */
    label: string;
    /** Row content (input, select, etc.) */
    children: ReactNode;
    /** Value display (right side) */
    value?: ReactNode;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ControlPanelSection - Labeled section within control panel
 * 
 * @example
 * ```tsx
 * <ControlPanelSection title="Appearance">
 *   <Slider label="Opacity" ... />
 * </ControlPanelSection>
 * ```
 */
export const ControlPanelSection = memo<ControlPanelSectionProps>(function ControlPanelSection({
    title,
    children,
    icon,
    className = '',
}) {
    return (
        <div className={`ark-control-panel__section ${className}`}>
            <h3 className="ark-control-panel__section-title">
                {icon && <span className="ark-control-panel__section-icon">{icon}</span>}
                {title}
            </h3>
            <div className="ark-control-panel__section-content">
                {children}
            </div>
        </div>
    );
});

ControlPanelSection.displayName = 'ControlPanelSection';

/**
 * ControlPanelRow - Label + control row within section
 * 
 * @example
 * ```tsx
 * <ControlPanelRow label="Border Width" value={`${borderWidth}px`}>
 *   <input type="range" ... />
 * </ControlPanelRow>
 * ```
 */
export const ControlPanelRow = memo<ControlPanelRowProps>(function ControlPanelRow({
    label,
    children,
    value,
    className = '',
}) {
    return (
        <div className={`ark-control-panel__row ${className}`}>
            <label className="ark-control-panel__row-label">{label}</label>
            <div className="ark-control-panel__row-control">{children}</div>
            {value !== undefined && (
                <span className="ark-control-panel__row-value">{value}</span>
            )}
        </div>
    );
});

ControlPanelRow.displayName = 'ControlPanelRow';

// ═══════════════════════════════════════════════════════════════════════════
// HEADER ACTION BUTTON
// ═══════════════════════════════════════════════════════════════════════════

interface ActionButtonProps {
    action: HeaderAction;
    onClick: (id: string) => void;
}

const ActionButton = memo<ActionButtonProps>(function ActionButton({ action, onClick }) {
    const variantClass = action.variant !== 'default' ? `ark-control-panel__action--${action.variant}` : '';
    const activeClass = action.active ? 'ark-control-panel__action--active' : '';

    return (
        <button
            type="button"
            className={`ark-control-panel__action ${variantClass} ${activeClass}`}
            title={action.label}
            onClick={() => onClick(action.id)}
            aria-label={action.label}
        >
            {action.icon}
        </button>
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ControlPanel - Standardized control panel primitive
 * 
 * Provides a consistent container for component-specific controls with:
 * - Collapsible header with title and action buttons
 * - Visibility toggle (optional internal or controlled)
 * - Sectioned content areas
 * - Connection status indicator
 * - Loading state
 * 
 * This component abstracts patterns from FinancialChartControls and
 * Chart3D/ControlPanel into a reusable primitive.
 * 
 * @example
 * ```tsx
 * <ControlPanel
 *     title="Settings"
 *     titleIcon="⚙️"
 *     collapsible
 *     headerActions={[
 *         { id: 'reset', label: 'Reset', icon: '🔄' },
 *     ]}
 *     onActionClick={(id) => console.log('Action:', id)}
 * >
 *     <ControlPanelSection title="Display">
 *         <ControlPanelRow label="Theme">
 *             <select>...</select>
 *         </ControlPanelRow>
 *     </ControlPanelSection>
 * </ControlPanel>
 * ```
 */
export const ControlPanel = memo(forwardRef<HTMLDivElement, ControlPanelProps>(
    function ControlPanel(props, ref) {
        const {
            children,
            header,
            footer,
            className = '',
            style,
            ...controlPanelOptions
        } = props;

        const vm = useControlPanel(controlPanelOptions);

        // Compute inline styles
        const panelStyle: React.CSSProperties = {
            ...style,
            width: vm.model.position === 'left' || vm.model.position === 'right' || vm.model.position === 'floating'
                ? vm.model.width
                : undefined,
            height: vm.model.height,
        };

        // Don't render if not visible
        if (!vm.model.visible && !vm.containerClasses.includes('hidden')) {
            return null;
        }

        return (
            <div
                ref={ref}
                className={`${vm.containerClasses} ${className}`}
                style={panelStyle}
                data-testid={vm.model.testId}
                role="region"
                aria-label={vm.model.title}
            >
                {/* Header */}
                <div className={vm.headerClasses}>
                    <h2 className="ark-control-panel__title">
                        {vm.model.titleIcon && (
                            <span className="ark-control-panel__title-icon">{vm.model.titleIcon}</span>
                        )}
                        {header || vm.model.title}
                    </h2>

                    <div className="ark-control-panel__header-actions">
                        {/* Custom header actions */}
                        {vm.model.headerActions.map(action => (
                            <ActionButton
                                key={action.id}
                                action={action}
                                onClick={vm.handleActionClick}
                            />
                        ))}

                        {/* Collapse button */}
                        {vm.model.collapsible && (
                            <button
                                type="button"
                                className="ark-control-panel__collapse-btn"
                                onClick={vm.toggleCollapse}
                                aria-label={vm.isCollapsed ? 'Expand panel' : 'Collapse panel'}
                                aria-expanded={!vm.isCollapsed}
                            >
                                {vm.isCollapsed ? '▲' : '▼'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                {!vm.isCollapsed && (
                    <div className={vm.contentClasses}>
                        {children}
                    </div>
                )}

                {/* Footer */}
                {footer && !vm.isCollapsed && (
                    <div className="ark-control-panel__footer">
                        {footer}
                    </div>
                )}

                {/* Connection Status (if applicable) */}
                {vm.connectionIndicatorProps.visible && (
                    <div className="ark-control-panel__status">
                        <span
                            className={`ark-control-panel__status-dot ark-control-panel__status-dot--${vm.connectionIndicatorProps.status}`}
                        />
                        <span className="ark-control-panel__status-label">
                            {vm.connectionIndicatorProps.status.charAt(0).toUpperCase() + vm.connectionIndicatorProps.status.slice(1)}
                        </span>
                    </div>
                )}

                {/* Loading Overlay */}
                {vm.model.isLoading && (
                    <div className="ark-control-panel__loading">
                        <div className="ark-control-panel__loading-spinner" />
                    </div>
                )}
            </div>
        );
    }
));

ControlPanel.displayName = 'ControlPanel';

export default ControlPanel;
