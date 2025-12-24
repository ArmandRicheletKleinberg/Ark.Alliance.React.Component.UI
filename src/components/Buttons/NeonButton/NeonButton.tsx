/**
 * @fileoverview NeonButton Component
 * @module components/Buttons/NeonButton
 * 
 * Button variant with neon glow effect and premium styling.
 * Supports multiple color variants with dynamic hover states.
 */

import { useState, forwardRef, memo } from 'react';
import { type UseButtonOptions, useButton } from '../Button/Button.viewmodel';
import { VARIANT_COLORS, SIZE_CLASSES, type SizeType } from '../../../core/constants';
import './NeonButton.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * NeonButton-specific variants (subset of button variants with neon styling)
 */
export type NeonButtonVariant = 'primary' | 'success' | 'danger' | 'warning' | 'ghost';

export interface NeonButtonProps extends Omit<UseButtonOptions, 'variant'> {
    /** Button content */
    children: React.ReactNode;
    /** Neon color variant */
    variant?: NeonButtonVariant;
    /** Button size */
    size?: SizeType;
    /** Full width mode */
    fullWidth?: boolean;
    /** Optional icon (left side) */
    icon?: React.ReactNode;
    /** Dark mode (affects background gradient) */
    isDark?: boolean;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VARIANT STYLES
// ═══════════════════════════════════════════════════════════════════════════

const neonVariantStyles: Record<NeonButtonVariant, { color: string; glow: string; bg: string; lightBg: string }> = {
    primary: {
        color: VARIANT_COLORS.primary.base,
        glow: VARIANT_COLORS.primary.glow,
        bg: VARIANT_COLORS.primary.bgDark,
        lightBg: VARIANT_COLORS.primary.bgLight,
    },
    success: {
        color: VARIANT_COLORS.success.base,
        glow: VARIANT_COLORS.success.glow,
        bg: VARIANT_COLORS.success.bgDark,
        lightBg: VARIANT_COLORS.success.bgLight,
    },
    danger: {
        color: VARIANT_COLORS.danger.base,
        glow: VARIANT_COLORS.danger.glow,
        bg: VARIANT_COLORS.danger.bgDark,
        lightBg: VARIANT_COLORS.danger.bgLight,
    },
    warning: {
        color: VARIANT_COLORS.warning.base,
        glow: VARIANT_COLORS.warning.glow,
        bg: VARIANT_COLORS.warning.bgDark,
        lightBg: VARIANT_COLORS.warning.bgLight,
    },
    ghost: {
        color: VARIANT_COLORS.ghost.base,
        glow: VARIANT_COLORS.ghost.glow,
        bg: VARIANT_COLORS.ghost.bgDark,
        lightBg: VARIANT_COLORS.ghost.bgLight,
    },
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * NeonButton - Premium button with neon glow effect
 * 
 * Features:
 * - Neon text glow and border effects
 * - Theme-aware (dark/light) gradients
 * - Smooth hover and press animations
 * - Multiple color variants
 * 
 * @example
 * ```tsx
 * <NeonButton onClick={handleSubmit}>Submit</NeonButton>
 * <NeonButton variant="success" icon={<CheckIcon />}>Confirm</NeonButton>
 * <NeonButton variant="danger" fullWidth>Delete Account</NeonButton>
 * ```
 */
export const NeonButton = memo(forwardRef<HTMLButtonElement, NeonButtonProps>(
    function NeonButton(props, ref) {
        const {
            children,
            variant = 'primary',
            size = 'md',
            fullWidth = false,
            icon,
            isDark = true,
            className = '',
            onClick,
            disabled = false,
            ...buttonOptions
        } = props;

        const [isHovered, setIsHovered] = useState(false);
        const [isPressed, setIsPressed] = useState(false);

        // Use button viewmodel for state management
        const vm = useButton({
            ...buttonOptions,
            onClick,
            disabled,
            size,
            fullWidth,
        });

        const styles = neonVariantStyles[variant];

        // Theme-aware background
        const bgGradient = isDark
            ? `linear-gradient(145deg, ${styles.bg}, rgba(15, 20, 40, 0.9))`
            : `linear-gradient(145deg, ${styles.lightBg}, rgba(255, 255, 255, 0.95))`;

        // Theme-aware shadows
        const boxShadow = isHovered
            ? isDark
                ? `0 0 15px ${styles.glow}, 0 4px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)`
                : `0 0 12px ${styles.glow}, 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)`
            : isDark
                ? `0 0 8px ${styles.glow}30, 0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)`
                : `0 0 6px ${styles.glow}20, 0 1px 3px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.3)`;

        const buttonClasses = [
            'ark-neon-btn',
            SIZE_CLASSES[size],
            fullWidth && 'w-full',
            disabled && 'ark-neon-btn--disabled',
            className,
        ].filter(Boolean).join(' ');

        return (
            <button
                ref={ref}
                type={vm.model.type}
                onClick={vm.handleClick}
                onFocus={vm.handleFocus}
                onBlur={vm.handleBlur}
                onKeyDown={vm.handleKeyDown}
                disabled={disabled || vm.state.isLoading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                className={buttonClasses}
                style={{
                    background: bgGradient,
                    border: `1px solid ${isHovered ? styles.color : `${styles.color}60`}`,
                    color: styles.color,
                    textShadow: isHovered
                        ? `0 0 10px ${styles.glow}, 0 0 20px ${styles.glow}`
                        : `0 0 5px ${styles.glow}`,
                    boxShadow,
                    transform: isPressed ? 'translateY(1px)' : 'translateY(0)',
                }}
                aria-busy={vm.state.isLoading}
                aria-label={vm.model.ariaLabel}
                data-testid={vm.model.testId}
            >
                <span className="ark-neon-btn__content">
                    {icon && <span className="ark-neon-btn__icon">{icon}</span>}
                    {vm.state.isLoading ? (
                        <span className="ark-neon-btn__spinner" />
                    ) : (
                        children
                    )}
                </span>
            </button>
        );
    }
));

NeonButton.displayName = 'NeonButton';

export default NeonButton;
