/**
 * @fileoverview Input Component
 * @module components/Input
 * 
 * Versatile text input with labels, icons, validation, and variants.
 */

import { forwardRef, memo } from 'react';
import { useInput, type UseInputOptions } from './Input.viewmodel';
import './Input.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface InputProps extends UseInputOptions {
    /** Input name attribute */
    name?: string;
    /** Auto-complete hint */
    autoComplete?: string;
    /** Auto-focus on mount */
    autoFocus?: boolean;
    /** Additional CSS class */
    className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input - Text input with label, validation, and icons
 * 
 * @example
 * ```tsx
 * <Input 
 *   label="Email" 
 *   type="email" 
 *   value={email} 
 *   onChange={setEmail} 
 *   required 
 * />
 * <Input 
 *   label="Password" 
 *   type="password" 
 *   error="Password is required"
 *   variant="underlined"
 * />
 * ```
 */
export const Input = memo(forwardRef<HTMLInputElement, InputProps>(
    function Input(props, ref) {
        const {
            name,
            autoComplete,
            autoFocus,
            className = '',
            ...inputOptions
        } = props;

        const vm = useInput(inputOptions);

        return (
            <div className={`${vm.wrapperClasses} ${className}`}>
                {/* Label */}
                {vm.model.label && (
                    <label
                        htmlFor={vm.model.id}
                        className="ark-input__label"
                    >
                        {vm.model.label}
                        {vm.model.required && (
                            <span className="ark-input__required">*</span>
                        )}
                    </label>
                )}

                {/* Input container */}
                <div className="ark-input__container">
                    {/* Left icon placeholder */}
                    {vm.model.iconLeft && (
                        <span className="ark-input__icon ark-input__icon--left">
                            {/* Icon would go here */}
                        </span>
                    )}

                    <input
                        ref={ref}
                        id={vm.model.id}
                        name={name}
                        type={vm.model.type}
                        value={vm.value}
                        onChange={vm.handleChange}
                        onFocus={vm.handleFocus}
                        onBlur={vm.handleBlur}
                        disabled={vm.model.disabled}
                        readOnly={vm.model.readOnly}
                        placeholder={vm.model.placeholder}
                        maxLength={vm.model.maxLength}
                        pattern={vm.model.pattern}
                        required={vm.model.required}
                        autoComplete={autoComplete}
                        autoFocus={autoFocus}
                        className={vm.inputClasses}
                        style={vm.inputStyles}
                        aria-label={vm.model.ariaLabel || vm.model.label}
                        aria-invalid={vm.hasError}
                        aria-describedby={vm.hasError ? `${vm.model.id}-error` : undefined}
                        data-testid={vm.model.testId}
                        {...vm.restrictionProps}
                    />

                    {/* Restriction indicator */}
                    {vm.hasRestrictions && vm.model.inputRestriction?.showRestrictionIndicator !== false && (
                        <span
                            className="ark-input__restriction-indicator"
                            title="Input restrictions active"
                            aria-hidden="true"
                        >
                            🔒
                        </span>
                    )}

                    {/* Right icon placeholder */}
                    {vm.model.iconRight && (
                        <span className="ark-input__icon ark-input__icon--right">
                            {/* Icon would go here */}
                        </span>
                    )}
                </div>

                {/* Restriction message */}
                {vm.restrictionMessage && (
                    <p className="ark-input__restriction-message" role="status">
                        {vm.restrictionMessage}
                    </p>
                )}

                {/* Error message */}
                {vm.hasError && vm.model.error && (
                    <p
                        id={`${vm.model.id}-error`}
                        className="ark-input__error"
                        role="alert"
                    >
                        {vm.model.error}
                    </p>
                )}

                {/* Helper text */}
                {!vm.hasError && vm.model.helperText && (
                    <p className="ark-input__helper">
                        {vm.model.helperText}
                    </p>
                )}
            </div>
        );
    }
));

Input.displayName = 'Input';

export default Input;
