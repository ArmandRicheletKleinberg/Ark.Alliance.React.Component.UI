/**
 * @fileoverview Action Cell ViewModel
 * @module components/Grids/DataGrid/Cell
 * 
 * Business logic hook for ActionCell component.
 */

import { useCallback, useMemo } from 'react';
import type { ActionCellModel, RowAction } from './ActionCell.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Options for useActionCell hook.
 */
export interface UseActionCellOptions<T = unknown> {
    /** Row data */
    row: T;
    /** Available actions */
    actions: RowAction<T>[];
    /** Cell model configuration */
    model?: ActionCellModel;
    /** Custom confirmation handler (optional, uses window.confirm by default) */
    onConfirm?: (message: string) => Promise<boolean>;
}

/**
 * Result of useActionCell hook.
 */
export interface UseActionCellResult<T = unknown> {
    // Computed
    visibleActions: RowAction<T>[];
    overflowActions: RowAction<T>[];
    hasOverflow: boolean;
    containerClasses: string;

    // Handlers
    handleClick: (action: RowAction<T>) => void;
    handleContainerClick: (e: React.MouseEvent) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

const defaultModel: ActionCellModel = {
    maxVisible: 4,
    showOverflow: true,
    size: 'sm',
};

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * useActionCell - ViewModel hook for ActionCell.
 * 
 * Encapsulates action cell logic including:
 * - Action filtering (visible vs overflow)
 * - Click handling with optional confirmation
 * - Container class computation
 * 
 * @param options - Hook options
 * @returns ViewModel result with computed values and handlers
 */
export function useActionCell<T = unknown>(
    options: UseActionCellOptions<T>
): UseActionCellResult<T> {
    const {
        row,
        actions,
        model = defaultModel,
        onConfirm,
    } = options;

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED
    // ═══════════════════════════════════════════════════════════════════════

    const visibleActions = useMemo(() => {
        return actions.slice(0, model.maxVisible);
    }, [actions, model.maxVisible]);

    const overflowActions = useMemo(() => {
        return model.showOverflow ? actions.slice(model.maxVisible) : [];
    }, [actions, model.maxVisible, model.showOverflow]);

    const hasOverflow = overflowActions.length > 0;

    const containerClasses = useMemo(() => {
        const classes = ['ark-action-cell'];
        classes.push(`ark-action-cell--${model.size}`);
        return classes.join(' ');
    }, [model.size]);

    // ═══════════════════════════════════════════════════════════════════════
    // HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    const handleClick = useCallback(async (action: RowAction<T>) => {
        if (action.disabled) return;

        if (action.confirmMessage) {
            let confirmed: boolean;
            if (onConfirm) {
                confirmed = await onConfirm(action.confirmMessage);
            } else {
                // eslint-disable-next-line no-restricted-globals
                confirmed = confirm(action.confirmMessage);
            }
            if (!confirmed) return;
        }

        action.onClick(row);
    }, [row, onConfirm]);

    const handleContainerClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        // Computed
        visibleActions,
        overflowActions,
        hasOverflow,
        containerClasses,

        // Handlers
        handleClick,
        handleContainerClick,
    };
}

export default useActionCell;
