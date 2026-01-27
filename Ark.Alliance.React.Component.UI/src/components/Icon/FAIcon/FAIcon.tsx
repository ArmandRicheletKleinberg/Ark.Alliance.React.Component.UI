/**
 * @fileoverview Font Awesome Icon Component
 * @module components/Icon/FAIcon
 * 
 * React component for rendering Font Awesome 6 Free icons.
 * Supports solid, regular, and brand icon styles.
 * 
 * MVVM Pattern:
 * - Model: FAIcon.model.ts
 * - ViewModel: FAIcon.viewmodel.ts
 * - View: FAIcon.tsx (this file)
 */

import { forwardRef, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFAIcon, type UseFAIconOptions } from './FAIcon.viewmodel';
import './FAIcon.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * FAIcon component props
 */
export interface FAIconProps extends UseFAIconOptions {
    /** Additional HTML attributes */
    title?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * FAIcon - Font Awesome Icon Component
 * 
 * Renders Font Awesome 6 Free icons using the official React package.
 * Supports all three free icon styles: solid, regular, and brands.
 * 
 * Features:
 * - Automatic icon resolution by name
 * - Size variants (xs to 5x)
 * - Rotation (0, 90, 180, 270 degrees)
 * - Flip (horizontal, vertical, both)
 * - Animations (spin, pulse, beat, fade, bounce, shake)
 * - Fixed width mode for alignment
 * - Custom colors
 * - Full accessibility support
 * 
 * @example
 * ```tsx
 * // Basic usage (defaults to solid style)
 * <FAIcon name="user" />
 * 
 * // With size and color
 * <FAIcon name="check" size="lg" color="#00ff88" />
 * 
 * // Regular (outlined) style
 * <FAIcon name="heart" iconStyle="regular" />
 * 
 * // Brand icons
 * <FAIcon name="github" iconStyle="brands" size="2xl" />
 * 
 * // With animations
 * <FAIcon name="spinner" spin />
 * <FAIcon name="bell" shake />
 * 
 * // Interactive with click handler
 * <FAIcon name="times" onClick={() => close()} ariaLabel="Close" />
 * ```
 */
export const FAIcon = memo(forwardRef<SVGSVGElement, FAIconProps>(
    function FAIcon(props, ref) {
        const { title, ...iconOptions } = props;
        const vm = useFAIcon(iconOptions);

        // ═══════════════════════════════════════════════════════════════════
        // VALIDATION
        // ═══════════════════════════════════════════════════════════════════

        if (!vm.isValid || !vm.iconDef) {
            if (typeof window !== 'undefined' && (window as unknown as { __DEV__?: boolean }).__DEV__) {
                console.warn(`[FAIcon] Icon "${vm.model.name}" not found in ${vm.model.iconStyle} library.`);
            }
            return null;
        }

        // ═══════════════════════════════════════════════════════════════════
        // RENDER
        // ═══════════════════════════════════════════════════════════════════

        return (
            <span
                className={vm.iconClasses}
                style={vm.iconStyles}
                onClick={vm.isInteractive ? vm.handleClick as unknown as React.MouseEventHandler : undefined}
                onFocus={vm.handleFocus as unknown as React.FocusEventHandler}
                onBlur={vm.handleBlur as unknown as React.FocusEventHandler}
                role={vm.isInteractive ? 'button' : 'img'}
                aria-label={vm.model.ariaLabel || vm.model.name}
                aria-hidden={!vm.model.ariaLabel}
                tabIndex={vm.isInteractive ? 0 : undefined}
                data-testid={vm.model.testId}
            >
                <FontAwesomeIcon
                    ref={ref}
                    icon={vm.iconDef}
                    size={vm.faSize as 'xs' | 'sm' | 'lg' | 'xl' | '2xl' | '1x' | '2x' | '3x' | '4x' | '5x' | undefined}
                    rotation={vm.model.rotation !== '0' ? parseInt(vm.model.rotation) as 90 | 180 | 270 : undefined}
                    flip={vm.model.flip !== 'none' ? vm.model.flip as 'horizontal' | 'vertical' | 'both' : undefined}
                    spin={vm.model.spin}
                    pulse={vm.model.pulse}
                    fixedWidth={vm.model.fixedWidth}
                    border={vm.model.border}
                    pull={vm.model.pull}
                    beat={vm.model.beat}
                    fade={vm.model.fade}
                    bounce={vm.model.bounce}
                    shake={vm.model.shake}
                    title={title}
                />
            </span>
        );
    }
));

FAIcon.displayName = 'FAIcon';

export default FAIcon;
