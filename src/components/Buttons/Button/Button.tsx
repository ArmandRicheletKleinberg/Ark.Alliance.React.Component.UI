/**
 * @fileoverview Button Component
 * @module components/Buttons/Button
 * 
 * A versatile button component with multiple variants, sizes, and states.
 * Follows MVVM pattern with separated Model, ViewModel, and View layers.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Button variant="primary" onClick={() => console.log('Clicked!')}>
 *   Click Me
 * </Button>
 * 
 * // Async with loading state
 * <Button onClick={async () => await saveData()}>
 *   Save
 * </Button>
 * 
 * // With icons
 * <Button iconLeft="plus" variant="success">
 *   Add Item
 * </Button>
 * 
 * // Icon with custom color
 * <Button iconLeft="check" iconColor="#00ff88">
 *   Confirm
 * </Button>
 * ```
 */

import React, { memo, forwardRef } from 'react';
import { useButton } from './Button.viewmodel';
import type { UseButtonOptions } from './Button.viewmodel';
import { Icon } from '../../Icon';
import type { IconSizeType } from '../../Icon';
import './Button.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Button component props
 */
export interface ButtonProps extends UseButtonOptions {
    /** Button content */
    children?: React.ReactNode;

    /** Ref forwarding */
    ref?: React.Ref<HTMLButtonElement>;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER: Map button size to icon size
// ═══════════════════════════════════════════════════════════════════════════

const BUTTON_TO_ICON_SIZE: Record<string, IconSizeType> = {
    xs: 'xs',
    sm: 'sm',
    md: 'sm',
    lg: 'md',
    xl: 'lg',
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Button Component
 * 
 * A flexible button supporting multiple variants, sizes, loading states,
 * and async click handlers. Uses the MVVM pattern for clean separation
 * of concerns.
 * 
 * ## Features
 * - **Variants**: primary, secondary, ghost, outline, danger, success, link
 * - **Sizes**: xs, sm, md, lg, xl
 * - **States**: loading, disabled
 * - **Icons**: left icon, right icon, icon-only, center icon
 * - **Icon Colors**: Automatic color change based on button state
 * - **Accessibility**: Full keyboard support, ARIA attributes
 * 
 * ## Icon Positioning
 * - `iconLeft`: Icon appears before the label
 * - `iconRight`: Icon appears after the label
 * - `iconOnly`: Only icon displayed, no label (set iconLeft for the icon)
 * - `iconCenter`: Icon centered (use with iconOnly for centered icon button)
 * 
 * ## Async Support
 * Click handlers can be async - the button will automatically show
 * a loading state until the promise resolves.
 */
export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(
    function Button({ children, ...options }, ref) {
        const vm = useButton(options);

        // Determine icon size based on button size
        const iconSize = BUTTON_TO_ICON_SIZE[vm.model.size] || 'sm';

        // Compute icon color based on state
        const getIconColor = (): string | undefined => {
            // Custom color provided
            if (vm.model.iconColor) {
                // If disabled, apply opacity via CSS, keep the color
                return vm.model.disabled
                    ? vm.model.iconColorDisabled || vm.model.iconColor
                    : vm.model.iconColor;
            }
            // Default: inherit from button text color
            return undefined;
        };

        const iconColor = getIconColor();

        // ═══════════════════════════════════════════════════════════════════
        // RENDER HELPERS
        // ═══════════════════════════════════════════════════════════════════

        /**
         * Render an icon by name
         */
        const renderIcon = (iconName: string, position: 'left' | 'right' | 'center') => {
            return (
                <Icon
                    name={iconName}
                    size={iconSize}
                    color={iconColor}
                    className={`ark-btn__icon ark-btn__icon--${position}`}
                    disabled={vm.model.disabled}
                    ariaLabel={vm.model.iconOnly ? vm.model.ariaLabel : undefined}
                />
            );
        };

        /**
         * Render loading spinner
         */
        const renderSpinner = () => (
            <span className="ark-btn__spinner" aria-hidden="true">
                <Icon
                    name="loader"
                    size={iconSize}
                    spin
                    className="ark-btn__spinner-icon"
                />
            </span>
        );

        // ═══════════════════════════════════════════════════════════════════
        // RENDER
        // ═══════════════════════════════════════════════════════════════════

        return (
            <button
                ref={ref}
                type={vm.model.type}
                className={vm.buttonClasses}
                disabled={!vm.isInteractive}
                onClick={vm.handleClick}
                onFocus={vm.handleFocus}
                onBlur={vm.handleBlur}
                onKeyDown={vm.handleKeyDown}
                aria-label={vm.model.ariaLabel}
                aria-busy={vm.state.isLoading}
                aria-disabled={vm.model.disabled}
                data-testid={vm.model.testId}
                style={vm.model.style}
            >
                {/* Loading spinner */}
                {vm.state.isLoading && renderSpinner()}

                {/* Left icon */}
                {vm.model.iconLeft && !vm.state.isLoading && !vm.model.iconCenter && (
                    renderIcon(vm.model.iconLeft, 'left')
                )}

                {/* Center icon (for icon-only buttons) */}
                {vm.model.iconCenter && vm.model.iconOnly && !vm.state.isLoading && (
                    renderIcon(vm.model.iconCenter, 'center')
                )}

                {/* Content / Label */}
                {!vm.model.iconOnly && (
                    <span className="ark-btn__content">
                        {children}
                    </span>
                )}

                {/* Right icon */}
                {vm.model.iconRight && !vm.state.isLoading && (
                    renderIcon(vm.model.iconRight, 'right')
                )}
            </button>
        );
    }
));

Button.displayName = 'Button';

export default Button;
