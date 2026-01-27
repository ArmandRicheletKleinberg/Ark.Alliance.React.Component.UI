/**
 * @fileoverview Action Cell View Component
 * @module components/Grids/DataGrid/Cell
 * 
 * View layer for ActionCell - renders action buttons based on viewmodel state.
 */

import React, { memo } from 'react';
import type { ActionCellModel, RowAction } from './ActionCell.model';
import { useActionCell } from './ActionCell.viewmodel';
import { FAIcon } from '../../../Icon';
import './Cell.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Props for the ActionCell component.
 */
export interface ActionCellProps<T = unknown> {
    /** Row data */
    row: T;
    /** Available actions */
    actions: RowAction<T>[];
    /** Cell model configuration */
    model?: ActionCellModel;
    /** Custom confirmation handler */
    onConfirm?: (message: string) => Promise<boolean>;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ActionCell - Row action buttons cell view.
 * 
 * Pure view component that delegates all logic to useActionCell viewmodel.
 * 
 * Features:
 * - Configurable action buttons with FAIcon icons
 * - Variant-based styling (view, edit, delete)
 * - Optional confirmation dialogs
 * - Overflow menu for additional actions
 * 
 * @example
 * ```tsx
 * <ActionCell
 *     row={orderData}
 *     actions={[
 *         { key: 'view', label: 'View', icon: 'eye', variant: 'view', onClick: handleView },
 *         { key: 'edit', label: 'Edit', icon: 'pen', variant: 'edit', onClick: handleEdit },
 *     ]}
 * />
 * ```
 */
function ActionCellComponent<T>(props: ActionCellProps<T>) {
    const vm = useActionCell(props);

    return (
        <div className={vm.containerClasses} onClick={vm.handleContainerClick}>
            {vm.visibleActions.map((action) => (
                <button
                    key={action.key}
                    type="button"
                    className={`ark-action-cell__btn ark-action-cell__btn--${action.variant || 'default'}`}
                    onClick={() => vm.handleClick(action)}
                    disabled={action.disabled}
                    title={action.label}
                    aria-label={action.label}
                >
                    <FAIcon name={action.icon} size="xs" />
                </button>
            ))}

            {/* TODO: Overflow menu for hasOverflow case */}
        </div>
    );
}

export const ActionCell = memo(ActionCellComponent) as typeof ActionCellComponent;

// Type assertion for generic memo
(ActionCell as React.FC).displayName = 'ActionCell';

export default ActionCell;
