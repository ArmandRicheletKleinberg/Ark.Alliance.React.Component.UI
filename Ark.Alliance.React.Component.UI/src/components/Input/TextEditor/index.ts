/**
 * TextEditor Component Exports
 */

// Main component
export { TextEditor, type TextEditorProps } from './TextEditor';
export { useTextEditor, type UseTextEditorOptions, type UseTextEditorResult } from './TextEditor.viewmodel';
export {
    TextEditorModelSchema,
    TextAlignment,
    EditorVisualMode,
    ToolbarPosition,
    FormatStateSchema,
    VersionEntrySchema,
    type TextEditorModel,
    type TextAlignmentType,
    type EditorVisualModeType,
    type ToolbarPositionType,
    type FormatState,
    type VersionEntry,
    defaultTextEditorModel,
    defaultFormatState,
    createTextEditorModel,
} from './TextEditor.model';

// Sub-components
export { EditorToolbar, type EditorToolbarProps } from './EditorToolbar';
export { EditorMenuBar, type EditorMenuBarProps, type MenuItem, type MenuConfig } from './EditorMenuBar';

export { default } from './TextEditor';
