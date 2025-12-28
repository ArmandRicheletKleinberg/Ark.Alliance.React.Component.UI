/**
 * @fileoverview Panel Component
 * @module components/Panel
 * 
 * Container component with header, body, and footer sections.
 */

import { forwardRef, memo, type ReactNode } from 'react';
import { usePanel, type UsePanelOptions } from './Panel.viewmodel';
import './Panel.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface PanelProps extends UsePanelOptions {
    /** Panel content */
    children: ReactNode;
    /** Header content */
    header?: ReactNode;
    /** Footer content */
    footer?: ReactNode;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Panel - Container component with sections
 * 
 * @example
 * ```tsx
 * <Panel header="Settings" variant="glass">
 *   Content here
 * </Panel>
 * <Panel title="Info" collapsible>
 *   Collapsible content
 * </Panel>
 * ```
 */
export const Panel = memo(forwardRef<HTMLDivElement, PanelProps>(
    function Panel(props, ref) {
        const {
            children,
            header,
            footer,
            className = '',
            ...panelOptions
        } = props;

        const vm = usePanel(panelOptions);

        return (
            <div
                ref={ref}
                className={`${vm.panelClasses} ${className}`}
                data-testid={vm.model.testId}
            >
                {/* Header */}
                {(header || vm.model.title) && (
                    <div className="ark-panel__header">
                        <div className="ark-panel__header-content">
                            {header || vm.model.title}
                        </div>
                        {vm.model.collapsible && (
                            <button
                                className="ark-panel__collapse-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    vm.toggleCollapse();
                                }}
                                aria-label={vm.isCollapsed ? 'Expand panel' : 'Collapse panel'}
                                aria-expanded={!vm.isCollapsed}
                                type="button"
                            >
                                {vm.isCollapsed ? '▶' : '▼'}
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                {!vm.isCollapsed && (
                    <div className={vm.bodyClasses}>
                        {children}
                    </div>
                )}

                {/* Footer */}
                {footer && !vm.isCollapsed && (
                    <div className="ark-panel__footer">
                        {footer}
                    </div>
                )}
            </div>
        );
    }
));

Panel.displayName = 'Panel';

export default Panel;
