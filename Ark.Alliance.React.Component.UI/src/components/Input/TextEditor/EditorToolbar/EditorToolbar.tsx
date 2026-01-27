/**
 * @fileoverview EditorToolbar Sub-Component
 * @module components/Input/TextEditor/EditorToolbar
 * 
 * Toolbar with formatting buttons for the TextEditor.
 */

import React, { memo } from 'react';
import type { FormatState, TextAlignmentType } from '../TextEditor.model';
import './EditorToolbar.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface EditorToolbarProps {
    /** Current format state */
    formatState: FormatState;

    /** Visual mode */
    visualMode: 'normal' | 'neon' | 'minimal' | 'light';

    /** Available font families */
    fontFamilies: string[];

    /** Available font sizes */
    fontSizes: number[];

    /** Enable image upload */
    enableImageUpload?: boolean;

    /** Enable tables */
    enableTables?: boolean;

    /** On format change */
    onFormat: (command: string, value?: string) => void;

    /** On font family change */
    onFontFamily: (font: string) => void;

    /** On font size change */
    onFontSize: (size: number) => void;

    /** On image upload */
    onImageUpload?: () => void;

    /** On table insert */
    onTableInsert?: () => void;

    /** On save */
    onSave?: () => void;

    /** On print */
    onPrint?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════

const BoldIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
        <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
);

const ItalicIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="19" y1="4" x2="10" y2="4" />
        <line x1="14" y1="20" x2="5" y2="20" />
        <line x1="15" y1="4" x2="9" y2="20" />
    </svg>
);

const UnderlineIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
        <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
);

const AlignLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="15" y2="12" />
        <line x1="3" y1="18" x2="18" y2="18" />
    </svg>
);

const AlignCenterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="6" y1="12" x2="18" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
);

const AlignRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="9" y1="12" x2="21" y2="12" />
        <line x1="6" y1="18" x2="21" y2="18" />
    </svg>
);

const ImageIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);

const TableIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
);

const SaveIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </svg>
);

const PrintIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * EditorToolbar - Formatting toolbar for TextEditor
 */
export const EditorToolbar = memo<EditorToolbarProps>(function EditorToolbar({
    formatState,
    visualMode,
    fontFamilies,
    fontSizes,
    enableImageUpload = true,
    enableTables = true,
    onFormat,
    onFontFamily,
    onFontSize,
    onImageUpload,
    onTableInsert,
    onSave,
    onPrint,
}) {
    return (
        <div className={`ark-editor-toolbar ark-editor-toolbar--${visualMode}`}>
            {/* Font Family */}
            <select
                className="ark-editor-toolbar__select"
                value={formatState.fontFamily}
                onChange={(e) => onFontFamily(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {fontFamilies.map((font) => (
                    <option key={font} value={font}>{font}</option>
                ))}
            </select>

            {/* Font Size */}
            <select
                className="ark-editor-toolbar__select ark-editor-toolbar__select--size"
                value={formatState.fontSize}
                onChange={(e) => onFontSize(Number(e.target.value))}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {fontSizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                ))}
            </select>

            <div className="ark-editor-toolbar__divider" />

            {/* Text Formatting */}
            <button
                className={`ark-editor-toolbar__btn ${formatState.bold ? 'ark-editor-toolbar__btn--active' : ''}`}
                onClick={() => onFormat('bold')}
                onMouseDown={(e) => e.preventDefault()}
                title="Bold"
            >
                <BoldIcon />
            </button>
            <button
                className={`ark-editor-toolbar__btn ${formatState.italic ? 'ark-editor-toolbar__btn--active' : ''}`}
                onClick={() => onFormat('italic')}
                onMouseDown={(e) => e.preventDefault()}
                title="Italic"
            >
                <ItalicIcon />
            </button>
            <button
                className={`ark-editor-toolbar__btn ${formatState.underline ? 'ark-editor-toolbar__btn--active' : ''}`}
                onClick={() => onFormat('underline')}
                onMouseDown={(e) => e.preventDefault()}
                title="Underline"
            >
                <UnderlineIcon />
            </button>

            <div className="ark-editor-toolbar__divider" />

            {/* Alignment */}
            <button
                className={`ark-editor-toolbar__btn ${formatState.alignment === 'left' ? 'ark-editor-toolbar__btn--active' : ''}`}
                onClick={() => onFormat('justifyLeft')}
                onMouseDown={(e) => e.preventDefault()}
                title="Align Left"
            >
                <AlignLeftIcon />
            </button>
            <button
                className={`ark-editor-toolbar__btn ${formatState.alignment === 'center' ? 'ark-editor-toolbar__btn--active' : ''}`}
                onClick={() => onFormat('justifyCenter')}
                onMouseDown={(e) => e.preventDefault()}
                title="Align Center"
            >
                <AlignCenterIcon />
            </button>
            <button
                className={`ark-editor-toolbar__btn ${formatState.alignment === 'right' ? 'ark-editor-toolbar__btn--active' : ''}`}
                onClick={() => onFormat('justifyRight')}
                onMouseDown={(e) => e.preventDefault()}
                title="Align Right"
            >
                <AlignRightIcon />
            </button>

            <div className="ark-editor-toolbar__divider" />

            {/* Insert Options */}
            {enableImageUpload && (
                <button
                    className="ark-editor-toolbar__btn"
                    onClick={onImageUpload}
                    onMouseDown={(e) => e.preventDefault()}
                    title="Insert Image"
                >
                    <ImageIcon />
                </button>
            )}
            {enableTables && (
                <button
                    className="ark-editor-toolbar__btn"
                    onClick={onTableInsert}
                    onMouseDown={(e) => e.preventDefault()}
                    title="Insert Table"
                >
                    <TableIcon />
                </button>
            )}

            <div className="ark-editor-toolbar__spacer" />

            {/* Actions */}
            {onSave && (
                <button
                    className="ark-editor-toolbar__btn"
                    onClick={onSave}
                    onMouseDown={(e) => e.preventDefault()}
                    title="Save"
                >
                    <SaveIcon />
                </button>
            )}
            {onPrint && (
                <button
                    className="ark-editor-toolbar__btn"
                    onClick={onPrint}
                    onMouseDown={(e) => e.preventDefault()}
                    title="Print"
                >
                    <PrintIcon />
                </button>
            )}
        </div>
    );
});

export default EditorToolbar;
