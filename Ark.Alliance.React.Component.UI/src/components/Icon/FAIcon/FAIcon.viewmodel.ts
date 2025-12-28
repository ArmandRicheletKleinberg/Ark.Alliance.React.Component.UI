/**
 * @fileoverview Font Awesome Icon Component ViewModel
 * @module components/Icon/FAIcon
 * 
 * ViewModel hook for FAIcon component with icon resolution,
 * transformation handling, and computed styles.
 */

import { useCallback, useMemo } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import {
    defaultFAIconModel,
    FAIconModelSchema,
    FA_SIZE_MAP,
    STYLE_PREFIX_MAP,
} from './FAIcon.model';
import type {
    FAIconModel,
    FAIconStyleType,
    FAIconSizeType,
    FAIconPrefixType,
} from './FAIcon.model';
import type { IconDefinition, IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';

// Import icon libraries for dynamic lookup
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

// ═══════════════════════════════════════════════════════════════════════════
// ICON LIBRARY MAP
// ═══════════════════════════════════════════════════════════════════════════

const ICON_LIBRARIES: Record<FAIconPrefixType, Record<string, IconDefinition>> = {
    fas: fas as unknown as Record<string, IconDefinition>,
    far: far as unknown as Record<string, IconDefinition>,
    fab: fab as unknown as Record<string, IconDefinition>,
};

/**
 * Convert icon name to camelCase format used by Font Awesome
 * e.g., 'arrow-right' -> 'faArrowRight'
 */
function toCamelCase(iconName: string): string {
    return 'fa' + iconName
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * FAIcon ViewModel options
 */
export interface UseFAIconOptions extends Partial<Omit<FAIconModel, 'name'>> {
    /** Icon name (required) */
    name: string;
    /** Click handler */
    onClick?: (event: React.MouseEvent<SVGSVGElement>) => void;
    /** Focus handler */
    onFocus?: (event: React.FocusEvent<SVGSVGElement>) => void;
    /** Blur handler */
    onBlur?: (event: React.FocusEvent<SVGSVGElement>) => void;
}

/**
 * FAIcon ViewModel return type
 */
export interface UseFAIconResult extends BaseViewModelResult<FAIconModel> {
    /** Resolved Font Awesome icon definition */
    iconDef: IconDefinition | null;
    /** Whether the icon was found */
    isValid: boolean;
    /** Icon prefix (fas, far, fab) */
    prefix: IconPrefix;
    /** Icon name for FontAwesomeIcon component */
    iconName: IconName;
    /** Handle click */
    handleClick: (event: React.MouseEvent<SVGSVGElement>) => void;
    /** Handle focus */
    handleFocus: (event: React.FocusEvent<SVGSVGElement>) => void;
    /** Handle blur */
    handleBlur: (event: React.FocusEvent<SVGSVGElement>) => void;
    /** Is icon interactive (has onClick) */
    isInteractive: boolean;
    /** Computed CSS classes */
    iconClasses: string;
    /** Computed inline styles */
    iconStyles: React.CSSProperties;
    /** Font Awesome size class */
    faSize: string | undefined;
    /** Transform string for FA */
    faTransform: string | undefined;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * FAIcon ViewModel hook
 * 
 * Manages Font Awesome icon resolution, transformation, and styling.
 * 
 * @example
 * ```tsx
 * const vm = useFAIcon({
 *     name: 'user',
 *     iconStyle: 'solid',
 *     size: 'lg',
 *     color: '#00ffff',
 * });
 * 
 * if (!vm.isValid) return null;
 * 
 * return <FontAwesomeIcon icon={vm.iconDef} style={vm.iconStyles} />;
 * ```
 */
export function useFAIcon(options: UseFAIconOptions): UseFAIconResult {
    // Parse model options
    const modelOptions = useMemo(() => {
        const { onClick, onFocus, onBlur, ...modelData } = options;
        return FAIconModelSchema.parse({ ...defaultFAIconModel, ...modelData });
    }, [
        options.name,
        options.iconStyle,
        options.size,
        options.color,
        options.rotation,
        options.flip,
        options.spin,
        options.pulse,
        options.fixedWidth,
        options.border,
        options.pull,
        options.beat,
        options.fade,
        options.bounce,
        options.shake,
        options.disabled,
        options.className,
        options.ariaLabel,
    ]);

    // Use base ViewModel
    const base = useBaseViewModel<FAIconModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'fa-icon',
    });

    // ═══════════════════════════════════════════════════════════════════════
    // ICON RESOLUTION
    // ═══════════════════════════════════════════════════════════════════════

    const prefix = STYLE_PREFIX_MAP[base.model.iconStyle as FAIconStyleType];
    const iconName = base.model.name as IconName;

    /**
     * Resolve icon definition from library
     */
    const iconDef = useMemo((): IconDefinition | null => {
        const library = ICON_LIBRARIES[prefix];
        if (!library) return null;

        // Try camelCase format (e.g., 'faUser' for 'user')
        const camelName = toCamelCase(base.model.name);
        const icon = library[camelName];

        return icon || null;
    }, [prefix, base.model.name]);

    const isValid = iconDef !== null;

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
        if (base.model.disabled) {
            event.preventDefault();
            return;
        }
        base.emit('click', { id: base.model.id, name: base.model.name });
        options.onClick?.(event);
    }, [base, options.onClick]);

    const handleFocus = useCallback((event: React.FocusEvent<SVGSVGElement>) => {
        base.emit('focus', { id: base.model.id, name: base.model.name });
        options.onFocus?.(event);
    }, [base, options.onFocus]);

    const handleBlur = useCallback((event: React.FocusEvent<SVGSVGElement>) => {
        base.emit('blur', { id: base.model.id, name: base.model.name });
        options.onBlur?.(event);
    }, [base, options.onBlur]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED PROPERTIES
    // ═══════════════════════════════════════════════════════════════════════

    const isInteractive = useMemo(() => {
        return !!options.onClick && !base.model.disabled;
    }, [options.onClick, base.model.disabled]);

    /**
     * Font Awesome size class
     */
    const faSize = FA_SIZE_MAP[base.model.size as FAIconSizeType];

    /**
     * Font Awesome transform string
     */
    const faTransform = useMemo(() => {
        const transforms: string[] = [];

        if (base.model.rotation && base.model.rotation !== '0') {
            transforms.push(`rotate-${base.model.rotation}`);
        }

        if (base.model.flip && base.model.flip !== 'none') {
            switch (base.model.flip) {
                case 'horizontal':
                    transforms.push('flip-h');
                    break;
                case 'vertical':
                    transforms.push('flip-v');
                    break;
                case 'both':
                    transforms.push('flip-h flip-v');
                    break;
            }
        }

        return transforms.length > 0 ? transforms.join(' ') : undefined;
    }, [base.model.rotation, base.model.flip]);

    /**
     * Compute inline styles
     */
    const iconStyles = useMemo((): React.CSSProperties => {
        const styles: React.CSSProperties = {};

        if (base.model.color) {
            styles.color = base.model.color;
        }

        if (isInteractive) {
            styles.cursor = 'pointer';
        } else if (base.model.disabled) {
            styles.cursor = 'not-allowed';
            styles.opacity = 0.5;
        }

        if (base.model.cursor) {
            styles.cursor = base.model.cursor;
        }

        return styles;
    }, [base.model.color, base.model.disabled, base.model.cursor, isInteractive]);

    /**
     * Compute CSS classes
     */
    const iconClasses = useMemo(() => {
        const classes = ['ark-fa-icon'];

        if (base.model.disabled) classes.push('ark-fa-icon--disabled');
        if (isInteractive) classes.push('ark-fa-icon--interactive');
        if (base.model.className) classes.push(base.model.className);

        return classes.join(' ');
    }, [base.model.disabled, base.model.className, isInteractive]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        iconDef,
        isValid,
        prefix,
        iconName,
        handleClick,
        handleFocus,
        handleBlur,
        isInteractive,
        iconClasses,
        iconStyles,
        faSize,
        faTransform,
    };
}

export default useFAIcon;
