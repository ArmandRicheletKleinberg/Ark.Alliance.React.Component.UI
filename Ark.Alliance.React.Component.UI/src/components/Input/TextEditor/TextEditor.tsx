/**
 * @fileoverview TextEditor Component
 * @module components/Input/TextEditor
 * 
 * A Word-like rich text editor with formatting toolbar, menu bar, and versioning.
 */

import React, { memo, forwardRef, useCallback, useState } from 'react';
import { useTextEditor, type UseTextEditorOptions } from './TextEditor.viewmodel';
import { EditorToolbar } from './EditorToolbar';
import { EditorMenuBar } from './EditorMenuBar';
import './TextEditor.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface TextEditorProps extends UseTextEditorOptions {
    /** Document title for menu bar */
    title?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TABLE INSERT DIALOG
// ═══════════════════════════════════════════════════════════════════════════

interface TableDialogProps {
    onInsert: (rows: number, cols: number) => void;
    onClose: () => void;
    visualMode: string;
}

const TableDialog: React.FC<TableDialogProps> = ({ onInsert, onClose, visualMode }) => {
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);

    return (
        <div className="ark-text-editor__dialog-overlay" onClick={onClose}>
            <div
                className={`ark-text-editor__dialog ark-text-editor__dialog--${visualMode}`}
                onClick={e => e.stopPropagation()}
            >
                <h3 className="ark-text-editor__dialog-title">Insert Table</h3>
                <div className="ark-text-editor__dialog-field">
                    <label>Rows:</label>
                    <input
                        type="number"
                        min="1"
                        max="20"
                        value={rows}
                        onChange={e => setRows(Number(e.target.value))}
                    />
                </div>
                <div className="ark-text-editor__dialog-field">
                    <label>Columns:</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={cols}
                        onChange={e => setCols(Number(e.target.value))}
                    />
                </div>
                <div className="ark-text-editor__dialog-actions">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={() => { onInsert(rows, cols); onClose(); }}>Insert</button>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TextEditor - Word-like rich text editor
 * 
 * Features:
 * - Menu bar with File/Edit/View/Insert menus
 * - Formatting toolbar (bold, italic, underline, alignment)
 * - Font family and size selection
 * - Image upload
 * - Table insertion
 * - Version history
 * - Print support
 * - Auto-save
 * 
 * @example
 * ```tsx
 * <TextEditor
 *   title="My Document"
 *   content="<p>Hello world</p>"
 *   onChange={(html) => console.log(html)}
 *   onSave={(html, version) => saveToServer(html)}
 *   visualMode="neon"
 * />
 * ```
 */
export const TextEditor = memo(forwardRef<HTMLDivElement, TextEditorProps>(
    (props, ref) => {
        const { title = 'Untitled Document', ...options } = props;
        const vm = useTextEditor(options);

        const [showTableDialog, setShowTableDialog] = useState(false);

        // Menu bar callbacks
        const handleNew = useCallback(() => {
            if (vm.editorRef.current) {
                vm.editorRef.current.innerHTML = '';
                vm.handleContentChange();
            }
        }, [vm]);

        const handleUndo = useCallback(() => vm.execCommand('undo'), [vm]);
        const handleRedo = useCallback(() => vm.execCommand('redo'), [vm]);
        const handleCut = useCallback(() => vm.execCommand('cut'), [vm]);
        const handleCopy = useCallback(() => vm.execCommand('copy'), [vm]);
        const handlePaste = useCallback(() => vm.execCommand('paste'), [vm]);
        const handleSelectAll = useCallback(() => vm.execCommand('selectAll'), [vm]);

        return (
            <div
                ref={ref}
                className={vm.containerClasses}
                data-testid={vm.model.testId}
            >
                {/* Hidden file input for image upload */}
                <input
                    ref={vm.fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={vm.handleImageFile}
                />

                {/* Menu Bar (extends Header) */}
                {vm.model.showMenuBar && (
                    <EditorMenuBar
                        title={title}
                        visualMode={vm.model.visualMode}
                        onNew={handleNew}
                        onSave={() => vm.saveVersion()}
                        onPrint={vm.handlePrint}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        onCut={handleCut}
                        onCopy={handleCopy}
                        onPaste={handlePaste}
                        onSelectAll={handleSelectAll}
                        onInsertImage={vm.triggerImageUpload}
                        onInsertTable={() => setShowTableDialog(true)}
                    />
                )}

                {/* Toolbar */}
                {vm.model.showToolbar && (
                    <EditorToolbar
                        formatState={vm.formatState}
                        visualMode={vm.model.visualMode}
                        fontFamilies={vm.model.fontFamilies}
                        fontSizes={vm.model.fontSizes}
                        enableImageUpload={vm.model.enableImageUpload}
                        enableTables={vm.model.enableTables}
                        onFormat={vm.execCommand}
                        onFontFamily={vm.setFontFamily}
                        onFontSize={vm.setFontSize}
                        onImageUpload={vm.triggerImageUpload}
                        onTableInsert={() => setShowTableDialog(true)}
                        onSave={() => vm.saveVersion()}
                        onPrint={vm.handlePrint}
                    />
                )}

                {/* Content Editable Area */}
                <div
                    ref={vm.editorRef}
                    className="ark-text-editor__content"
                    contentEditable={!vm.model.readOnly}
                    spellCheck={vm.model.spellCheck}
                    onInput={vm.handleContentChange}
                    onMouseUp={vm.updateFormatState}
                    onKeyUp={vm.updateFormatState}
                    dangerouslySetInnerHTML={{ __html: vm.content }}
                    style={{
                        minHeight: vm.model.minHeight,
                        maxHeight: vm.model.maxHeight > 0 ? vm.model.maxHeight : undefined,
                    }}
                    data-placeholder={vm.model.placeholder}
                />

                {/* Status Bar */}
                {vm.model.showStatusBar && (
                    <div className="ark-text-editor__statusbar">
                        {vm.model.showWordCount && (
                            <>
                                <span>{vm.wordCount} words</span>
                                <span className="ark-text-editor__statusbar-divider">|</span>
                                <span>{vm.charCount} characters</span>
                            </>
                        )}
                        <span className="ark-text-editor__statusbar-spacer" />
                        {vm.versions.length > 0 && (
                            <span>{vm.versions.length} versions saved</span>
                        )}
                    </div>
                )}

                {/* Table Insert Dialog */}
                {showTableDialog && (
                    <TableDialog
                        onInsert={vm.insertTable}
                        onClose={() => setShowTableDialog(false)}
                        visualMode={vm.model.visualMode}
                    />
                )}
            </div>
        );
    }
));

TextEditor.displayName = 'TextEditor';

export default TextEditor;
