/**
 * @fileoverview Editable Cell ViewModel
 * @module components/Grids/DataGrid/Cell
 * 
 * Business logic hook for EditableCell component.
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type {
    EditableCellModel,
    ValidationPreset,
    ValidationResult,
    ValidationRule,
    FormatPreset,
    FormatOptions,
} from './EditableCell.model';

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validation preset implementations.
 */
const VALIDATION_PRESETS: Record<ValidationPreset, (value: unknown) => ValidationResult> = {
    required: (value) => ({
        valid: value !== null && value !== undefined && value !== '',
        message: 'This field is required',
    }),
    email: (value) => ({
        valid: typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Invalid email address',
    }),
    url: (value) => ({
        valid: typeof value === 'string' && /^https?:\/\/.+/.test(value),
        message: 'Invalid URL',
    }),
    number: (value) => ({
        valid: !isNaN(Number(value)),
        message: 'Must be a number',
    }),
    integer: (value) => ({
        valid: Number.isInteger(Number(value)),
        message: 'Must be a whole number',
    }),
    positive: (value) => ({
        valid: Number(value) > 0,
        message: 'Must be a positive number',
    }),
    percentage: (value) => {
        const num = Number(value);
        return {
            valid: !isNaN(num) && num >= 0 && num <= 100,
            message: 'Must be between 0 and 100',
        };
    },
    date: (value) => ({
        valid: !isNaN(Date.parse(String(value))),
        message: 'Invalid date',
    }),
    phone: (value) => ({
        valid: typeof value === 'string' && /^[\d\s\-+()]+$/.test(value),
        message: 'Invalid phone number',
    }),
};

// ═══════════════════════════════════════════════════════════════════════════
// FORMAT IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Apply format preset to a value.
 */
function applyFormat(value: unknown, preset: FormatPreset, options: FormatOptions = {}): string {
    if (value === null || value === undefined) return '';

    const locale = options.locale ?? 'en-US';
    const decimals = options.decimals ?? 2;

    switch (preset) {
        case 'currency':
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: options.currency ?? 'USD',
                minimumFractionDigits: decimals,
            }).format(Number(value));

        case 'percent':
            return new Intl.NumberFormat(locale, {
                style: 'percent',
                minimumFractionDigits: decimals,
            }).format(Number(value) / 100);

        case 'number':
            return new Intl.NumberFormat(locale, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            }).format(Number(value));

        case 'date':
            return new Date(String(value)).toLocaleDateString(locale);

        case 'datetime':
            return new Date(String(value)).toLocaleString(locale);

        case 'time':
            return new Date(String(value)).toLocaleTimeString(locale);

        case 'boolean':
            return value ? '✓' : '✗';

        default:
            return String(value);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Options for useEditableCell hook.
 */
export interface UseEditableCellOptions<T = unknown> {
    /** Cell model configuration */
    model: EditableCellModel;
    /** Row data (for context in validation) */
    row?: T;
    /** Custom validation rules */
    customValidators?: ValidationRule<T>[];
    /** Callback when edit starts */
    onEditStart?: () => void;
    /** Callback when edit is committed */
    onCommit?: (value: unknown) => void;
    /** Callback when edit is cancelled */
    onCancel?: () => void;
}

/**
 * Result of useEditableCell hook.
 */
export interface UseEditableCellResult {
    // State
    editValue: string;
    error: string | null;
    inputRef: React.RefObject<HTMLInputElement | null>;

    // Computed
    displayValue: string;
    containerClasses: string;

    // Handlers
    handleDoubleClick: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    handleBlur: () => void;
    handleCommit: () => void;

    // Validation
    validate: (val: unknown) => ValidationResult;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * useEditableCell - ViewModel hook for EditableCell.
 * 
 * Encapsulates all editable cell logic including:
 * - Edit mode state management
 * - Value validation with presets
 * - Value formatting for display
 * - Type conversion on commit
 * 
 * @param options - Hook options
 * @returns ViewModel result with state, computed values, and handlers
 */
export function useEditableCell<T = unknown>(
    options: UseEditableCellOptions<T>
): UseEditableCellResult {
    const {
        model,
        row,
        customValidators = [],
        onEditStart,
        onCommit,
        onCancel,
    } = options;

    // ═══════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════

    const [editValue, setEditValue] = useState<string>(String(model.value ?? ''));
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when entering edit mode
    useEffect(() => {
        if (model.isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [model.isEditing]);

    // Sync edit value when external value changes
    useEffect(() => {
        if (!model.isEditing) {
            setEditValue(String(model.value ?? ''));
            setError(null);
        }
    }, [model.value, model.isEditing]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED
    // ═══════════════════════════════════════════════════════════════════════

    const displayValue = useMemo(() => {
        if (model.value === null || model.value === undefined) {
            return model.placeholder;
        }
        if (model.formatPreset) {
            return applyFormat(model.value, model.formatPreset, model.formatOptions);
        }
        return String(model.value);
    }, [model.value, model.formatPreset, model.formatOptions, model.placeholder]);

    const containerClasses = useMemo(() => {
        const classes = ['ark-editable-cell'];
        if (model.isEditing) classes.push('ark-editable-cell--editing');
        if (error) classes.push('ark-editable-cell--error');
        return classes.join(' ');
    }, [model.isEditing, error]);

    // ═══════════════════════════════════════════════════════════════════════
    // VALIDATION
    // ═══════════════════════════════════════════════════════════════════════

    const validate = useCallback((val: unknown): ValidationResult => {
        // Apply preset validators
        for (const preset of model.validationPresets) {
            const validator = VALIDATION_PRESETS[preset];
            if (validator) {
                const result = validator(val);
                if (!result.valid) return result;
            }
        }

        // Apply custom validators
        for (const rule of customValidators) {
            if (!rule.validate(val, row)) {
                return { valid: false, message: rule.message };
            }
        }

        return { valid: true };
    }, [model.validationPresets, customValidators, row]);

    // ═══════════════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleDoubleClick = useCallback(() => {
        if (model.editable) {
            onEditStart?.();
        }
    }, [model.editable, onEditStart]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value);
        setError(null);
    }, []);

    const handleCommit = useCallback(() => {
        const result = validate(editValue);
        if (!result.valid) {
            setError(result.message ?? 'Validation failed');
            return;
        }

        // Convert to appropriate type
        let typedValue: unknown = editValue;
        if (model.dataType === 'number' || model.dataType === 'int' || model.dataType === 'decimal') {
            typedValue = Number(editValue);
        } else if (model.dataType === 'boolean') {
            typedValue = editValue.toLowerCase() === 'true' || editValue === '1';
        }

        onCommit?.(typedValue);
    }, [editValue, validate, model.dataType, onCommit]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommit();
        } else if (e.key === 'Escape') {
            setEditValue(String(model.value ?? ''));
            setError(null);
            onCancel?.();
        }
    }, [handleCommit, model.value, onCancel]);

    const handleBlur = useCallback(() => {
        handleCommit();
    }, [handleCommit]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        // State
        editValue,
        error,
        inputRef,

        // Computed
        displayValue,
        containerClasses,

        // Handlers
        handleDoubleClick,
        handleChange,
        handleKeyDown,
        handleBlur,
        handleCommit,

        // Validation
        validate,
    };
}

export default useEditableCell;
