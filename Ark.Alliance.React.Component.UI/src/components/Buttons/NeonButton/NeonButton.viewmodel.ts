/**
 * @fileoverview NeonButton ViewModel
 * @module components/Buttons/NeonButton
 * 
 * Business logic and state management for NeonButton component.
 */

import { useState, useMemo } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import { VARIANT_COLORS } from '../../../core/constants';
import { type NeonButtonModel, NeonButtonModelSchema, defaultNeonButtonModel, type NeonButtonVariantType } from './NeonButton.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * NeonButton ViewModel options
 */
export interface UseNeonButtonOptions extends Partial<NeonButtonModel> {
    /** Click handler */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Hover and press state
 */
interface InteractionState {
    isHovered: boolean;
    isPressed: boolean;
}

/**
 * NeonButton ViewModel return type
 */
export interface UseNeonButtonResult extends BaseViewModelResult<NeonButtonModel> {
    /** Interaction state */
    interactionState: InteractionState;
    /** Set hover state */
    setHovered: (hovered: boolean) => void;
    /** Set pressed state */
    setPressed: (pressed: boolean) => void;
    /** Variant style configuration */
    variantStyles: {
        color: string;
        glow: string;
        bg: string;
        lightBg: string;
    };
    /** Computed background gradient */
    bgGradient: string;
    /** Computed box shadow */
    boxShadow: string;
    /** Computed border color */
    borderColor: string;
    /** Computed text shadow */
    textShadow: string;
    /** Computed transform */
    transform: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VARIANT STYLES
// ═══════════════════════════════════════════════════════════════════════════

const neonVariantStyles: Record<NeonButtonVariantType, { color: string; glow: string; bg: string; lightBg: string }> = {
    primary: {
        color: VARIANT_COLORS.primary.base,
        glow: VARIANT_COLORS.primary.glow,
        bg: VARIANT_COLORS.primary.bgDark,
        lightBg: VARIANT_COLORS.primary.bgLight,
    },
    success: {
        color: VARIANT_COLORS.success.base,
        glow: VARIANT_COLORS.success.glow,
        bg: VARIANT_COLORS.success.bgDark,
        lightBg: VARIANT_COLORS.success.bgLight,
    },
    danger: {
        color: VARIANT_COLORS.danger.base,
        glow: VARIANT_COLORS.danger.glow,
        bg: VARIANT_COLORS.danger.bgDark,
        lightBg: VARIANT_COLORS.danger.bgLight,
    },
    warning: {
        color: VARIANT_COLORS.warning.base,
        glow: VARIANT_COLORS.warning.glow,
        bg: VARIANT_COLORS.warning.bgDark,
        lightBg: VARIANT_COLORS.warning.bgLight,
    },
    ghost: {
        color: VARIANT_COLORS.ghost.base,
        glow: VARIANT_COLORS.ghost.glow,
        bg: VARIANT_COLORS.ghost.bgDark,
        lightBg: VARIANT_COLORS.ghost.bgLight,
    },
};

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * NeonButton ViewModel hook
 * 
 * Manages state and computed styles for neon button.
 */
export function useNeonButton(options: UseNeonButtonOptions): UseNeonButtonResult {
    const { onClick, ...modelData } = options;

    // Parse model options with JSON.stringify for proper dependency tracking
    const modelOptions = useMemo(() => {
        return NeonButtonModelSchema.parse({ ...defaultNeonButtonModel, ...modelData });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(modelData)]);

    // Use base ViewModel
    const base = useBaseViewModel<NeonButtonModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'neonbutton',
    });

    // Interaction state
    const [interactionState, setInteractionState] = useState<InteractionState>({
        isHovered: false,
        isPressed: false,
    });

    const setHovered = (hovered: boolean) => {
        setInteractionState(prev => ({ ...prev, isHovered: hovered }));
    };

    const setPressed = (pressed: boolean) => {
        setInteractionState(prev => ({ ...prev, isPressed: pressed }));
    };

    // Variant styles
    const variantStyles = useMemo(() => {
        return neonVariantStyles[base.model.variant];
    }, [base.model.variant]);

    // Computed styles
    const bgGradient = useMemo(() => {
        return base.model.isDark
            ? `linear-gradient(145deg, ${variantStyles.bg}, rgba(15, 20, 40, 0.9))`
            : `linear-gradient(145deg, ${variantStyles.lightBg}, rgba(255, 255, 255, 0.95))`;
    }, [base.model.isDark, variantStyles]);

    const boxShadow = useMemo(() => {
        if (interactionState.isHovered) {
            return base.model.isDark
                ? `0 0 15px ${variantStyles.glow}, 0 4px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)`
                : `0 0 12px ${variantStyles.glow}, 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)`;
        }
        return base.model.isDark
            ? `0 0 8px ${variantStyles.glow}30, 0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)`
            : `0 0 6px ${variantStyles.glow}20, 0 1px 3px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.3)`;
    }, [interactionState.isHovered, base.model.isDark, variantStyles]);

    const borderColor = useMemo(() => {
        return interactionState.isHovered
            ? variantStyles.color
            : `${variantStyles.color}60`;
    }, [interactionState.isHovered, variantStyles.color]);

    const textShadow = useMemo(() => {
        return interactionState.isHovered
            ? `0 0 10px ${variantStyles.glow}, 0 0 20px ${variantStyles.glow}`
            : `0 0 5px ${variantStyles.glow}`;
    }, [interactionState.isHovered, variantStyles.glow]);

    const transform = useMemo(() => {
        return interactionState.isPressed ? 'translateY(1px)' : 'translateY(0)';
    }, [interactionState.isPressed]);

    return {
        ...base,
        interactionState,
        setHovered,
        setPressed,
        variantStyles,
        bgGradient,
        boxShadow,
        borderColor,
        textShadow,
        transform,
    };
}

export default useNeonButton;
