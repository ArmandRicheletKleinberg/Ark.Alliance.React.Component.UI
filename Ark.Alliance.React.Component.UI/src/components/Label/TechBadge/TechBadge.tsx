/**
 * @fileoverview TechBadge Component
 * @module components/Label/TechBadge
 * 
 * Displays technology/framework badges with icons, colors, and click functionality.
 */

import { forwardRef, memo } from 'react';
import { useTechBadge, type UseTechBadgeOptions } from './TechBadge.viewmodel';
import './TechBadge.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface TechBadgeProps extends UseTechBadgeOptions {
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TechBadge - Technology/framework badge with icon and color
 * 
 * Features:
 * - Brand color styling
 * - Optional icon display (Font Awesome / Devicon)
 * - Size variants (sm, md, lg)
 * - Active/selected state
 * - Click handler for modal display
 * 
 * @example
 * ```tsx
 * <TechBadge 
 *     techKey="react"
 *     technology={{ name: 'React', color: '#61dafb', icon: 'fab fa-react' }}
 *     showIcon
 *     onClick={(tech) => console.log(tech)}
 * />
 * ```
 */
export const TechBadge = memo(forwardRef<HTMLSpanElement, TechBadgeProps>(
    function TechBadge(props, ref) {
        const { className = '', ...badgeOptions } = props;

        const vm = useTechBadge(badgeOptions);

        return (
            <span
                ref={ref}
                className={`${vm.badgeClasses} ${className}`}
                style={vm.badgeStyles}
                onClick={vm.handleClick}
                title={vm.model.technology?.description || vm.displayName}
                data-testid={vm.model.testId}
            >
                {/* Technology Icon */}
                {vm.model.showIcon && vm.iconClass && (
                    <i
                        className={vm.iconClass}
                        style={{ color: vm.brandColor, fontSize: vm.iconSize }}
                        aria-hidden="true"
                    />
                )}

                {/* Technology Name */}
                <span>{vm.displayName}</span>
            </span>
        );
    }
));

TechBadge.displayName = 'TechBadge';

export default TechBadge;
