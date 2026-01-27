/**
 * @fileoverview Badge Component ViewModel
 * @module components/Label/Badge
 * 
 * Business logic for status badge components.
 */

import { useMemo } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import { DETAILED_STATUS_COLORS } from '../../../core/constants';
import type { BadgeModel } from './Badge.model';
import {
    defaultBadgeModel,
    BadgeModelSchema,
    BADGE_SIZE_CLASSES,
} from './Badge.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Badge ViewModel options
 */
export interface UseBadgeOptions extends Partial<BadgeModel> { }

/**
 * Badge ViewModel return type
 */
export interface UseBadgeResult extends BaseViewModelResult<BadgeModel> {
    /** Display label (custom or from status) */
    displayLabel: string;
    /** Status color configuration */
    statusConfig: typeof DETAILED_STATUS_COLORS[keyof typeof DETAILED_STATUS_COLORS];
    /** Computed badge classes */
    badgeClasses: string;
    /** Computed badge styles */
    badgeStyles: React.CSSProperties;
    /** Whether to show pulse animation */
    shouldShowPulse: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Badge ViewModel hook
 * 
 * @example
 * ```tsx
 * const vm = useBadge({ status: 'running' });
 * ```
 */
export function useBadge(options: UseBadgeOptions = {}): UseBadgeResult {
    // Parse model options with JSON.stringify for proper dependency tracking
    const modelOptions = useMemo(() => {
        return BadgeModelSchema.parse({ ...defaultBadgeModel, ...options });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(options)]);

    // Use base ViewModel
    const base = useBaseViewModel<BadgeModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'badge',
    });

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════════════

    const statusConfig = useMemo(() => {
        return DETAILED_STATUS_COLORS[base.model.status];
    }, [base.model.status]);

    const displayLabel = useMemo(() => {
        return base.model.label || statusConfig.label;
    }, [base.model.label, statusConfig.label]);

    const shouldShowPulse = useMemo(() => {
        return base.model.showPulse && base.model.status === 'running';
    }, [base.model.showPulse, base.model.status]);

    const badgeClasses = useMemo(() => {
        const classes = [
            'ark-badge',
            BADGE_SIZE_CLASSES[base.model.size],
        ];

        if (base.model.className) classes.push(base.model.className);

        return classes.join(' ');
    }, [base.model.size, base.model.className]);

    const badgeStyles: React.CSSProperties = useMemo(() => ({
        background: base.model.bgColor || statusConfig.bg,
        color: base.model.textColor || statusConfig.text,
        borderColor: base.model.borderColor || statusConfig.border,
    }), [base.model, statusConfig]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        displayLabel,
        statusConfig,
        badgeClasses,
        badgeStyles,
        shouldShowPulse,
    };
}

export default useBadge;
