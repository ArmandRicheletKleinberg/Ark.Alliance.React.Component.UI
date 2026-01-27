/**
 * @fileoverview Cell Components Barrel Export
 * @module components/Grids/DataGrid/Cell
 */

// ═══════════════════════════════════════════════════════════════════════════
// EDITABLE CELL
// ═══════════════════════════════════════════════════════════════════════════

// Model
export {
    EditableCellModelSchema,
    ValidationPresetSchema,
    FormatPresetSchema,
    FormatOptionsSchema,
    defaultEditableCellModel,
    createEditableCellModel,
    type EditableCellModel,
    type ValidationPreset,
    type ValidationResult,
    type ValidationRule,
    type FormatPreset,
    type FormatOptions,
} from './EditableCell.model';

// ViewModel
export {
    useEditableCell,
    type UseEditableCellOptions,
    type UseEditableCellResult,
} from './EditableCell.viewmodel';

// View
export {
    EditableCell,
    type EditableCellProps,
} from './EditableCell';

// ═══════════════════════════════════════════════════════════════════════════
// ACTION CELL
// ═══════════════════════════════════════════════════════════════════════════

// Model
export {
    ActionCellModelSchema,
    ActionVariantSchema,
    RowActionSchema,
    defaultActionCellModel,
    createActionCellModel,
    createPresetActions,
    type ActionCellModel,
    type ActionVariant,
    type RowActionConfig,
    type RowAction,
} from './ActionCell.model';

// ViewModel
export {
    useActionCell,
    type UseActionCellOptions,
    type UseActionCellResult,
} from './ActionCell.viewmodel';

// View
export {
    ActionCell,
    type ActionCellProps,
} from './ActionCell';
