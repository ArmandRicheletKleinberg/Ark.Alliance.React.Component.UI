/**
 * @fileoverview Card Component ViewModel
 * @module components/Cards/Card
 * 
 * Business logic and state management for the Card component.
 */

import { useCallback, useMemo, useState } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import type { CardModel } from './Card.model';
import {
    defaultCardModel,
    CardModelSchema,
    CARD_STATUS_CONFIG,
} from './Card.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Card ViewModel options
 */
export interface UseCardOptions extends Partial<CardModel> {
    /** Title is required for cards */
    title: string;
    /** Click handler */
    onClick?: () => void;
    /** Dark mode flag for styling */
    isDark?: boolean;
}

/**
 * Card ViewModel return type
 */
export interface UseCardResult extends BaseViewModelResult<CardModel> {
    /** Handle card click */
    handleClick: () => void;
    /** Is currently hovered */
    isHovered: boolean;
    /** Set hover state */
    setIsHovered: (hovered: boolean) => void;
    /** Computed card container class names */
    cardClasses: string;
    /** Computed card container styles */
    cardStyles: React.CSSProperties;
    /** Computed header class names */
    headerClasses: string;
    /** Computed body class names */
    bodyClasses: string;
    /** Current border color */
    borderColor: string;
    /** Current glow color */
    glowColor: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Card ViewModel hook
 * 
 * @example
 * ```tsx
 * const vm = useCard({
 *   title: 'My Card',
 *   status: 'success',
 *   onClick: () => console.log('clicked'),
 * });
 * ```
 */
export function useCard(options: UseCardOptions): UseCardResult {
    const { onClick, isDark = true, ...modelData } = options;

    // Parse model options with JSON.stringify for proper dependency tracking
    const modelOptions = useMemo(() => {
        return CardModelSchema.parse({ ...defaultCardModel, ...modelData });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(modelData)]);

    // Use base ViewModel
    const base = useBaseViewModel<CardModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'card',
    });

    // Local hover state
    const [isHovered, setIsHovered] = useState(false);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════════════

    const statusConfig = CARD_STATUS_CONFIG[base.model.status];

    const borderColor = useMemo(() => {
        if (base.model.borderColor) return base.model.borderColor;
        return isDark ? statusConfig.borderDark : statusConfig.borderLight;
    }, [base.model.borderColor, base.model.status, isDark, statusConfig]);

    const glowColor = useMemo(() => {
        if (base.model.glowColor) return base.model.glowColor;
        return isDark ? statusConfig.glowDark : statusConfig.glowLight;
    }, [base.model.glowColor, base.model.status, isDark, statusConfig]);

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleClick = useCallback(() => {
        if (!base.model.clickable || base.model.disabled) return;

        base.emit('click', {
            id: base.model.id,
            title: base.model.title,
        });

        onClick?.();
    }, [base, onClick]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED STYLES
    // ═══════════════════════════════════════════════════════════════════════

    const cardClasses = useMemo(() => {
        const classes = [
            'ark-card',
            `ark-card--${base.model.status}`,
        ];

        if (base.model.compact) classes.push('ark-card--compact');
        if (base.model.clickable) classes.push('ark-card--clickable');
        if (isHovered) classes.push('ark-card--hovered');
        if (base.model.className) classes.push(base.model.className);

        return classes.join(' ');
    }, [base.model, isHovered]);

    const cardStyles: React.CSSProperties = useMemo(() => ({
        borderColor,
        boxShadow: isHovered ? `0 0 20px ${glowColor}` : 'none',
        cursor: base.model.clickable ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
    }), [borderColor, glowColor, isHovered, base.model.clickable]);

    const headerClasses = useMemo(() => {
        return base.model.compact ? 'ark-card__header--compact' : 'ark-card__header';
    }, [base.model.compact]);

    const bodyClasses = useMemo(() => {
        return base.model.compact ? 'ark-card__body--compact' : 'ark-card__body';
    }, [base.model.compact]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        handleClick,
        isHovered,
        setIsHovered,
        cardClasses,
        cardStyles,
        headerClasses,
        bodyClasses,
        borderColor,
        glowColor,
    };
}

export default useCard;
