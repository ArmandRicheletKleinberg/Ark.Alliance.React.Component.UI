/**
 * @fileoverview Tooltip Component ViewModel
 * @module components/Tooltip
 * 
 * Business logic and state management for the Tooltip component.
 */

import { useCallback, useRef, useEffect } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../core/base';
import type { TooltipModel, TooltipPositionType } from './Tooltip.model';
import { defaultTooltipModel, TooltipModelSchema } from './Tooltip.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tooltip ViewModel options
 */
export interface UseTooltipOptions extends Partial<TooltipModel> {
}

/**
 * Tooltip ViewModel return type
 */
export interface UseTooltipResult extends BaseViewModelResult<TooltipModel> {
    /** Show tooltip */
    showTooltip: (triggerRect: DOMRect) => void;
    /** Hide tooltip */
    hideTooltip: () => void;
    /** Trigger ref */
    triggerRef: React.RefObject<HTMLDivElement | null>;
    /** Tooltip ref */
    tooltipRef: React.RefObject<HTMLDivElement | null>;
    /** Whether content exists and should show */
    shouldShow: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tooltip ViewModel hook
 * 
 * @example
 * ```tsx
 * const vm = useTooltip({
 *   content: 'Click to save',
 *   position: 'top',
 *   delay: 300,
 * });
 * ```
 */
export function useTooltip(options: UseTooltipOptions = {}): UseTooltipResult {
    // Parse model options
    const modelOptions = TooltipModelSchema.parse({ ...defaultTooltipModel, ...options });

    // Use base ViewModel
    const base = useBaseViewModel<TooltipModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'tooltip',
    });

    // Refs
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Whether tooltip should show (has content and not disabled)
    const shouldShow = !!base.model.content && !base.model.disabled;

    // ═══════════════════════════════════════════════════════════════════════
    // POSITION CALCULATION
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Calculate tooltip position based on trigger element rect
     */
    const calculatePosition = useCallback((rect: DOMRect, pos: TooltipPositionType) => {
        const offset = 8; // Distance from trigger
        switch (pos) {
            case 'top':
                return { x: rect.left + rect.width / 2, y: rect.top - offset };
            case 'bottom':
                return { x: rect.left + rect.width / 2, y: rect.bottom + offset };
            case 'left':
                return { x: rect.left - offset, y: rect.top + rect.height / 2 };
            case 'right':
                return { x: rect.right + offset, y: rect.top + rect.height / 2 };
            default:
                return { x: rect.left + rect.width / 2, y: rect.top - offset };
        }
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const showTooltip = useCallback((triggerRect: DOMRect) => {
        if (!shouldShow) return;

        timeoutRef.current = setTimeout(() => {
            const coords = calculatePosition(triggerRect, base.model.position);
            base.updateModel({
                isVisible: true,
                coords,
            } as Partial<TooltipModel>);
        }, base.model.delay);
    }, [shouldShow, calculatePosition, base]);

    const hideTooltip = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        base.updateModel({ isVisible: false } as Partial<TooltipModel>);
    }, [base]);

    // ═══════════════════════════════════════════════════════════════════════
    // CLEANUP
    // ═══════════════════════════════════════════════════════════════════════

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        showTooltip,
        hideTooltip,
        triggerRef,
        tooltipRef,
        shouldShow,
    };
}

export default useTooltip;
