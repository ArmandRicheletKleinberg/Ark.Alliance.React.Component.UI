/**
 * @fileoverview Panel Empty State Primitive
 * @module components/GenericPanel/primitives
 * 
 * Empty state placeholder for GenericPanel.
 */

import React, { memo, type ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface PanelEmptyStateProps {
    /** Message to display */
    message?: string;
    /** Icon (emoji or element) */
    icon?: ReactNode;
    /** Additional className */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * PanelEmptyState - Placeholder when panel has no content
 * 
 * @example
 * ```tsx
 * <PanelEmptyState message="No data available" icon="📭" />
 * ```
 */
export const PanelEmptyState = memo<PanelEmptyStateProps>(function PanelEmptyState({
    message = 'No content available',
    icon,
    className = '',
}) {
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--ark-text-secondary, #9ca3af)',
        minHeight: '120px',
    };

    const iconStyle: React.CSSProperties = {
        fontSize: '2rem',
        marginBottom: '0.75rem',
        opacity: 0.6,
    };

    const messageStyle: React.CSSProperties = {
        fontSize: '0.875rem',
        maxWidth: '200px',
        lineHeight: 1.5,
    };

    return (
        <div
            className={`ark-panel-empty-state ${className}`}
            style={containerStyle}
        >
            {icon && (
                <div className="ark-panel-empty-state__icon" style={iconStyle}>
                    {typeof icon === 'string' ? icon : icon}
                </div>
            )}
            <p className="ark-panel-empty-state__message" style={messageStyle}>
                {message}
            </p>
        </div>
    );
});

PanelEmptyState.displayName = 'PanelEmptyState';

export default PanelEmptyState;
