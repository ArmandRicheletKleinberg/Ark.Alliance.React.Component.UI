/**
 * @fileoverview Toggle Component ViewModel
 * @module components/Toggles/Toggle
 * 
 * Business logic and state management for the Toggle component.
 */

import { useCallback, useMemo, useState } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import type { ToggleModel } from './Toggle.model';
import {
    defaultToggleModel,
    ToggleModelSchema,
    TOGGLE_SIZE_CONFIG,
} from './Toggle.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Toggle ViewModel options
 */
export interface UseToggleOptions extends Partial<ToggleModel> {
    /** Change handler */
    onChange?: (checked: boolean) => void;
    /** Dark mode flag for styling */
    isDark?: boolean;
}

/**
 * Toggle ViewModel return type
 */
export interface UseToggleResult extends BaseViewModelResult<ToggleModel> {
    /** Handle toggle click */
    handleToggle: () => void;
    /** Is currently hovered */
    isHovered: boolean;
    /** Set hover state */
    setIsHovered: (hovered: boolean) => void;
    /** Size configuration */
    sizeConfig: typeof TOGGLE_SIZE_CONFIG[keyof typeof TOGGLE_SIZE_CONFIG];
    /** Active color (based on checked state) */
    activeColor: string;
    /** Glow intensity (based on checked state) */
    glowIntensity: number;
    /** Computed track styles */
    trackStyles: React.CSSProperties;
    /** Computed knob styles */
    knobStyles: React.CSSProperties;
    /** Computed label styles */
    labelStyles: React.CSSProperties;
    /** Display label (onLabel/offLabel based on state, or default label) */
    displayLabel: string | undefined;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Toggle ViewModel hook
 * 
 * @example
 * ```tsx
 * const vm = useToggle({
 *   checked: isEnabled,
 *   onChange: setIsEnabled,
 *   onColor: '#10b981',
 * });
 * ```
 */
export function useToggle(options: UseToggleOptions = {}): UseToggleResult {
    const { onChange, isDark = true, ...modelData } = options;

    // Parse model options with JSON.stringify for proper dependency tracking
    const modelOptions = useMemo(() => {
        return ToggleModelSchema.parse({ ...defaultToggleModel, ...modelData });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(modelData)]);

    // Use base ViewModel
    const base = useBaseViewModel<ToggleModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'toggle',
    });

    // Local hover state
    const [isHovered, setIsHovered] = useState(false);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════════════

    const sizeConfig = TOGGLE_SIZE_CONFIG[base.model.size];
    const activeColor = base.model.checked ? base.model.onColor : base.model.offColor;
    const glowIntensity = base.model.checked ? 0.8 : 0.3;

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleToggle = useCallback(() => {
        if (base.model.disabled) return;

        const newValue = !base.model.checked;
        base.updateModel({ checked: newValue });

        base.emit('change', {
            id: base.model.id,
            checked: newValue,
        });

        onChange?.(newValue);
    }, [base, onChange]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED STYLES
    // ═══════════════════════════════════════════════════════════════════════

    const trackStyles: React.CSSProperties = useMemo(() => ({
        width: sizeConfig.width,
        height: sizeConfig.height,
        borderRadius: sizeConfig.height / 2,
        background: base.model.backgroundColor,
        border: `2px solid ${base.model.checked ? activeColor : `${base.model.offColor}60`}`,
        boxShadow: base.model.checked
            ? `0 0 ${isHovered ? '15px' : '10px'} ${activeColor}${Math.round(glowIntensity * 255).toString(16).padStart(2, '0')}, inset 0 0 8px ${activeColor}40`
            : `inset 0 2px 4px rgba(0,0,0,0.3)`,
        opacity: base.model.disabled ? 0.5 : 1,
        cursor: base.model.disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
    }), [sizeConfig, base.model, activeColor, glowIntensity, isHovered]);

    const knobStyles: React.CSSProperties = useMemo(() => ({
        width: sizeConfig.knob,
        height: sizeConfig.knob,
        borderRadius: '50%',
        position: 'absolute' as const,
        top: (sizeConfig.height - sizeConfig.knob) / 2 - 2,
        left: base.model.checked ? sizeConfig.translate : 2,
        background: base.model.checked
            ? `radial-gradient(circle at 30% 30%, ${activeColor}, ${activeColor}dd)`
            : `radial-gradient(circle at 30% 30%, #9ca3af, #6b7280)`,
        boxShadow: base.model.checked
            ? `0 0 ${isHovered ? '12px' : '8px'} ${activeColor}, 0 0 ${isHovered ? '20px' : '15px'} ${activeColor}80, inset 0 -2px 4px rgba(0,0,0,0.2)`
            : `0 2px 4px rgba(0,0,0,0.3), inset 0 -1px 2px rgba(0,0,0,0.2)`,
        border: base.model.checked ? `1px solid ${activeColor}` : '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.3s ease-out',
    }), [sizeConfig, base.model, activeColor, isHovered]);

    const labelStyles: React.CSSProperties = useMemo(() => ({
        color: base.model.checked ? activeColor : '#9ca3af',
        textShadow: base.model.checked ? `0 0 8px ${activeColor}60` : 'none',
        transition: 'all 0.2s ease',
    }), [base.model.checked, activeColor]);

    // Compute display label (onLabel/offLabel takes precedence)
    const displayLabel = useMemo(() => {
        if (base.model.checked && base.model.onLabel) {
            return base.model.onLabel;
        }
        if (!base.model.checked && base.model.offLabel) {
            return base.model.offLabel;
        }
        return base.model.label;
    }, [base.model.checked, base.model.onLabel, base.model.offLabel, base.model.label]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        handleToggle,
        isHovered,
        setIsHovered,
        sizeConfig,
        activeColor,
        glowIntensity,
        trackStyles,
        knobStyles,
        labelStyles,
        displayLabel,
    };
}

export default useToggle;
