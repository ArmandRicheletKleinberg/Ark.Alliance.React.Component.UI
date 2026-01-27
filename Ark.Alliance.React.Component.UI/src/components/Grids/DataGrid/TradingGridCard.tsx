/**
 * @fileoverview TradingGridCard Component
 * @module components/Grids/DataGrid/TradingGridCard
 * 
 * Trading-focused card wrapper extending GlowCard with grid-specific styling.
 * Uses MVVM pattern with TradingGridCard viewmodel.
 */

import { forwardRef, memo, type ReactNode } from 'react';
import { useTradingGridCard, type UseTradingGridCardOptions } from './TradingGridCard.viewmodel';
import './TradingGridCard.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Status variants for card styling (maps to Card status)
 */
export type GridCardStatus = 'idle' | 'success' | 'warning' | 'error';

/**
 * Props for TradingGridCard
 */
export interface TradingGridCardProps extends UseTradingGridCardOptions {
    /** Children content */
    children: ReactNode;
    /** Icon element */
    icon?: ReactNode;
    /** Header action elements */
    headerActions?: ReactNode;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TradingGridCard - Grid wrapper with trading-focused styling
 * 
 * Features:
 * - Extends Card base component via MVVM inheritance
 * - Trading-specific status colors and gradients
 * - Status-based border and glow effects
 * - Dark/light theme support
 * - Icon and header actions support
 * 
 * @example
 * ```tsx
 * <TradingGridCard
 *   title="Open Positions"
 *   subtitle="3 positions"
 *   icon={<TrendingUp />}
 *   status="success"
 *   isDark
 * >
 *   <DataGrid model={model} data={positions} />
 * </TradingGridCard>
 * ```
 */
export const TradingGridCard = memo(forwardRef<HTMLDivElement, TradingGridCardProps>(
    function TradingGridCard(props, ref) {
        const {
            children,
            icon,
            headerActions,
            className = '',
            ...cardOptions
        } = props;

        const vm = useTradingGridCard(cardOptions);

        /**
         * Handle keyboard navigation for accessibility
         */
        const handleKeyDown = (event: React.KeyboardEvent) => {
            if (vm.handleClick && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                vm.handleClick();
            }
        };

        return (
            <div
                ref={ref}
                className={`ark-trading-card ${vm.cardClasses} ${className}`}
                style={vm.cardStyles}
                onMouseEnter={() => vm.setIsHovered(true)}
                onMouseLeave={() => vm.setIsHovered(false)}
                onClick={vm.handleClick}
                onKeyDown={handleKeyDown}
                tabIndex={vm.model.clickable ? 0 : undefined}
                role={vm.model.clickable ? 'button' : undefined}
                aria-label={vm.model.clickable ? (vm.model.title || 'Interactive card') : undefined}
                data-testid={vm.model.testId}
            >
                {/* Header */}
                {vm.model.showHeader && (
                    <div
                        className={`ark-trading-card__header ${vm.headerClasses}`}
                        style={vm.tradingHeaderStyles}
                    >
                        <div className="ark-trading-card__title-group">
                            {icon && (
                                <div className="ark-trading-card__icon-wrapper">
                                    <div className={`ark-trading-card__icon-glow ark-trading-card__icon-glow--${vm.model.status}`} />
                                    <div className="ark-trading-card__icon">
                                        {icon}
                                    </div>
                                </div>
                            )}
                            <div className="ark-trading-card__titles">
                                <h3 className="ark-trading-card__title">
                                    {vm.model.title}
                                </h3>
                                {vm.model.subtitle && (
                                    <p className="ark-trading-card__subtitle">
                                        {vm.model.subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                        {headerActions && (
                            <div className="ark-trading-card__actions">
                                {headerActions}
                            </div>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className={`ark-trading-card__body ${vm.bodyClasses}`}>
                    {children}
                </div>
            </div>
        );
    }
));

TradingGridCard.displayName = 'TradingGridCard';

export default TradingGridCard;
