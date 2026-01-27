/**
 * @fileoverview Editable Cell View Component
 * @module components/Grids/DataGrid/Cell
 * 
 * View layer for EditableCell - renders based on viewmodel state.
 */

import React, { memo } from 'react';
import type { EditableCellModel, ValidationRule } from './EditableCell.model';
import { useEditableCell } from './EditableCell.viewmodel';
import './Cell.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Props for the EditableCell component.
 */
export interface EditableCellProps<T = unknown> {
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

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * EditableCell - Inline editable cell view.
 * 
 * Pure view component that delegates all logic to useEditableCell viewmodel.
 * 
 * Features:
 * - Double-click to enter edit mode
 * - Built-in validation presets
 * - Format presets for display
 * - Keyboard navigation (Enter to save, Escape to cancel)
 * - Visual error states with tooltips
 * 
 * @example
 * ```tsx
 * <EditableCell
 *     model={{
 *         fieldKey: 'price',
 *         dataType: 'number',
 *         value: 123.45,
 *         validationPresets: ['required', 'positive'],
 *         formatPreset: 'currency',
 *     }}
 *     onCommit={(newValue) => updateRow('price', newValue)}
 * />
 * ```
 */
function EditableCellComponent<T>(props: EditableCellProps<T>) {
    const { model } = props;
    const vm = useEditableCell(props);

    if (model.isEditing) {
        return (
            <div className={vm.containerClasses}>
                <input
                    ref={vm.inputRef}
                    type="text"
                    className="ark-editable-cell__input"
                    value={vm.editValue}
                    onChange={vm.handleChange}
                    onKeyDown={vm.handleKeyDown}
                    onBlur={vm.handleBlur}
                    aria-invalid={!!vm.error}
                    aria-describedby={vm.error ? `error-${model.fieldKey}` : undefined}
                />
                {vm.error && (
                    <div
                        id={`error-${model.fieldKey}`}
                        className="ark-editable-cell__error"
                        role="alert"
                    >
                        {vm.error}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className={vm.containerClasses}
            onDoubleClick={vm.handleDoubleClick}
            title={model.editable ? 'Double-click to edit' : undefined}
        >
            <span className="ark-editable-cell__value">{vm.displayValue}</span>
        </div>
    );
}

export const EditableCell = memo(EditableCellComponent) as typeof EditableCellComponent;

// Type assertion for generic memo
(EditableCell as React.FC).displayName = 'EditableCell';

export default EditableCell;
