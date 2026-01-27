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
// Styles are imported via core/styles/main.scss
import { InputBase } from '../primitives/InputBase';

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
            <InputBase
                ref={ref}
                className={className}
                // Model pass-through
                size={vm.model.size}
                variant={vm.model.variant}
                fullWidth={vm.model.fullWidth}
                hasError={vm.model.hasError}
                value={vm.value}
                type={vm.model.type}
                placeholder={vm.model.placeholder}
                disabled={vm.model.disabled}
                readOnly={vm.model.readOnly}
                required={vm.model.required}
                maxLength={vm.model.maxLength}
                minLength={vm.model.minLength}
                pattern={vm.model.pattern}
                autoFocus={vm.model.autoFocus}
                autoComplete={vm.model.autoComplete}
                name={vm.model.name}
                id={vm.model.id}
                ariaLabel={vm.model.ariaLabel}
                testId={vm.model.testId}

                // Event Handlers
                onChange={vm.handleChange}
                onFocus={vm.handleFocus}
                onBlur={vm.handleBlur}

                // Pass rest of html props if needed (InputBase handles this via ...rest)
                {...htmlProps}
            />
        );
    }
));

BaseInput.displayName = 'BaseInput';

export default BaseInput;

