/**
 * @fileoverview NeonToggle Component
 * @module components/Toggles/NeonToggle
 * 
 * Premium toggle switch with neon glow effect.
 * Features customizable on/off colors and smooth animations.
 */

import { forwardRef, memo } from 'react';
import { useToggle, type UseToggleOptions } from '../Toggle.viewmodel';
import './NeonToggle.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface NeonToggleProps extends UseToggleOptions {
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * NeonToggle - Premium toggle switch with neon glow effect
 * 
 * Features:
 * - Customizable on/off colors
 * - Neon glow effect when enabled
 * - Dark/light mode support
 * - Smooth animations
 * - Accessible (ARIA role=switch)
 * 
 * @example
 * ```tsx
 * <NeonToggle checked={isEnabled} onChange={setIsEnabled} />
 * <NeonToggle 
 *   checked={value} 
 *   onColor="#10b981" 
 *   offColor="#6b7280" 
 *   label="Auto-save"
 * />
 * ```
 */
export const NeonToggle = memo(forwardRef<HTMLButtonElement, NeonToggleProps>(
    function NeonToggle(props, ref) {
        const { className = '', ...toggleOptions } = props;

        const vm = useToggle(toggleOptions);

        return (
            <div className={`ark-neon-toggle ${className}`}>
                {/* Label on left if specified */}
                {vm.displayLabel && vm.model.labelPosition === 'left' && (
                    <span
                        className="ark-neon-toggle__label"
                        style={vm.labelStyles}
                    >
                        {vm.displayLabel}
                    </span>
                )}

                <button
                    ref={ref}
                    type="button"
                    role="switch"
                    aria-checked={vm.model.checked}
                    aria-label={vm.model.ariaLabel || vm.model.label}
                    disabled={vm.model.disabled}
                    onClick={vm.handleToggle}
                    onMouseEnter={() => vm.setIsHovered(true)}
                    onMouseLeave={() => vm.setIsHovered(false)}
                    className="ark-neon-toggle__track"
                    style={vm.trackStyles}
                    data-testid={vm.model.testId}
                >
                    {/* Track glow for ON state */}
                    {vm.model.checked && (
                        <div
                            className="ark-neon-toggle__glow"
                            style={{
                                background: `linear-gradient(90deg, transparent 30%, ${vm.activeColor}20 50%, ${vm.activeColor}40 70%, transparent 100%)`,
                                borderRadius: vm.sizeConfig.height / 2,
                            }}
                        />
                    )}

                    {/* Knob */}
                    <div
                        className="ark-neon-toggle__knob"
                        style={vm.knobStyles}
                    />
                </button>

                {/* Label on right if specified */}
                {vm.displayLabel && vm.model.labelPosition === 'right' && (
                    <span
                        className="ark-neon-toggle__label"
                        style={vm.labelStyles}
                    >
                        {vm.displayLabel}
                    </span>
                )}
            </div>
        );
    }
));

NeonToggle.displayName = 'NeonToggle';

export default NeonToggle;
