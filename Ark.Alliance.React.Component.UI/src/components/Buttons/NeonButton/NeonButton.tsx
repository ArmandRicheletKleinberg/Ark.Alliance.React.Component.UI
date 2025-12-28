/**
 * @fileoverview NeonButton Component
 * @module components/Buttons/NeonButton
 * 
 * Button variant with neon glow effect and premium styling.
 * Follows MVVM pattern with separate Model and ViewModel.
 */

import { forwardRef, memo } from 'react';
import { SIZE_CLASSES } from '../../../core/constants';
import { useNeonButton, type UseNeonButtonOptions } from './NeonButton.viewmodel';
import './NeonButton.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface NeonButtonProps extends UseNeonButtonOptions {
    /** Button content */
    children: React.ReactNode;
    /** Optional icon (left side) */
    icon?: React.ReactNode;
    /** Additional CSS class */
    className?: string;
}

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
 * - MVVM architecture
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
            icon,
            className = '',
            onClick,
            ...options
        } = props;

        // Use ViewModel
        const vm = useNeonButton({ ...options, onClick });

        const buttonClasses = [
            'ark-neon-btn',
            SIZE_CLASSES[vm.model.size],
            vm.model.fullWidth && 'w-full',
            vm.model.disabled && 'ark-neon-btn--disabled',
            className,
        ].filter(Boolean).join(' ');

        return (
            <button
                ref={ref}
                type={vm.model.type}
                onClick={onClick}
                disabled={vm.model.disabled || vm.model.loading}
                onMouseEnter={() => vm.setHovered(true)}
                onMouseLeave={() => { vm.setHovered(false); vm.setPressed(false); }}
                onMouseDown={() => vm.setPressed(true)}
                onMouseUp={() => vm.setPressed(false)}
                className={buttonClasses}
                style={{
                    background: vm.bgGradient,
                    border: `1px solid ${vm.borderColor}`,
                    color: vm.variantStyles.color,
                    textShadow: vm.textShadow,
                    boxShadow: vm.boxShadow,
                    transform: vm.transform,
                }}
                aria-busy={vm.model.loading}
                aria-label={vm.model.ariaLabel}
                data-testid={vm.model.testId}
            >
                <span className="ark-neon-btn__content">
                    {icon && <span className="ark-neon-btn__icon">{icon}</span>}
                    {vm.model.loading ? (
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
