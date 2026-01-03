/**
 * @fileoverview TechBadge Component ViewModel
 * @module components/Label/TechBadge
 * 
 * Business logic for technology badge components.
 */

import { useMemo, useCallback } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { TechBadgeModel, TechnologyData } from './TechBadge.model';
import {
    defaultTechBadgeModel,
    TechBadgeModelSchema,
    TECH_BADGE_SIZE_CLASSES,
    TECH_BADGE_ICON_SIZES,
} from './TechBadge.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TechBadge ViewModel options
 */
export interface UseTechBadgeOptions extends Partial<TechBadgeModel> { }

/**
 * TechBadge ViewModel return type
 */
export interface UseTechBadgeResult extends BaseViewModelResult<TechBadgeModel> {
    /** Display name for the badge */
    displayName: string;
    /** Brand color */
    brandColor: string;
    /** Icon class */
    iconClass: string | undefined;
    /** Icon size */
    iconSize: string;
    /** Computed badge classes */
    badgeClasses: string;
    /** Computed badge styles */
    badgeStyles: React.CSSProperties;
    /** Handle badge click */
    handleClick: () => void;
    /** Whether badge is clickable */
    isClickable: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TechBadge ViewModel hook
 * 
 * @example
 * ```tsx
 * const vm = useTechBadge({ techKey: 'react', technology: { name: 'React', color: '#61dafb' } });
 * ```
 */
export function useTechBadge(options: UseTechBadgeOptions = {}): UseTechBadgeResult {
    // Parse model options with JSON.stringify for proper dependency tracking
    const modelOptions = useMemo(() => {
        return TechBadgeModelSchema.parse({ ...defaultTechBadgeModel, ...options });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(options)]);

    // Use base ViewModel
    const base = useBaseViewModel<TechBadgeModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'techBadge',
    });

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════════════

    const displayName = useMemo(() => {
        return base.model.technology?.name || base.model.techKey;
    }, [base.model.technology?.name, base.model.techKey]);

    const brandColor = useMemo(() => {
        return base.model.technology?.color || '#64748b';
    }, [base.model.technology?.color]);

    const iconClass = useMemo(() => {
        return base.model.technology?.icon;
    }, [base.model.technology?.icon]);

    const iconSize = useMemo(() => {
        return TECH_BADGE_ICON_SIZES[base.model.size];
    }, [base.model.size]);

    const isClickable = useMemo(() => {
        return !!base.model.onClick && !!base.model.technology;
    }, [base.model.onClick, base.model.technology]);

    const badgeClasses = useMemo(() => {
        const classes = [
            'ark-tech-badge',
            TECH_BADGE_SIZE_CLASSES[base.model.size],
            'font-mono font-semibold rounded-lg border transition-all duration-300 inline-flex items-center',
        ];

        if (base.model.active) {
            classes.push('ark-tech-badge--active');
        }

        if (isClickable) {
            classes.push('ark-tech-badge--clickable cursor-pointer');
        }

        if (!base.model.technology) {
            classes.push('ark-tech-badge--unknown opacity-70');
        }

        if (base.model.className) {
            classes.push(base.model.className);
        }

        return classes.join(' ');
    }, [base.model.size, base.model.active, base.model.technology, base.model.className, isClickable]);

    const badgeStyles: React.CSSProperties = useMemo(() => ({
        backgroundColor: base.model.active
            ? `${brandColor}20`
            : 'rgba(30, 41, 59, 0.6)',
        borderColor: base.model.active
            ? `${brandColor}80`
            : `${brandColor}40`,
        color: base.model.active ? brandColor : `${brandColor}cc`,
    }), [base.model.active, brandColor]);

    // ═══════════════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleClick = useCallback(() => {
        if (base.model.onClick && base.model.technology) {
            base.model.onClick(base.model.technology);
        }
    }, [base.model.onClick, base.model.technology]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        displayName,
        brandColor,
        iconClass,
        iconSize,
        badgeClasses,
        badgeStyles,
        handleClick,
        isClickable,
    };
}

export default useTechBadge;
