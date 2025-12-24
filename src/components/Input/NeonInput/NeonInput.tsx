/**
 * @fileoverview NeonInput Component
 * @module components/Input/NeonInput
 * 
 * Cyberpunk-styled neon glow input using BaseInput.
 */

import { forwardRef, memo, useState } from 'react';
import { BaseInput } from '../BaseInput';
import { useInput, type UseInputOptions } from '../Input.viewmodel';
import './NeonInput.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface NeonInputProps extends UseInputOptions {
    /** Glow color */
    glowColor?: 'cyan' | 'blue' | 'purple' | 'green' | 'red';
    /** Name attribute */
    name?: string;
    /** Autocomplete hint */
    autoComplete?: string;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * NeonInput - Cyberpunk-styled input with glow effects
 * 
 * @example
 * ```tsx
 * <NeonInput 
 *   label="Username" 
 *   value={username} 
 *   onChange={setUsername}
 *   glowColor="cyan"
 * />
 * ```
 */
export const NeonInput = memo(forwardRef<HTMLInputElement, NeonInputProps>(
    function NeonInput(props, ref) {
        const {
            glowColor = 'cyan',
            name,
            autoComplete,
            className = '',
            ...inputOptions
        } = props;

        const vm = useInput(inputOptions);
        const [localFocused, setLocalFocused] = useState(false);

        const handleFocus = () => {
            setLocalFocused(true);
            vm.handleFocus();
        };

        const handleBlur = () => {
            setLocalFocused(false);
            vm.handleBlur();
        };

        const wrapperClasses = [
            'ark-neon-input',
            `ark-neon-input--${glowColor}`,
            localFocused && 'ark-neon-input--focused',
            vm.hasError && 'ark-neon-input--error',
            className,
        ].filter(Boolean).join(' ');

        return (
            <div className={wrapperClasses}>
                {/* Label */}
                {vm.model.label && (
                    <label htmlFor={vm.model.id} className="ark-neon-input__label">
                        {vm.model.label}
                        {vm.model.required && <span className="ark-neon-input__required">*</span>}
                    </label>
                )}

                {/* Input using BaseInput */}
                <div className="ark-neon-input__container">
                    <BaseInput
                        ref={ref}
                        id={vm.model.id}
                        name={name}
                        type={vm.model.type}
                        value={vm.value}
                        onChange={vm.handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={vm.model.disabled}
                        placeholder={vm.model.placeholder}
                        maxLength={vm.model.maxLength}
                        required={vm.model.required}
                        autoComplete={autoComplete}
                        size={vm.model.size}
                        variant={vm.model.variant}
                        hasError={vm.hasError}
                        isFocused={localFocused}
                        fullWidth
                        aria-label={vm.model.ariaLabel || vm.model.label}
                        aria-invalid={vm.hasError}
                        data-testid={vm.model.testId}
                    />
                    <div className="ark-neon-input__glow" />
                </div>

                {/* Error message */}
                {vm.hasError && vm.model.error && (
                    <p className="ark-neon-input__error">{vm.model.error}</p>
                )}

                {/* Helper text */}
                {!vm.hasError && vm.model.helperText && (
                    <p className="ark-neon-input__helper">{vm.model.helperText}</p>
                )}
            </div>
        );
    }
));

NeonInput.displayName = 'NeonInput';

export default NeonInput;
