/**
 * @fileoverview BaseInput Component
 * @module components/Input/BaseInput
 * 
 * Low-level input component that provides base functionality.
 * Used by all input variants (Input, NeonInput, SearchInput, etc.)
 * Follows MVVM pattern with BaseInput viewmodel.
 */

import { forwardRef, memo } from 'react';
import { useBaseInput, type UseBaseInputOptions } from './BaseInput.viewmodel';
import './BaseInput.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface BaseInputProps extends UseBaseInputOptions {
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
 *   onChange={setValue} 
 *   size="md"
 *   variant="default"
 * />
 * ```
 */
export const BaseInput = memo(forwardRef<HTMLInputElement, BaseInputProps>(
    function BaseInput(props, ref) {
        const {
            className = '',
            onChange,
            onFocus,
            onBlur,
            // Extract BaseModel/UseBaseInputOptions props to avoid spreading them as HTML attributes
            value,
            size,
            variant,
            hasError,
            isFocused,
            fullWidth,
            readOnly,
            required,
            maxLength,
            minLength,
            pattern,
            autoComplete,
            autoFocus,
            ariaLabel,
            name,
            type,
            placeholder,
            testId,
            // BaseComponentModel props
            disabled,
            loading,
            clickable,
            doubleClickable,
            draggable,
            droppable,
            mouseOverEnabled,
            mouseMoveEnabled,
            mouseEnterEnabled,
            focusable,
            tooltip,
            tooltipPosition,
            tooltipDelay,
            metadata,
            ...htmlProps
        } = props;

        const vm = useBaseInput({
            value: value !== undefined ? String(value) : undefined,
            size,
            variant,
            hasError,
            isFocused,
            fullWidth,
            disabled,
            readOnly,
            required,
            maxLength,
            minLength,
            pattern,
            autoComplete,
            autoFocus,
            ariaLabel,
            name,
            type,
            placeholder,
            testId,
            onChange,
            onFocus,
            onBlur,
        });

        return (
            <input
                ref={ref}
                {...htmlProps}
                className={`${vm.inputClasses} ${className}`}
                type={vm.model.type}
                value={vm.value}
                onChange={vm.handleChange}
                onFocus={vm.handleFocus}
                onBlur={vm.handleBlur}
                disabled={vm.model.disabled}
                readOnly={vm.model.readOnly}
                required={vm.model.required}
                placeholder={vm.model.placeholder}
                maxLength={vm.model.maxLength}
                minLength={vm.model.minLength}
                pattern={vm.model.pattern}
                autoComplete={vm.model.autoComplete}
                autoFocus={vm.model.autoFocus}
                name={vm.model.name}
                aria-label={vm.model.ariaLabel}
                aria-invalid={vm.model.hasError}
                data-testid={vm.model.testId}
            />
        );
    }
));

BaseInput.displayName = 'BaseInput';

export default BaseInput;

