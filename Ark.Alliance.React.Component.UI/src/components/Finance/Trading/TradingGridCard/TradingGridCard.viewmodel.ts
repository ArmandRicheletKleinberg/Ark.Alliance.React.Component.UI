/**
 * @fileoverview TradingGridCard Component ViewModel
 * @module components/Finance/Trading/TradingGridCard
 * 
 * Business logic and state management for TradingGridCard.
 * Extends Card viewmodel with trading-specific styling configuration.
 */

import { useMemo } from 'react';
import { useCard, type UseCardOptions, type UseCardResult } from '../../../Cards/Card.viewmodel';
import type { TradingGridCardModel } from './TradingGridCard.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TradingGridCard ViewModel options
 */
export interface UseTradingGridCardOptions extends Partial<TradingGridCardModel> {
    /** Title is required for cards */
    title: string;
    /** Click handler */
    onClick?: () => void;
}

/**
 * TradingGridCard ViewModel return type
 */
export interface UseTradingGridCardResult extends UseCardResult {
    /** Trading-specific header styles */
    tradingHeaderStyles: React.CSSProperties;
}

// ═══════════════════════════════════════════════════════════════════════════
// COLOR CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const TRADING_STATUS_COLORS = {
    dark: {
        idle: { border: 'rgba(0, 212, 255, 0.3)', glow: 'rgba(0, 212, 255, 0.15)' },
        success: { border: 'rgba(16, 185, 129, 0.4)', glow: 'rgba(16, 185, 129, 0.2)' },
        warning: { border: 'rgba(245, 158, 11, 0.4)', glow: 'rgba(245, 158, 11, 0.2)' },
        error: { border: 'rgba(239, 68, 68, 0.4)', glow: 'rgba(239, 68, 68, 0.2)' },
        info: { border: 'rgba(59, 130, 246, 0.4)', glow: 'rgba(59, 130, 246, 0.2)' },
        neutral: { border: 'rgba(107, 114, 128, 0.4)', glow: 'rgba(107, 114, 128, 0.2)' },
    },
    light: {
        idle: { border: 'rgba(0, 170, 200, 0.25)', glow: 'rgba(0, 170, 200, 0.08)' },
        success: { border: 'rgba(16, 160, 110, 0.3)', glow: 'rgba(16, 160, 110, 0.1)' },
        warning: { border: 'rgba(220, 140, 10, 0.3)', glow: 'rgba(220, 140, 10, 0.1)' },
        error: { border: 'rgba(220, 60, 60, 0.3)', glow: 'rgba(220, 60, 60, 0.1)' },
        info: { border: 'rgba(59, 130, 246, 0.3)', glow: 'rgba(59, 130, 246, 0.1)' },
        neutral: { border: 'rgba(107, 114, 128, 0.3)', glow: 'rgba(107, 114, 128, 0.1)' },
    },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TradingGridCard ViewModel hook
 * 
 * Extends Card viewmodel with trading-specific styling configuration.
 * 
 * @example
 * ```tsx
 * const vm = useTradingGridCard({
 *   title: 'Open Positions',
 *   status: 'success',
 *   isDark: true,
 * });
 * ```
 */
export function useTradingGridCard(options: UseTradingGridCardOptions): UseTradingGridCardResult {
    const { isDark = true, ...restOptions } = options;

    // Use base Card ViewModel with isDark option
    const cardViewModel = useCard({
        ...restOptions,
        isDark,
    } as UseCardOptions);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Trading-specific header gradient styles
     */
    const tradingHeaderStyles = useMemo((): React.CSSProperties => {
        const colorTheme = isDark ? TRADING_STATUS_COLORS.dark : TRADING_STATUS_COLORS.light;
        const statusColors = colorTheme[cardViewModel.model.status];

        if (isDark) {
            return {
                background: 'linear-gradient(90deg, rgba(0, 212, 255, 0.05), transparent)',
            };
        } else {
            return {
                background: `linear-gradient(90deg, ${statusColors.glow}, transparent)`,
            };
        }
    }, [isDark, cardViewModel.model.status]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...cardViewModel,
        tradingHeaderStyles,
    };
}

export default useTradingGridCard;
