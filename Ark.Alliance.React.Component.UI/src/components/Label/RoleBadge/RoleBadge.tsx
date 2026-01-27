/**
 * @fileoverview RoleBadge Component
 * @module components/Label/RoleBadge
 * 
 * Displays user role with appropriate color coding and optional remove action.
 * 
 * @example
 * ```tsx
 * import { RoleBadge } from 'ark-alliance-react-ui';
 * 
 * // Basic usage
 * <RoleBadge role="admin" />
 * 
 * // With size variant
 * <RoleBadge role="supervisor" size="lg" />
 * 
 * // Removable with callback
 * <RoleBadge role="member" removable onRemove={() => handleRemove()} />
 * ```
 * 
 * @author Armand Richelet-Kleinberg
 */

import { forwardRef, memo } from 'react';
import { useRoleBadge, type UseRoleBadgeOptions } from './RoleBadge.viewmodel';
import './RoleBadge.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface RoleBadgeProps extends UseRoleBadgeOptions {
    /** Callback when remove button is clicked */
    onRemove?: () => void;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * RoleBadge - Displays user role with color coding
 * 
 * Features:
 * - Five role types with distinct colors (admin, supervisor, collaborator, member, guest)
 * - Three size variants (sm, md, lg)
 * - Optional remove button for role management UI
 * - Accessible with keyboard navigation
 * - Responsive and dark mode compatible
 */
export const RoleBadge = memo(forwardRef<HTMLSpanElement, RoleBadgeProps>(
    function RoleBadge(props, ref) {
        const { onRemove, className = '', ...badgeOptions } = props;

        const vm = useRoleBadge(badgeOptions);

        return (
            <span
                ref={ref}
                className={`${vm.badgeClasses} ${className}`.trim()}
                style={vm.badgeStyles}
                data-testid={vm.model.testId || `role-badge-${vm.model.role}`}
                data-role={vm.model.role}
                role="status"
                aria-label={`Role: ${vm.displayLabel}`}
            >
                {vm.displayLabel}

                {vm.model.removable && onRemove && (
                    <button
                        type="button"
                        className="ark-role-badge__remove"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        aria-label={`Remove ${vm.displayLabel} role`}
                        title={`Remove ${vm.displayLabel} role`}
                    >
                        ×
                    </button>
                )}
            </span>
        );
    }
));

RoleBadge.displayName = 'RoleBadge';

export default RoleBadge;
