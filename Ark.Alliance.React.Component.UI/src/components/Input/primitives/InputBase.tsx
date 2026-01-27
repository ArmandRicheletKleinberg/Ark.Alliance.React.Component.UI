/**
 * @fileoverview InputBase Primitive Component
 * @module components/Input/primitives
 * 
 * Low-level input primitive.
 * Used as the core implementation for BaseInput and other inputs.
 */

import React, { forwardRef } from 'react';
import { InputBaseModel } from './InputBase.model';
import './InputBase.scss'; // New SCSS file to be created

export interface InputBaseProps extends Partial<InputBaseModel> {
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
    style?: React.CSSProperties;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    testId?: string;
}

/**
 * InputBase - Primitive input component
 */
export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>((props, ref) => {
    const {
        // Model props
        size = 'md',
        variant = 'default',
        fullWidth = false,
        hasError = false,
        disabled = false,
        readOnly = false,
        required = false,
        type = 'text',
        value,
        placeholder,
        name,
        id,
        autoComplete,
        autoFocus,
        maxLength,
        minLength,
        pattern,

        // Event handlers
        onChange,
        onFocus,
        onBlur,
        onKeyDown,

        // Styling/Layout
        className = '',
        style,
        startAdornment,
        endAdornment,

        // A11y
        ariaLabel,

        // Test ID (extract to avoid spreading to DOM)
        testId,

        ...rest
    } = props;

    // Construct class names using utilities where possible
    const wrapperClasses = [
        'ark-input-base',
        `ark-input-base--${size}`,
        `ark-input-base--${variant}`,
        fullWidth ? 'ark-w-full' : '',
        disabled ? 'ark-disabled' : '',
        hasError ? 'ark-input-base--error' : '',
        'ark-flex',
        'ark-items-center',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={wrapperClasses} style={style}>
            {startAdornment && (
                <div className="ark-input-base__start-adornment ark-flex-center">
                    {startAdornment}
                </div>
            )}

            <input
                ref={ref}
                className="ark-input-base__input ark-w-full"
                type={type}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                placeholder={placeholder}
                name={name}
                id={id}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                maxLength={maxLength}
                minLength={minLength}
                pattern={pattern}
                aria-label={ariaLabel}
                aria-invalid={hasError}
                aria-disabled={disabled}
                data-testid={testId}
                {...rest}
            />

            {endAdornment && (
                <div className="ark-input-base__end-adornment ark-flex-center">
                    {endAdornment}
                </div>
            )}
        </div>
    );
});

InputBase.displayName = 'InputBase';
