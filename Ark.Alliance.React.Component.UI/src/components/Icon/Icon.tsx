/**
 * @fileoverview Icon Component
 * @module components/Icon
 * 
 * A flexible SVG icon component supporting the IconRegistry pattern.
 * Features rotation, flip, spin animations, and accessibility.
 */

import React, { forwardRef, memo } from 'react';
import { useIcon, type UseIconOptions } from './Icon.viewmodel';
import './Icon.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Icon component props
 */
export interface IconProps extends UseIconOptions {
    /** Additional HTML attributes for SVG */
    svgProps?: React.SVGProps<SVGSVGElement>;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Icon component that renders SVG icons from the IconRegistry.
 * 
 * Features:
 * - Registry-based icon lookup
 * - Size variants (xs, sm, md, lg, xl, 2xl)
 * - Rotation (0, 90, 180, 270 degrees)
 * - Flip (horizontal, vertical, both)
 * - Spin animation for loading states
 * - Custom colors
 * - Full accessibility support
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Icon name="chevron-right" />
 * 
 * // With size and color
 * <Icon name="check" size="lg" color="#00ff88" />
 * 
 * // Rotated and spinning
 * <Icon name="menu" rotation="90" spin />
 * 
 * // Interactive with click handler
 * <Icon name="x" onClick={() => close()} ariaLabel="Close" />
 * ```
 */
export const Icon = memo(forwardRef<SVGSVGElement, IconProps>(
    function Icon(props, ref) {
        const { svgProps, ...iconOptions } = props;
        const vm = useIcon(iconOptions);

        // ═══════════════════════════════════════════════════════════════════
        // VALIDATION
        // ═══════════════════════════════════════════════════════════════════

        if (!vm.isValid) {
            if (typeof window !== 'undefined' && (window as unknown as { __DEV__?: boolean }).__DEV__) {
                console.warn(`[Icon] Icon "${vm.model.name}" not found in registry.`);
            }
            return null;
        }

        // ═══════════════════════════════════════════════════════════════════
        // RENDER
        // ═══════════════════════════════════════════════════════════════════

        const iconDef = vm.iconDef!;

        return (
            <svg
                ref={ref}
                xmlns="http://www.w3.org/2000/svg"
                viewBox={iconDef.viewBox || vm.model.viewBox}
                fill={vm.model.filled || iconDef.filled ? 'currentColor' : 'none'}
                stroke={vm.model.filled || iconDef.filled ? 'none' : 'currentColor'}
                strokeWidth={vm.model.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={vm.iconClasses}
                style={vm.iconStyles}
                onClick={vm.isInteractive ? vm.handleClick : undefined}
                onFocus={vm.handleFocus}
                onBlur={vm.handleBlur}
                role="img"
                aria-label={vm.model.ariaLabel || vm.model.name}
                aria-hidden={!vm.model.ariaLabel}
                data-testid={vm.model.testId}
                tabIndex={vm.isInteractive ? 0 : undefined}
                {...svgProps}
            >
                {/* Single path */}
                {iconDef.path && <path d={iconDef.path} />}

                {/* Multiple paths for complex icons */}
                {iconDef.paths?.map((pathData, index) => (
                    <path key={index} d={pathData} />
                ))}
            </svg>
        );
    }
));

Icon.displayName = 'Icon';

export default Icon;
