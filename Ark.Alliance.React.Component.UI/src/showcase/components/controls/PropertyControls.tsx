/**
 * @fileoverview Property Control Primitives for Showcase
 * @module showcase/components/controls
 * 
 * Polished control primitives that auto-render based on PropDefinition types.
 * Premium dark theme with neon accents.
 */

import { memo, useCallback, type ChangeEvent } from 'react';
import './PropertyControls.styles.css';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface PropertyControlBaseProps {
    /** Property label */
    label: string;
    /** Property description tooltip */
    description?: string;
    /** Whether control is disabled */
    disabled?: boolean;
}

export interface PropertySliderProps extends PropertyControlBaseProps {
    /** Current value */
    value: number;
    /** Minimum value */
    min?: number;
    /** Maximum value */
    max?: number;
    /** Step increment */
    step?: number;
    /** Unit suffix (e.g., 'px', '%') */
    unit?: string;
    /** Change handler */
    onChange: (value: number) => void;
}

export interface PropertyToggleProps extends PropertyControlBaseProps {
    /** Current checked state */
    checked: boolean;
    /** Change handler */
    onChange: (checked: boolean) => void;
}

export interface PropertySelectProps extends PropertyControlBaseProps {
    /** Current value */
    value: string;
    /** Available options */
    options: string[];
    /** Change handler */
    onChange: (value: string) => void;
}

export interface PropertyInputProps extends PropertyControlBaseProps {
    /** Current value */
    value: string;
    /** Placeholder text */
    placeholder?: string;
    /** Change handler */
    onChange: (value: string) => void;
}

export interface PropertyColorProps extends PropertyControlBaseProps {
    /** Current color value */
    value: string;
    /** Change handler */
    onChange: (value: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTY SLIDER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * PropertySlider - Range input with value display and neon styling
 */
export const PropertySlider = memo(function PropertySlider({
    label,
    value,
    min = 0,
    max = 100,
    step = 1,
    unit = '',
    description,
    disabled = false,
    onChange,
}: PropertySliderProps) {
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onChange(parseFloat(e.target.value));
    }, [onChange]);

    // Calculate fill percentage for gradient track
    const fillPercent = ((value - min) / (max - min)) * 100;

    return (
        <div className="property-control property-slider" title={description}>
            <label className="property-control__label">{label}</label>
            <div className="property-slider__track-container">
                <input
                    type="range"
                    className="property-slider__input"
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    disabled={disabled}
                    onChange={handleChange}
                    style={{ '--fill-percent': `${fillPercent}%` } as React.CSSProperties}
                />
            </div>
            <span className="property-control__value">
                {Number.isInteger(step) ? value : value.toFixed(2)}{unit}
            </span>
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTY TOGGLE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * PropertyToggle - Neon-styled toggle switch for boolean values
 */
export const PropertyToggle = memo(function PropertyToggle({
    label,
    checked,
    description,
    disabled = false,
    onChange,
}: PropertyToggleProps) {
    const handleChange = useCallback(() => {
        onChange(!checked);
    }, [checked, onChange]);

    return (
        <div className="property-control property-toggle" title={description}>
            <label className="property-control__label">{label}</label>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                className={`property-toggle__switch ${checked ? 'property-toggle__switch--checked' : ''}`}
                disabled={disabled}
                onClick={handleChange}
            >
                <span className="property-toggle__knob" />
            </button>
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTY SELECT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * PropertySelect - Styled dropdown for select options
 */
export const PropertySelect = memo(function PropertySelect({
    label,
    value,
    options,
    description,
    disabled = false,
    onChange,
}: PropertySelectProps) {
    const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    }, [onChange]);

    return (
        <div className="property-control property-select" title={description}>
            <label className="property-control__label">{label}</label>
            <select
                className="property-select__input"
                value={value}
                disabled={disabled}
                onChange={handleChange}
            >
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTY INPUT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * PropertyInput - Styled text input for string values
 */
export const PropertyInput = memo(function PropertyInput({
    label,
    value,
    placeholder = '',
    description,
    disabled = false,
    onChange,
}: PropertyInputProps) {
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }, [onChange]);

    return (
        <div className="property-control property-input" title={description}>
            <label className="property-control__label">{label}</label>
            <input
                type="text"
                className="property-input__input"
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={handleChange}
            />
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTY COLOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * PropertyColor - Color picker with preview swatch
 */
export const PropertyColor = memo(function PropertyColor({
    label,
    value,
    description,
    disabled = false,
    onChange,
}: PropertyColorProps) {
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }, [onChange]);

    return (
        <div className="property-control property-color" title={description}>
            <label className="property-control__label">{label}</label>
            <div className="property-color__container">
                <span
                    className="property-color__swatch"
                    style={{ backgroundColor: value }}
                />
                <input
                    type="color"
                    className="property-color__input"
                    value={value}
                    disabled={disabled}
                    onChange={handleChange}
                />
                <span className="property-color__value">{value}</span>
            </div>
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTY UPLOAD
// ═══════════════════════════════════════════════════════════════════════════

export interface PropertyUploadProps extends PropertyControlBaseProps {
    /** Current file/image URL or data URI */
    value: string | null;
    /** Accepted file types (e.g., 'image/*') */
    accept?: string;
    /** Change handler */
    onChange: (value: string | null) => void;
}

/**
 * PropertyUpload - File upload with image preview for background images etc.
 */
export const PropertyUpload = memo(function PropertyUpload({
    label,
    value,
    accept = 'image/*',
    description,
    disabled = false,
    onChange,
}: PropertyUploadProps) {
    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            onChange(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, [onChange]);

    const handleClear = useCallback(() => {
        onChange(null);
    }, [onChange]);

    return (
        <div className="property-control property-upload" title={description}>
            <label className="property-control__label">{label}</label>
            <div className="property-upload__container">
                {value ? (
                    <div className="property-upload__preview">
                        <img src={value} alt="Preview" className="property-upload__image" />
                        <button
                            type="button"
                            className="property-upload__clear"
                            onClick={handleClear}
                            disabled={disabled}
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <label className="property-upload__dropzone">
                        <input
                            type="file"
                            accept={accept}
                            disabled={disabled}
                            onChange={handleFileChange}
                            className="property-upload__input"
                        />
                        <span className="property-upload__icon">📁</span>
                        <span className="property-upload__text">Upload</span>
                    </label>
                )}
            </div>
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default {
    PropertySlider,
    PropertyToggle,
    PropertySelect,
    PropertyInput,
    PropertyColor,
    PropertyUpload,
};
