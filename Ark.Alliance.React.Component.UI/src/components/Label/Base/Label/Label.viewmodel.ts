/**
 * @fileoverview Label Component ViewModel
 * @module components/Label
 * 
 * Business logic and state management for the Label component.
 * Implements the ViewModel pattern using React hooks.
 */

import { useMemo } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../../core/base';
import {
    defaultLabelModel,
    LabelModelSchema,
    LABEL_SIZE_MAP,
    LABEL_ICON_SIZE_MAP,
} from './Label.model';
import type {
    LabelModel,
    LabelSizeType,
} from './Label.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Label ViewModel options
 */
export interface UseLabelOptions extends Partial<Omit<LabelModel, 'text'>> {
    /** Label text (required) */
    text: string;
}

/**
 * Label ViewModel return type
 */
export interface UseLabelResult extends BaseViewModelResult<LabelModel> {
    /** Computed CSS classes */
    labelClasses: string;

    /** Computed inline styles */
    labelStyles: React.CSSProperties;

    /** Icon size based on label size */
    iconSize: 'xs' | 'sm' | 'md';

    /** Whether label has an icon */
    hasIcon: boolean;

    /** Whether label has a tooltip */
    hasTooltip: boolean;

    /** Tooltip wrapper props */
    tooltipProps: {
        'data-tooltip': string | undefined;
        'data-tooltip-position': string;
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Label ViewModel hook.
 * 
 * Manages label state and provides computed properties for styling.
 * 
 * @example
 * ```tsx
 * function MyLabel() {
 *   const vm = useLabel({
 *     text: 'Email Address',
 *     htmlFor: 'email',
 *     required: true,
 *     icon: 'mail',
 *     tooltip: 'Enter your primary email',
 *   });
 *   
 *   return (
 *     <label className={vm.labelClasses} style={vm.labelStyles}>
 *       {vm.model.text}
 *     </label>
 *   );
 * }
 * ```
 */
export function useLabel(options: UseLabelOptions): UseLabelResult {
    // Parse model options with JSON.stringify for proper dependency tracking
    const modelOptions = useMemo(() => {
        return LabelModelSchema.parse({ ...defaultLabelModel, ...options });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(options)]);

    // Use base ViewModel
    const base = useBaseViewModel<LabelModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'label',
    });

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED PROPERTIES
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Icon size based on label size
     */
    const iconSize = useMemo(() => {
        return LABEL_ICON_SIZE_MAP[base.model.size as LabelSizeType] || 'sm';
    }, [base.model.size]);

    /**
     * Whether label has an icon
     */
    const hasIcon = !!base.model.icon;

    /**
     * Whether label has a tooltip
     */
    const hasTooltip = !!base.model.tooltip;

    /**
     * Tooltip props for the wrapper element
     */
    const tooltipProps = useMemo(() => ({
        'data-tooltip': base.model.tooltip,
        'data-tooltip-position': base.model.tooltipPosition,
    }), [base.model.tooltip, base.model.tooltipPosition]);

    /**
     * Compute inline styles
     */
    const labelStyles = useMemo((): React.CSSProperties => {
        const styles: React.CSSProperties = {};

        // Custom color overrides variant
        if (base.model.color) {
            styles.color = base.model.color;
        }

        // Font size from size map
        styles.fontSize = LABEL_SIZE_MAP[base.model.size as LabelSizeType];

        // Font weight
        const weightMap: Record<string, number> = {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        };
        styles.fontWeight = weightMap[base.model.weight] || 500;

        // Text transform
        if (base.model.transform !== 'none') {
            styles.textTransform = base.model.transform;
        }

        // Custom font family
        if (base.model.fontFamily) {
            styles.fontFamily = base.model.fontFamily;
        }

        // Line height
        if (base.model.lineHeight) {
            styles.lineHeight = base.model.lineHeight;
        }

        // Letter spacing
        if (base.model.letterSpacing) {
            styles.letterSpacing = base.model.letterSpacing;
        }

        // Truncation
        if (base.model.truncate) {
            styles.overflow = 'hidden';
            styles.textOverflow = 'ellipsis';
            styles.whiteSpace = 'nowrap';
        }

        // No wrap
        if (base.model.noWrap && !base.model.truncate) {
            styles.whiteSpace = 'nowrap';
        }

        // Max width for truncation
        if (base.model.maxWidth) {
            styles.maxWidth = base.model.maxWidth;
        }

        // Merge with custom styles
        return { ...styles, ...base.model.style };
    }, [base.model]);

    /**
     * Compute CSS classes
     */
    const labelClasses = useMemo(() => {
        const classes = [
            'ark-label',
            `ark-label--${base.model.variant}`,
            `ark-label--${base.model.size}`,
            `ark-label--${base.model.weight}`,
        ];

        if (base.model.inline) classes.push('ark-label--inline');
        if (base.model.truncate) classes.push('ark-label--truncate');
        if (base.model.disabled) classes.push('ark-label--disabled');
        if (base.model.required) classes.push('ark-label--required');
        if (hasIcon) classes.push('ark-label--has-icon');
        if (hasTooltip) classes.push('ark-label--has-tooltip');
        if (base.model.icon && base.model.iconPosition === 'right') {
            classes.push('ark-label--icon-right');
        }
        if (base.model.className) classes.push(base.model.className);

        return classes.join(' ');
    }, [base.model, hasIcon, hasTooltip]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        labelClasses,
        labelStyles,
        iconSize,
        hasIcon,
        hasTooltip,
        tooltipProps,
    };
}

export default useLabel;
