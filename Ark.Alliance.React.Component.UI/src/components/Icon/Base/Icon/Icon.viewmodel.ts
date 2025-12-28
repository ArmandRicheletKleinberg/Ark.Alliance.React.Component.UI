/**
 * @fileoverview Icon Component ViewModel
 * @module components/Icon
 * 
 * Business logic and state management for the Icon component.
 * Implements the ViewModel pattern using React hooks.
 */

import { useCallback, useMemo } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../../core/base';
import {
    defaultIconModel,
    IconModelSchema,
    ICON_SIZE_MAP,
} from './Icon.model';
import type {
    IconModel,
    IconDefinition,
    IconSizeType,
} from './Icon.model';
import { IconRegistry } from '../../icons/IconRegistry';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Icon ViewModel options
 */
export interface UseIconOptions extends Partial<Omit<IconModel, 'name'>> {
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
 * Icon ViewModel return type
 */
export interface UseIconResult extends BaseViewModelResult<IconModel> {
    /** The icon definition from registry */
    iconDef: IconDefinition | null;

    /** Whether the icon was found in registry */
    isValid: boolean;

    /** Handle click */
    handleClick: (event: React.MouseEvent<SVGSVGElement>) => void;

    /** Handle focus */
    handleFocus: (event: React.FocusEvent<SVGSVGElement>) => void;

    /** Handle blur */
    handleBlur: (event: React.FocusEvent<SVGSVGElement>) => void;

    /** Computed: is icon interactive (has onClick) */
    isInteractive: boolean;

    /** Computed CSS classes */
    iconClasses: string;

    /** Computed inline styles */
    iconStyles: React.CSSProperties;

    /** Computed transform style */
    transformStyle: string;

    /** Computed size in pixels */
    sizePixels: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Icon ViewModel hook.
 * 
 * Manages icon state, retrieves icon definition from registry,
 * and provides computed properties for styling.
 * 
 * @example
 * ```tsx
 * function MyIcon() {
 *   const vm = useIcon({
 *     name: 'chevron-right',
 *     size: 'lg',
 *     color: '#00ffff',
 *     rotation: '90',
 *   });
 *   
 *   if (!vm.isValid) return null;
 *   
 *   return (
 *     <svg
 *       className={vm.iconClasses}
 *       style={vm.iconStyles}
 *       viewBox={vm.iconDef?.viewBox || vm.model.viewBox}
 *     >
 *       <path d={vm.iconDef.path} />
 *     </svg>
 *   );
 * }
 * ```
 */
export function useIcon(options: UseIconOptions): UseIconResult {
    // Parse model options with JSON.stringify for proper dependency tracking
    const modelOptions = useMemo(() => {
        const { onClick, onFocus, onBlur, ...modelData } = options;
        return IconModelSchema.parse({ ...defaultIconModel, ...modelData });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(options)]);

    // Use base ViewModel
    const base = useBaseViewModel<IconModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'icon',
    });

    // ═══════════════════════════════════════════════════════════════════════
    // ICON RESOLUTION
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Get icon definition from registry
     */
    const iconDef = useMemo((): IconDefinition | null => {
        return IconRegistry.get(base.model.name) || null;
    }, [base.model.name]);

    const isValid = iconDef !== null;

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Handle click
     */
    const handleClick = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
        if (base.model.disabled) {
            event.preventDefault();
            return;
        }

        base.emit('click', {
            id: base.model.id,
            name: base.model.name,
        });

        options.onClick?.(event);
    }, [base, options.onClick]);

    /**
     * Handle focus
     */
    const handleFocus = useCallback((event: React.FocusEvent<SVGSVGElement>) => {
        base.emit('focus', { id: base.model.id, name: base.model.name });
        options.onFocus?.(event);
    }, [base, options.onFocus]);

    /**
     * Handle blur
     */
    const handleBlur = useCallback((event: React.FocusEvent<SVGSVGElement>) => {
        base.emit('blur', { id: base.model.id, name: base.model.name });
        options.onBlur?.(event);
    }, [base, options.onBlur]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED PROPERTIES
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Is the icon interactive?
     */
    const isInteractive = useMemo(() => {
        return !!options.onClick && !base.model.disabled;
    }, [options.onClick, base.model.disabled]);

    /**
     * Compute transform style
     */
    const transformStyle = useMemo(() => {
        const transforms: string[] = [];

        // Rotation
        const rotation = base.model.rotation;
        if (rotation && rotation !== '0') {
            transforms.push(`rotate(${rotation}deg)`);
        }

        // Flip
        const flip = base.model.flip;
        if (flip && flip !== 'none') {
            switch (flip) {
                case 'horizontal':
                    transforms.push('scaleX(-1)');
                    break;
                case 'vertical':
                    transforms.push('scaleY(-1)');
                    break;
                case 'both':
                    transforms.push('scale(-1)');
                    break;
            }
        }

        return transforms.join(' ');
    }, [base.model.rotation, base.model.flip]);

    /**
     * Size in pixels
     */
    const sizePixels = useMemo(() => {
        return ICON_SIZE_MAP[base.model.size as IconSizeType] || 20;
    }, [base.model.size]);

    /**
     * Compute inline styles
     */
    const iconStyles = useMemo((): React.CSSProperties => {
        const styles: React.CSSProperties = {
            width: sizePixels,
            height: sizePixels,
        };

        if (base.model.color) {
            styles.color = base.model.color;
        }

        if (transformStyle) {
            styles.transform = transformStyle;
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
    }, [base.model, sizePixels, transformStyle, isInteractive]);

    /**
     * Compute CSS classes
     */
    const iconClasses = useMemo(() => {
        const classes = [
            'ark-icon',
            `ark-icon--${base.model.size}`,
        ];

        if (base.model.spin) classes.push('ark-icon--spin');
        if (base.model.filled) classes.push('ark-icon--filled');
        if (base.model.disabled) classes.push('ark-icon--disabled');
        if (isInteractive) classes.push('ark-icon--interactive');
        if (base.model.className) classes.push(base.model.className);

        return classes.join(' ');
    }, [base.model, isInteractive]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        iconDef,
        isValid,
        handleClick,
        handleFocus,
        handleBlur,
        isInteractive,
        iconClasses,
        iconStyles,
        transformStyle,
        sizePixels,
    };
}

export default useIcon;
