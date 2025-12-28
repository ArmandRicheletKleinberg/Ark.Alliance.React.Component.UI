/**
 * @fileoverview ConnectionIndicator Component
 * @module components/Charts/primitives/ConnectionIndicator
 * 
 * Visual indicator for WebSocket/data connection status.
 */

import { memo } from 'react';
import './ConnectionIndicator.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Connection status type
 */
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

/**
 * ConnectionIndicator component props
 */
export interface ConnectionIndicatorProps {
    /** Current connection status */
    status: ConnectionStatus;
    /** Whether to show the status label */
    showLabel?: boolean;
    /** Custom label text (overrides default) */
    label?: string;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Additional CSS class */
    className?: string;
    /** Test ID for automated testing */
    testId?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// STATUS CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; color: string }> = {
    connected: { label: 'LIVE', color: '#22c55e' },
    disconnected: { label: 'DISCONNECTED', color: '#ef4444' },
    connecting: { label: 'CONNECTING', color: '#eab308' },
    error: { label: 'ERROR', color: '#ef4444' },
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ConnectionIndicator - Visual indicator for connection status
 * 
 * Features:
 * - Animated pulse for connected state
 * - Color-coded status (green/red/yellow)
 * - Optional label display
 * - Size variants
 * 
 * @example
 * ```tsx
 * <ConnectionIndicator status="connected" showLabel />
 * <ConnectionIndicator status="disconnected" size="lg" />
 * ```
 */
export const ConnectionIndicator = memo(function ConnectionIndicator(props: ConnectionIndicatorProps) {
    const {
        status,
        showLabel = true,
        label,
        size = 'md',
        className = '',
        testId,
    } = props;

    const config = STATUS_CONFIG[status];
    const displayLabel = label || config.label;

    const sizeClass = `ark-connection-indicator--${size}`;
    const statusClass = `ark-connection-indicator--${status}`;

    return (
        <div
            className={`ark-connection-indicator ${sizeClass} ${statusClass} ${className}`}
            data-testid={testId}
            role="status"
            aria-live="polite"
            aria-label={`Connection status: ${displayLabel}`}
        >
            <span
                className="ark-connection-indicator__dot"
                style={{ backgroundColor: config.color }}
            />
            {showLabel && (
                <span
                    className="ark-connection-indicator__label"
                    style={{ color: config.color }}
                >
                    {displayLabel}
                </span>
            )}
        </div>
    );
});

ConnectionIndicator.displayName = 'ConnectionIndicator';
export default ConnectionIndicator;
