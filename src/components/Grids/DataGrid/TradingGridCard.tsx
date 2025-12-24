/**
 * @fileoverview TradingGridCard Wrapper
 * @module components/Grids/DataGrid
 * 
 * GlowCard-style wrapper for grids with status-based styling.
 * Based on patterns from GtxOrderPanel and Lib.Grid TradingGridCard.
 */

import { useState, type ReactNode, type CSSProperties, forwardRef, memo } from 'react';
import './TradingGridCard.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Status variants for card styling.
 */
export type GridCardStatus = 'idle' | 'success' | 'warning' | 'error';

/**
 * Props for TradingGridCard.
 */
export interface TradingGridCardProps {
    /** Card title */
    title: string;
    /** Subtitle (e.g., count) */
    subtitle?: string;
    /** Icon element */
    icon?: ReactNode;
    /** Status for coloring */
    status?: GridCardStatus;
    /** Header action elements */
    headerActions?: ReactNode;
    /** Children content */
    children: ReactNode;
    /** Dark mode */
    isDark?: boolean;
    /** Additional class name */
    className?: string;
    /** Click handler */
    onClick?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// COLOR CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const darkStatusColors: Record<GridCardStatus, { border: string; glow: string }> = {
    idle: { border: 'rgba(0, 212, 255, 0.3)', glow: 'rgba(0, 212, 255, 0.15)' },
    success: { border: 'rgba(16, 185, 129, 0.4)', glow: 'rgba(16, 185, 129, 0.2)' },
    warning: { border: 'rgba(245, 158, 11, 0.4)', glow: 'rgba(245, 158, 11, 0.2)' },
    error: { border: 'rgba(239, 68, 68, 0.4)', glow: 'rgba(239, 68, 68, 0.2)' },
};

const lightStatusColors: Record<GridCardStatus, { border: string; glow: string }> = {
    idle: { border: 'rgba(0, 170, 200, 0.25)', glow: 'rgba(0, 170, 200, 0.08)' },
    success: { border: 'rgba(16, 160, 110, 0.3)', glow: 'rgba(16, 160, 110, 0.1)' },
    warning: { border: 'rgba(220, 140, 10, 0.3)', glow: 'rgba(220, 140, 10, 0.1)' },
    error: { border: 'rgba(220, 60, 60, 0.3)', glow: 'rgba(220, 60, 60, 0.1)' },
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Trading grid card wrapper with glow effects.
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
            title,
            subtitle,
            icon,
            status = 'idle',
            headerActions,
            children,
            isDark = true,
            className = '',
            onClick,
        } = props;

        const [isHovered, setIsHovered] = useState(false);
        const colors = isDark ? darkStatusColors[status] : lightStatusColors[status];

        // Card style
        const cardStyle: CSSProperties = isDark
            ? {
                background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95), rgba(20, 30, 60, 0.9))',
                border: `1px solid ${isHovered ? colors.border.replace('0.3', '0.6').replace('0.4', '0.7') : colors.border}`,
                boxShadow: isHovered
                    ? `0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}`
                    : `0 0 8px ${colors.glow}`,
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
            }
            : {
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95))',
                border: `1px solid ${colors.border}`,
                boxShadow: isHovered
                    ? `0 8px 32px ${colors.glow}`
                    : `0 4px 16px ${colors.glow}`,
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
            };

        // Header style
        const headerStyle: CSSProperties = isDark
            ? { background: 'linear-gradient(90deg, rgba(0, 212, 255, 0.05), transparent)' }
            : { background: `linear-gradient(90deg, ${colors.glow}, transparent)` };

        return (
            <div
                ref={ref}
                className={`ark-trading-card ${onClick ? 'ark-trading-card--clickable' : ''} ${className}`}
                style={cardStyle}
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Header */}
                <div
                    className={`ark-trading-card__header ${isDark ? 'ark-trading-card__header--dark' : 'ark-trading-card__header--light'}`}
                    style={headerStyle}
                >
                    <div className="ark-trading-card__title-group">
                        {icon && (
                            <div className="ark-trading-card__icon-wrapper">
                                <div className={`ark-trading-card__icon-glow ark-trading-card__icon-glow--${status}`} />
                                <div className={`ark-trading-card__icon ${isDark ? 'ark-trading-card__icon--dark' : ''}`}>
                                    {icon}
                                </div>
                            </div>
                        )}
                        <div>
                            <h3 className={`ark-trading-card__title ${isDark ? 'ark-trading-card__title--dark' : ''}`}>
                                {title}
                            </h3>
                            {subtitle && (
                                <p className={`ark-trading-card__subtitle ${isDark ? 'ark-trading-card__subtitle--dark' : ''}`}>
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    {headerActions && <div className="ark-trading-card__actions">{headerActions}</div>}
                </div>

                {/* Body */}
                <div className="ark-trading-card__body">{children}</div>
            </div>
        );
    }
));

TradingGridCard.displayName = 'TradingGridCard';

export default TradingGridCard;
