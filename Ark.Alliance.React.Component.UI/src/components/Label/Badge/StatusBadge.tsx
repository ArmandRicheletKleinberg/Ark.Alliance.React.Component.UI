/**
 * @fileoverview StatusBadge Component
 * @module components/Label/StatusBadge
 * 
 * Displays instance/strategy status with animated indicator.
 */

import { forwardRef, memo } from 'react';
import { useBadge, type UseBadgeOptions } from './Badge.viewmodel';
import './StatusBadge.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface StatusBadgeProps extends UseBadgeOptions {
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * StatusBadge - Status indicator with optional pulse animation
 * 
 * Features:
 * - Multiple status types (running, stopped, error, pending, paused, idle)
 * - Animated pulse for running state
 * - Size variants
 * - Custom colors
 * 
 * @example
 * ```tsx
 * <StatusBadge status="running" />
 * <StatusBadge status="error" label="Connection Failed" />
 * <StatusBadge status="pending" size="lg" showPulse={false} />
 * ```
 */
export const StatusBadge = memo(forwardRef<HTMLSpanElement, StatusBadgeProps>(
    function StatusBadge(props, ref) {
        const { className = '', ...badgeOptions } = props;

        const vm = useBadge(badgeOptions);

        return (
            <span
                ref={ref}
                className={`${vm.badgeClasses} ${className}`}
                style={vm.badgeStyles}
                data-testid={vm.model.testId}
            >
                {/* Pulse indicator for running status */}
                {vm.shouldShowPulse && (
                    <span className="ark-badge__pulse-container">
                        <span
                            className="ark-badge__pulse-ring"
                            style={{ background: vm.statusConfig.text }}
                        />
                        <span
                            className="ark-badge__pulse-dot"
                            style={{ background: vm.statusConfig.text }}
                        />
                    </span>
                )}

                {/* Static indicator for other statuses */}
                {!vm.shouldShowPulse && (
                    <span
                        className="ark-badge__dot"
                        style={{ background: vm.statusConfig.text }}
                    />
                )}

                {vm.displayLabel}
            </span>
        );
    }
));

StatusBadge.displayName = 'StatusBadge';

export default StatusBadge;
