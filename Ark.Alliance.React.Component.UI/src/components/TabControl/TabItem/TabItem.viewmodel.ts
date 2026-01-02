/**
 * @fileoverview TabItem Component ViewModel
 * @module components/TabControl/TabItem
 * 
 * Business logic for individual tab items.
 */

import { useCallback, useMemo } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import {
    TabItemModelSchema,
    type TabItemModel,
    defaultTabItemModel,
} from './TabItem.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TabItem ViewModel options
 */
export interface UseTabItemOptions extends Partial<TabItemModel> {
    /** Required tab key (renamed from key to avoid React conflict) */
    tabKey: string;
    /** Required tab label */
    label: string;
    /** Click handler */
    onClick?: () => void;
    /** Close handler */
    onClose?: () => void;
    /** Focus handler */
    onFocus?: () => void;
}

/**
 * TabItem ViewModel result
 */
export interface UseTabItemResult extends BaseViewModelResult<TabItemModel> {
    /** Handle click */
    handleClick: () => void;
    /** Handle close */
    handleClose: (e: React.MouseEvent) => void;
    /** Handle keydown for accessibility */
    handleKeyDown: (e: React.KeyboardEvent) => void;
    /** Whether tab is interactive */
    isInteractive: boolean;
    /** Tab item CSS classes */
    tabClasses: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TabItem ViewModel hook
 */
export function useTabItem(options: UseTabItemOptions): UseTabItemResult {
    const { onClick, onClose, onFocus, ...modelOptions } = options;

    // Parse model with defaults
    const parsedModel = useMemo(
        () => TabItemModelSchema.parse({ ...defaultTabItemModel, ...modelOptions }),
        [JSON.stringify(modelOptions)]
    );

    // Base ViewModel
    const base = useBaseViewModel<TabItemModel>(parsedModel, {});

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED
    // ═══════════════════════════════════════════════════════════════════════

    const isInteractive = useMemo(
        () => !base.model.disabled && !base.model.loading,
        [base.model.disabled, base.model.loading]
    );

    const tabClasses = useMemo(() => {
        const classes = ['ark-tab-item'];

        if (base.model.isActive) classes.push('ark-tab-item--active');
        if (base.model.disabled) classes.push('ark-tab-item--disabled');
        if (base.model.loading) classes.push('ark-tab-item--loading');
        if (base.model.closeable) classes.push('ark-tab-item--closeable');
        classes.push(`ark-tab-item--${base.model.size}`);

        if (base.model.className) classes.push(base.model.className);

        return classes.join(' ');
    }, [base.model.isActive, base.model.disabled, base.model.loading, base.model.closeable, base.model.size, base.model.className]);

    // ═══════════════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleClick = useCallback(() => {
        if (isInteractive && onClick) {
            onClick();
        }
    }, [isInteractive, onClick]);

    const handleClose = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (isInteractive && onClose) {
            onClose();
        }
    }, [isInteractive, onClose]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!isInteractive) return;

        // Keep e.key as it refers to keyboard key code
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
        }

        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (base.model.closeable && onClose) {
                e.preventDefault();
                onClose();
            }
        }
    }, [isInteractive, onClick, onClose, base.model.closeable]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        handleClick,
        handleClose,
        handleKeyDown,
        isInteractive,
        tabClasses,
    };
}

export default useTabItem;
