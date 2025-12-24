/**
 * @fileoverview BaseInput Component
 * @module components/Input/BaseInput
 * 
 * Low-level input component that provides base functionality.
 * Used by all input variants (Input, NeonInput, SearchInput, etc.)
 */

import { forwardRef, memo, type InputHTMLAttributes } from 'react';
import './BaseInput.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface BaseInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Style variant */
    variant?: 'default' | 'filled' | 'outlined' | 'underlined';
    /** Has error state */
    hasError?: boolean;
    /** Is focused */
    isFocused?: boolean;
    /** Full width mode */
    fullWidth?: boolean;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BaseInput - Foundation input component
 * 
 * This is a primitive component that provides base styles and behavior.
 * For most use cases, use the higher-level Input or NeonInput components.
 * 
 * @example
 * ```tsx
 * <BaseInput 
 *   type="text" 
 *   value={value} 
 *   onChange={e => setValue(e.target.value)} 
 *   size="md"
 *   variant="default"
 * />
 * ```
 */
export const BaseInput = memo(forwardRef<HTMLInputElement, BaseInputProps>(
    function BaseInput(props, ref) {
        const {
            size = 'md',
            variant = 'default',
            hasError = false,
            isFocused = false,
            fullWidth = false,
            className = '',
            disabled,
            ...inputProps
        } = props;

        const classes = [
            'ark-base-input',
            `ark-base-input--${size}`,
            `ark-base-input--${variant}`,
            hasError && 'ark-base-input--error',
            isFocused && 'ark-base-input--focused',
            fullWidth && 'ark-base-input--full-width',
            disabled && 'ark-base-input--disabled',
            className,
        ].filter(Boolean).join(' ');

        return (
            <input
                ref={ref}
                className={classes}
                disabled={disabled}
                {...inputProps}
            />
        );
    }
));

BaseInput.displayName = 'BaseInput';

export default BaseInput;
