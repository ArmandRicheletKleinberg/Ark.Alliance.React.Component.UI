/**
 * @fileoverview TextEditor Component ViewModel
 * @module components/Input/TextEditor
 * 
 * Business logic for the rich text editor.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { TextEditorModel, FormatState, VersionEntry } from './TextEditor.model';
import { defaultTextEditorModel, TextEditorModelSchema, defaultFormatState, FormatStateSchema } from './TextEditor.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TextEditor ViewModel options
 */
export interface UseTextEditorOptions extends Partial<TextEditorModel> {
    /** Callback when content changes */
    onChange?: (html: string) => void;

    /** Callback when saved */
    onSave?: (html: string, version: VersionEntry) => void;

    /** Callback on print */
    onPrint?: () => void;
}

/**
 * TextEditor ViewModel result
 */
export interface UseTextEditorResult extends BaseViewModelResult<TextEditorModel> {
    /** Editor ref */
    editorRef: React.RefObject<HTMLDivElement>;

    /** File input ref for image upload */
    fileInputRef: React.RefObject<HTMLInputElement>;

    /** Current HTML content */
    content: string;

    /** Current format state */
    formatState: FormatState;

    /** Version history */
    versions: VersionEntry[];

    /** Word count */
    wordCount: number;

    /** Character count */
    charCount: number;

    /** Execute formatting command */
    execCommand: (command: string, value?: string) => void;

    /** Update toolbar state based on selection */
    updateFormatState: () => void;

    /** Set font family */
    setFontFamily: (font: string) => void;

    /** Set font size */
    setFontSize: (size: number) => void;

    /** Handle content change */
    handleContentChange: () => void;

    /** Save current version */
    saveVersion: (note?: string) => void;

    /** Restore a version */
    restoreVersion: (version: VersionEntry) => void;

    /** Trigger image upload dialog */
    triggerImageUpload: () => void;

    /** Handle image file selected */
    handleImageFile: (e: React.ChangeEvent<HTMLInputElement>) => void;

    /** Insert table */
    insertTable: (rows: number, cols: number) => void;

    /** Print document */
    handlePrint: () => void;

    /** Container classes */
    containerClasses: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEWMODEL HOOK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * TextEditor ViewModel hook
 */
export function useTextEditor(options: UseTextEditorOptions = {}): UseTextEditorResult {
    const {
        onChange,
        onSave,
        onPrint,
        ...modelData
    } = options;

    // Parse model
    const modelOptions = useMemo(() => {
        return TextEditorModelSchema.parse({ ...defaultTextEditorModel, ...modelData });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(modelData)]);

    // Base ViewModel
    const base = useBaseViewModel<TextEditorModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'text-editor',
    });

    // ═══════════════════════════════════════════════════════════════════════
    // REFS
    // ═══════════════════════════════════════════════════════════════════════

    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ═══════════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════════

    const [content, setContent] = useState(modelOptions.content);
    const [formatState, setFormatState] = useState<FormatState>(defaultFormatState);
    const [versions, setVersions] = useState<VersionEntry[]>(modelOptions.versions);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED VALUES
    // ═══════════════════════════════════════════════════════════════════════

    const wordCount = useMemo(() => {
        const text = content.replace(/<[^>]*>/g, '').trim();
        if (!text) return 0;
        return text.split(/\s+/).filter(w => w.length > 0).length;
    }, [content]);

    const charCount = useMemo(() => {
        return content.replace(/<[^>]*>/g, '').length;
    }, [content]);

    // ═══════════════════════════════════════════════════════════════════════
    // FORMAT STATE
    // ═══════════════════════════════════════════════════════════════════════

    const updateFormatState = useCallback(() => {
        if (typeof document === 'undefined') return;

        const alignment = document.queryCommandState('justifyCenter') ? 'center'
            : document.queryCommandState('justifyRight') ? 'right'
                : document.queryCommandState('justifyFull') ? 'justify'
                    : 'left';

        setFormatState(FormatStateSchema.parse({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            strikethrough: document.queryCommandState('strikeThrough'),
            alignment: alignment as 'left' | 'center' | 'right' | 'justify',
            fontFamily: document.queryCommandValue('fontName') || 'Arial',
            fontSize: parseInt(document.queryCommandValue('fontSize')) || 14,
        }));
    }, []);

    // ═══════════════════════════════════════════════════════════════════════
    // COMMANDS
    // ═══════════════════════════════════════════════════════════════════════

    const execCommand = useCallback((command: string, value: string = '') => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        updateFormatState();
    }, [updateFormatState]);

    const setFontFamily = useCallback((font: string) => {
        execCommand('fontName', font);
    }, [execCommand]);

    const setFontSize = useCallback((size: number) => {
        // execCommand fontSize uses 1-7 scale, we map actual px
        const sizeMap: Record<number, string> = {
            8: '1', 10: '1', 12: '2', 14: '3', 16: '4', 18: '4',
            20: '5', 24: '5', 28: '6', 32: '6', 36: '7', 48: '7', 72: '7',
        };
        execCommand('fontSize', sizeMap[size] || '3');
    }, [execCommand]);

    // ═══════════════════════════════════════════════════════════════════════
    // CONTENT HANDLING
    // ═══════════════════════════════════════════════════════════════════════

    const handleContentChange = useCallback(() => {
        const html = editorRef.current?.innerHTML || '';
        setContent(html);
        onChange?.(html);
        base.emit('change', { content: html });
    }, [onChange, base]);

    // ═══════════════════════════════════════════════════════════════════════
    // VERSIONING
    // ═══════════════════════════════════════════════════════════════════════

    const saveVersion = useCallback((note?: string) => {
        const newVersion: VersionEntry = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            content: editorRef.current?.innerHTML || '',
            note: note || `Version ${versions.length + 1}`,
        };

        setVersions(prev => {
            const updated = [newVersion, ...prev].slice(0, base.model.maxVersions);
            return updated;
        });

        onSave?.(newVersion.content, newVersion);
        base.emit('save', { version: newVersion });
    }, [versions, base, onSave]);

    const restoreVersion = useCallback((version: VersionEntry) => {
        if (editorRef.current) {
            editorRef.current.innerHTML = version.content;
            handleContentChange();
        }
        base.emit('restore', { version });
    }, [handleContentChange, base]);

    // ═══════════════════════════════════════════════════════════════════════
    // IMAGE UPLOAD
    // ═══════════════════════════════════════════════════════════════════════

    const triggerImageUpload = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleImageFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                editorRef.current?.focus();
                execCommand('insertImage', event.target.result as string);
            }
        };
        reader.readAsDataURL(file);

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [execCommand]);

    // ═══════════════════════════════════════════════════════════════════════
    // TABLE INSERT
    // ═══════════════════════════════════════════════════════════════════════

    const insertTable = useCallback((rows: number, cols: number) => {
        let tableHtml = '<table style="border-collapse: collapse; width: 100%; margin: 8px 0;">';
        for (let r = 0; r < rows; r++) {
            tableHtml += '<tr>';
            for (let c = 0; c < cols; c++) {
                tableHtml += `<td style="border: 1px solid #475569; padding: 8px;">&nbsp;</td>`;
            }
            tableHtml += '</tr>';
        }
        tableHtml += '</table>';

        execCommand('insertHTML', tableHtml);
    }, [execCommand]);

    // ═══════════════════════════════════════════════════════════════════════
    // PRINT
    // ═══════════════════════════════════════════════════════════════════════

    const handlePrint = useCallback(() => {
        const printContent = editorRef.current?.innerHTML;
        if (!printContent) return;

        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (doc) {
            doc.open();
            doc.write(`
                <html>
                <head>
                    <title>Document</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 40px; color: black; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ccc; padding: 8px; }
                        img { max-width: 100%; }
                    </style>
                </head>
                <body>${printContent}</body>
                </html>
            `);
            doc.close();

            setTimeout(() => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();
                setTimeout(() => document.body.removeChild(iframe), 1000);
            }, 500);
        }

        onPrint?.();
        base.emit('print', {});
    }, [onPrint, base]);

    // ═══════════════════════════════════════════════════════════════════════
    // AUTO-SAVE
    // ═══════════════════════════════════════════════════════════════════════

    useEffect(() => {
        if (base.model.autoSaveInterval <= 0) return;

        const interval = setInterval(() => {
            saveVersion('Auto-save');
        }, base.model.autoSaveInterval);

        return () => clearInterval(interval);
    }, [base.model.autoSaveInterval, saveVersion]);

    // ═══════════════════════════════════════════════════════════════════════
    // COMPUTED STYLES
    // ═══════════════════════════════════════════════════════════════════════

    const containerClasses = useMemo(() => {
        const classes = [
            'ark-text-editor',
            `ark-text-editor--${base.model.visualMode}`,
        ];
        if (base.model.readOnly) classes.push('ark-text-editor--readonly');
        if (base.model.className) classes.push(base.model.className);
        return classes.join(' ');
    }, [base.model]);

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════════════════

    return {
        ...base,
        editorRef: editorRef as React.RefObject<HTMLDivElement>,
        fileInputRef: fileInputRef as React.RefObject<HTMLInputElement>,
        content,
        formatState,
        versions,
        wordCount,
        charCount,
        execCommand,
        updateFormatState,
        setFontFamily,
        setFontSize,
        handleContentChange,
        saveVersion,
        restoreVersion,
        triggerImageUpload,
        handleImageFile,
        insertTable,
        handlePrint,
        containerClasses,
    };
}

export default useTextEditor;
