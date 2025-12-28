/**
 * @fileoverview Button Component ViewModel
 * @module components/Buttons/Button
 * 
 * Business logic and state management for the Button component.
 * Implements the ViewModel pattern using React hooks.
 */

import { useCallback, useMemo } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { ButtonModel } from './Button.model';
import {
    defaultButtonModel,
    ButtonModelSchema
} from './Button.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Button ViewModel options
 */
export interface UseButtonOptions extends Partial<ButtonModel> {
    /** Click handler - supports async operations */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;

    /** Called when button is focused */
    onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;

    /** Called when button loses focus */
    onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;

    /** Keyboard event handler */
    onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

/**
 * Button ViewModel return type
 */
export interface UseButtonResult extends BaseViewModelResult<ButtonModel> {
    /** Handle click with loading state management */
    handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;

    /** Handle focus */
    handleFocus: (event: React.FocusEvent<HTMLButtonElement>) => void;

    /** Handle blur */
    handleBlur: (event: React.FocusEvent<HTMLButtonElement>) => void;

    /** Handle keyboard events */
    handleKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;

    /** Computed: is button interactive */
    isInteractive: boolean;

    /** Computed CSS classes */
    buttonClasses: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Button ViewModel hook.
 * 
 * Manages button state, handles async click operations with automatic
 * loading state, and provides computed properties for styling.
 * 
 * @example
 * ```tsx
 * function MyButton() {
 *   const vm = useButton({
 *     variant: 'primary',
 *     onClick: async () => {
 *       await saveData();
 *     },
 *   });
 *   
 *   return (
 *     <button
 *       className={vm.buttonClasses}
 *       onClick={vm.handleClick}
 *       disabled={!vm.isInteractive}
 *     >
 *       {vm.state.isLoading ? 'Saving...' : 'Save'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useButton(options: UseButtonOptions = {}): UseButtonResult {
    // Parse model options with JSON.stringify for proper dependency tracking
    const modelOptions = useMemo(() => {
        const { onClick, onFocus, onBlur, onKeyDown, ...modelData } = options;
        return ButtonModelSchema.parse({ ...defaultButtonModel, ...modelData });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(options)]);

    // Use base ViewModel
    const base = useBaseViewModel<ButtonModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'button',
    });

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Handle click with async support and loading state
     */
    const handleClick = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (base.model.disabled || base.state.isLoading) {
            event.preventDefault();
            return;
        }

        // Emit event
        base.emit('click', {
            id: base.model.id,
            variant: base.model.variant,
        });

        // Call handler
        if (options.onClick) {
            const result = options.onClick(event);

            // Handle async onClick
            if (result instanceof Promise) {
                await base.executeAsync(() => result);
            }
        }
    }, [base, options.onClick]);

    /**
     * Handle focus
     */
    const handleFocus = useCallback((event: React.FocusEvent<HTMLButtonElement>) => {
        base.emit('focus', { id: base.model.id });
        options.onFocus?.(event);
    }, [base, options.onFocus]);

    /**
     * Handle blur
     */
    const handleBlur = useCallback((event: React.FocusEvent<HTMLButtonElement>) => {
        base.emit('blur', { id: base.model.id });
        options.onBlur?.(event);
    }, [base, options.onBlur]);

    /**
     * Handle keyboard events (Enter/Space for activation)
     */
    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            base.emit('keyActivate', { id: base.model.id, key: event.key });
        }
        options.onKeyDown?.(event);
    }, [base, options.onKeyDown]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED PROPERTIES
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Is the button currently interactive?
     */
    const isInteractive = useMemo(() => {
        return !base.model.disabled && !base.state.isLoading;
    }, [base.model.disabled, base.state.isLoading]);

    /**
     * Compute CSS classes based on model
     */
    const buttonClasses = useMemo(() => {
        const classes = [
            'ark-btn',
            `ark-btn--${base.model.variant}`,
            `ark-btn--${base.model.size}`,
        ];

        if (base.model.fullWidth) classes.push('ark-btn--full-width');
        if (base.model.pill) classes.push('ark-btn--pill');
        if (base.model.iconOnly) classes.push('ark-btn--icon-only');
        if (base.model.disabled) classes.push('ark-btn--disabled');
        if (base.state.isLoading) classes.push('ark-btn--loading');
        if (base.model.className) classes.push(base.model.className);

        return classes.join(' ');
    }, [base.model, base.state.isLoading]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        handleClick,
        handleFocus,
        handleBlur,
        handleKeyDown,
        isInteractive,
        buttonClasses,
    };
}

export default useButton;
