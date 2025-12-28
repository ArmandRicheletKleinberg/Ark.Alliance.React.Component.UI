/**
 * @fileoverview Label Component
 * @module components/Label
 * 
 * A flexible label/text component with support for colors, fonts,
 * tooltips, icons, and form integration.
 */

import React, { memo, forwardRef } from 'react';
import { useLabel, type UseLabelOptions } from './Label.viewmodel';
import { Icon } from '../Icon';
import './Label.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Label component props
 */
export interface LabelProps extends UseLabelOptions {
    /** Children content (alternative to text prop) */
    children?: React.ReactNode;

    /** Ref forwarding */
    ref?: React.Ref<HTMLLabelElement>;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Label Component
 * 
 * A versatile label component for form fields and text display.
 * 
 * ## Features
 * - **Variants**: default, subtle, muted, primary, success, warning, error, info
 * - **Sizes**: xs, sm, md, lg, xl
 * - **Font Weights**: normal, medium, semibold, bold
 * - **Icons**: Left or right positioned icons from IconRegistry
 * - **Tooltips**: Hover tooltips with position control
 * - **Colors**: Custom text and icon colors
 * - **Typography**: Font family, line height, letter spacing, text transform
 * - **Truncation**: Ellipsis with max-width support
 * - **Accessibility**: htmlFor binding, aria attributes
 * 
 * @example
 * ```tsx
 * // Basic form label
 * <Label text="Email Address" htmlFor="email" required />
 * 
 * // With icon and tooltip
 * <Label 
 *   text="Password" 
 *   icon="lock" 
 *   tooltip="Minimum 8 characters" 
 * />
 * 
 * // Colored with custom font
 * <Label 
 *   text="Important Notice" 
 *   variant="warning" 
 *   weight="bold"
 *   icon="alert-circle"
 * />
 * 
 * // Right-side icon
 * <Label 
 *   text="External Link" 
 *   icon="arrow-right" 
 *   iconPosition="right"
 * />
 * ```
 */
export const Label = memo(forwardRef<HTMLLabelElement, LabelProps>(
    function Label({ children, text, ...options }, ref) {
        const vm = useLabel({ text: text || (children as string) || '', ...options });

        // ═══════════════════════════════════════════════════════════════════
        // RENDER HELPERS
        // ═══════════════════════════════════════════════════════════════════

        /**
         * Render icon if present
         */
        const renderIcon = () => {
            if (!vm.hasIcon || !vm.model.icon) return null;

            return (
                <Icon
                    name={vm.model.icon}
                    size={vm.iconSize}
                    color={vm.model.iconColor}
                    className="ark-label__icon"
                    disabled={vm.model.disabled}
                />
            );
        };

        /**
         * Render required indicator
         */
        const renderRequired = () => {
            if (!vm.model.required) return null;

            return (
                <span
                    className="ark-label__required"
                    aria-hidden="true"
                    title={vm.model.requiredText || 'Required field'}
                >
                    *
                </span>
            );
        };

        /**
         * Render tooltip indicator (if no native tooltip)
         */
        const renderTooltipIcon = () => {
            if (!vm.hasTooltip) return null;

            return (
                <Icon
                    name="help-circle"
                    size="xs"
                    className="ark-label__tooltip-icon"
                    ariaLabel={vm.model.tooltip}
                />
            );
        };

        // ═══════════════════════════════════════════════════════════════════
        // RENDER
        // ═══════════════════════════════════════════════════════════════════

        const isIconLeft = vm.model.iconPosition === 'left';
        const isIconRight = vm.model.iconPosition === 'right';

        return (
            <label
                ref={ref}
                htmlFor={vm.model.htmlFor}
                className={vm.labelClasses}
                style={vm.labelStyles}
                aria-label={vm.model.ariaLabel}
                data-testid={vm.model.testId}
                title={vm.model.tooltip}
                {...(vm.hasTooltip ? vm.tooltipProps : {})}
            >
                {/* Left Icon */}
                {isIconLeft && renderIcon()}

                {/* Text Content */}
                <span className="ark-label__text">
                    {children || vm.model.text}
                </span>

                {/* Required Indicator */}
                {renderRequired()}

                {/* Right Icon */}
                {isIconRight && renderIcon()}

                {/* Tooltip Icon (for complex tooltips) */}
                {vm.hasTooltip && vm.model.icon !== 'help-circle' && renderTooltipIcon()}
            </label>
        );
    }
));

Label.displayName = 'Label';

export default Label;
