/**
 * @fileoverview GlowCard Component
 * @module components/Cards/GlowCard
 * 
 * Premium card with individual hover glow effect.
 * Supports status-based styling and flexible content.
 */

import { forwardRef, memo, type ReactNode } from 'react';
import { useCard, type UseCardOptions } from '../Card.viewmodel';
import './GlowCard.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface GlowCardProps extends Omit<UseCardOptions, 'clickable'> {
    /** Card content */
    children: ReactNode;
    /** Optional icon element */
    icon?: ReactNode;
    /** Optional header actions (buttons, etc.) */
    headerActions?: ReactNode;
    /** Click handler (makes card clickable) */
    onClick?: () => void;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GlowCard - Premium card with hover glow effect
 * 
 * Features:
 * - Status-based border and glow colors
 * - Theme-aware styling (dark/light)
 * - Hover glow animation
 * - Icon support
 * - Header actions slot
 * - Compact mode
 * 
 * @example
 * ```tsx
 * <GlowCard title="System Status" status="success" icon={<CheckIcon />}>
 *   All systems operational
 * </GlowCard>
 * 
 * <GlowCard 
 *   title="Alerts" 
 *   status="warning" 
 *   headerActions={<Button size="sm">View All</Button>}
 * >
 *   3 pending alerts
 * </GlowCard>
 * ```
 */
export const GlowCard = memo(forwardRef<HTMLDivElement, GlowCardProps>(
    function GlowCard(props, ref) {
        const {
            children,
            icon,
            headerActions,
            onClick,
            className = '',
            isDark = true,
            ...cardOptions
        } = props;

        const vm = useCard({
            ...cardOptions,
            isDark,
            clickable: !!onClick,
            onClick,
        });

        return (
            <div
                ref={ref}
                className={`${vm.cardClasses} ${className}`}
                style={vm.cardStyles}
                onMouseEnter={() => vm.setIsHovered(true)}
                onMouseLeave={() => vm.setIsHovered(false)}
                onClick={vm.handleClick}
                data-testid={vm.model.testId}
            >
                {/* Header */}
                {vm.model.showHeader && (
                    <div className={vm.headerClasses}>
                        <div className="ark-card__header-left">
                            {icon && (
                                <div className="ark-card__icon">
                                    {icon}
                                </div>
                            )}
                            <div className="ark-card__titles">
                                <h3 className="ark-card__title">
                                    {vm.model.title}
                                </h3>
                                {vm.model.subtitle && (
                                    <div className="ark-card__subtitle">
                                        {vm.model.subtitle}
                                    </div>
                                )}
                            </div>
                        </div>
                        {headerActions && (
                            <div className="ark-card__header-actions">
                                {headerActions}
                            </div>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className={vm.bodyClasses}>
                    {children}
                </div>
            </div>
        );
    }
));

GlowCard.displayName = 'GlowCard';

export default GlowCard;
