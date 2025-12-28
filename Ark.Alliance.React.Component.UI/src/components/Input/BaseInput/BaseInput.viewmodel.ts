/**
 * @fileoverview BaseInput Component ViewModel
 * @module components/Input/BaseInput
 * 
 * Business logic and state management for the BaseInput primitive component.
 * Serves as the foundation viewmodel for all input variants.
 * Integrates with Helpers/Validators for optional format validation.
 */

import { useCallback, useMemo, useState } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { BaseInputModel, InputFormat } from './BaseInput.model';
import { defaultBaseInputModel, BaseInputModelSchema } from './BaseInput.model';
import { validateInput, InputType, type ValidationResult, type ValidationConfig } from '../../../Helpers/Validators';

// ═══════════════════════════════════════════════════════════════════════════
// FORMAT TO INPUTTYPE MAPPING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Maps InputFormat strings to InputType enum values.
 */
const FORMAT_TO_INPUTTYPE: Record<InputFormat, InputType | null> = {
    none: null,
    iban: InputType.Iban,
    isin: InputType.Isin,
    gln: InputType.Gln,
    gtin: InputType.Gtin,
    numeric: InputType.Numeric,
    text: InputType.Text,
    email: InputType.Email,
    url: InputType.Url,
    phone: InputType.Phone,
    date: InputType.Date,
    age: InputType.Age,
    fileName: InputType.FileName,
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BaseInput ViewModel options
 */
export interface UseBaseInputOptions extends Partial<BaseInputModel> {
    /** Change handler */
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Focus handler */
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    /** Blur handler */
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    /** Validation result callback */
    onValidation?: (result: ValidationResult) => void;
}

/**
 * BaseInput ViewModel return type
 */
export interface UseBaseInputResult extends BaseViewModelResult<BaseInputModel> {
    /** Current input value */
    value: string;
    /** Handle input change */
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Handle focus */
    handleFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    /** Handle blur */
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    /** Set focus state */
    setIsFocused: (focused: boolean) => void;
    /** Computed input class names */
    inputClasses: string;
    /** Manually trigger validation */
    validate: () => ValidationResult;
    /** Current validation error (if any) */
    validationError: string | undefined;
    /** Whether input has validation error */
    hasValidationError: boolean;
    /** Clear validation error */
    clearValidationError: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * BaseInput ViewModel hook
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const vm = useBaseInput({
 *   value: text,
 *   onChange: setText,
 *   size: 'md',
 *   variant: 'default',
 * });
 * 
 * // With validation
 * const vm = useBaseInput({
 *   value: email,
 *   onChange: setEmail,
 *   validationFormat: 'email',
 *   validateOnBlur: true,
 * });
 * 
 * // With IBAN validation and custom config
 * const vm = useBaseInput({
 *   value: iban,
 *   onChange: setIban,
 *   validationFormat: 'iban',
 *   validationConfig: { customErrorMessage: 'Please enter a valid IBAN' },
 * });
 * ```
 */
export function useBaseInput(options: UseBaseInputOptions): UseBaseInputResult {
    const { onChange, onFocus, onBlur, onValidation, ...modelData } = options;

    // Parse model options
    const modelOptions = useMemo(() => {
        return BaseInputModelSchema.parse({ ...defaultBaseInputModel, ...modelData });
    }, [
        modelData.value,
        modelData.size,
        modelData.variant,
        modelData.hasError,
        modelData.isFocused,
        modelData.fullWidth,
        modelData.disabled,
        modelData.validationFormat,
        modelData.validateOnBlur,
        modelData.validateOnChange,
    ]);

    // Use base ViewModel
    const base = useBaseViewModel<BaseInputModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'baseinput',
    });

    // Local focus state (can be overridden by model)
    const [localFocused, setLocalFocused] = useState(false);

    // Validation error state
    const [validationError, setValidationError] = useState<string | undefined>(
        base.model.validationError
    );

    // Use model's focus state if provided, otherwise use local state
    const isFocused = base.model.isFocused ?? localFocused;

    // ═══════════════════════════════════════════════════════════════════════
    // VALIDATION
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Perform validation based on configured format.
     */
    const validate = useCallback((): ValidationResult => {
        const format = base.model.validationFormat;

        // Skip validation if format is 'none'
        if (format === 'none') {
            return { isValid: true };
        }

        const inputType = FORMAT_TO_INPUTTYPE[format];
        if (!inputType) {
            return { isValid: true };
        }

        // Build validation config from model
        const config: ValidationConfig = {
            min: base.model.validationConfig?.min,
            max: base.model.validationConfig?.max,
            minLength: base.model.validationConfig?.minLength ?? base.model.minLength,
            maxLength: base.model.validationConfig?.maxLength ?? base.model.maxLength,
            decimals: base.model.validationConfig?.decimals,
            acceptedFileExtensions: base.model.validationConfig?.acceptedFileExtensions,
            allowSpecialChars: base.model.validationConfig?.allowSpecialChars,
            customErrorMessage: base.model.validationConfig?.customErrorMessage,
        };

        const result = validateInput(base.model.value, inputType, config);

        // Update validation error state
        if (!result.isValid) {
            setValidationError(result.errorMessage);
            base.updateModel({
                hasError: true,
                validationError: result.errorMessage
            } as Partial<BaseInputModel>);
        } else {
            setValidationError(undefined);
            base.updateModel({
                hasError: false,
                validationError: undefined
            } as Partial<BaseInputModel>);
        }

        // Call validation callback
        onValidation?.(result);

        return result;
    }, [base, onValidation]);

    /**
     * Clear validation error.
     */
    const clearValidationError = useCallback(() => {
        setValidationError(undefined);
        base.updateModel({
            hasError: false,
            validationError: undefined
        } as Partial<BaseInputModel>);
    }, [base]);

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        base.updateModel({ value: newValue } as Partial<BaseInputModel>);
        onChange?.(e);

        // Validate on change if configured
        if (base.model.validateOnChange) {
            // Use setTimeout to allow state to update first
            setTimeout(() => validate(), 0);
        }
    }, [base, onChange, validate]);

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        setLocalFocused(true);
        base.updateModel({ isFocused: true } as Partial<BaseInputModel>);
        onFocus?.(e);
    }, [base, onFocus]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        setLocalFocused(false);
        base.updateModel({ isFocused: false } as Partial<BaseInputModel>);
        onBlur?.(e);

        // Validate on blur if configured
        if (base.model.validateOnBlur) {
            validate();
        }
    }, [base, onBlur, validate]);

    const setIsFocused = useCallback((focused: boolean) => {
        setLocalFocused(focused);
        base.updateModel({ isFocused: focused } as Partial<BaseInputModel>);
    }, [base]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED STYLES
    // ═══════════════════════════════════════════════════════════════════════

    const inputClasses = useMemo(() => {
        const classes = [
            'ark-base-input',
            `ark-base-input--${base.model.size}`,
            `ark-base-input--${base.model.variant}`,
        ];

        if (base.model.hasError || validationError) classes.push('ark-base-input--error');
        if (isFocused) classes.push('ark-base-input--focused');
        if (base.model.fullWidth) classes.push('ark-base-input--full-width');
        if (base.model.disabled) classes.push('ark-base-input--disabled');
        if (base.model.readOnly) classes.push('ark-base-input--readonly');
        if (base.model.className) classes.push(base.model.className);

        return classes.join(' ');
    }, [base.model, isFocused, validationError]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        value: base.model.value,
        handleChange,
        handleFocus,
        handleBlur,
        setIsFocused,
        inputClasses,
        validate,
        validationError,
        hasValidationError: !!validationError,
        clearValidationError,
    };
}

export default useBaseInput;

