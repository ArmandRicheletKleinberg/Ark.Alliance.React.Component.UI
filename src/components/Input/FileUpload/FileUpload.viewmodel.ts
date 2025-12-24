/**
 * @fileoverview FileUpload Component ViewModel
 * @module components/Input/FileUpload
 */

import { useMemo, useCallback, useState } from 'react';
import { useBaseViewModel, type BaseViewModelResult } from '../../../core/base';
import type { FileUploadModel } from './FileUpload.model';
import { FileUploadModelSchema, defaultFileUploadModel } from './FileUpload.model';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UseFileUploadOptions extends Partial<FileUploadModel> {
    /** File change handler */
    onFileChange?: (file: File | null, url: string | null) => void;
    /** Error handler */
    onError?: (error: string) => void;
}

export interface UseFileUploadResult extends BaseViewModelResult<FileUploadModel> {
    /** Is dragging over */
    isDragging: boolean;
    /** Has file */
    hasFile: boolean;
    /** Handle file input change */
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Handle drop */
    handleDrop: (e: React.DragEvent) => void;
    /** Handle drag over */
    handleDragOver: (e: React.DragEvent) => void;
    /** Handle drag leave */
    handleDragLeave: () => void;
    /** Clear file */
    clearFile: () => void;
    /** Wrapper classes */
    wrapperClasses: string;
    /** Zone classes */
    zoneClasses: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════

export function useFileUpload(options: UseFileUploadOptions): UseFileUploadResult {
    const { onFileChange, onError, ...modelData } = options;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const modelOptions = useMemo(() => {
        return FileUploadModelSchema.parse({ ...defaultFileUploadModel, ...modelData });
    }, [JSON.stringify(modelData)]);

    const base = useBaseViewModel<FileUploadModel>(modelOptions, {
        model: modelOptions,
        eventChannel: 'fileupload',
    });

    const [isDragging, setIsDragging] = useState(false);

    // Has file
    const hasFile = !!base.model.fileUrl || !!base.model.fileName;

    // Process file
    const processFile = useCallback((file: File) => {
        // Check size
        if (base.model.maxSize && file.size > base.model.maxSize) {
            onError?.(`File size exceeds ${(base.model.maxSize / 1024 / 1024).toFixed(1)}MB limit`);
            return;
        }

        // Create URL for preview
        const url = URL.createObjectURL(file);
        base.emit('upload', { id: base.model.id, file, url });
        onFileChange?.(file, url);
    }, [base, onFileChange, onError]);

    // Handle file input change
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    }, [processFile]);

    // Handle drop
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    }, [processFile]);

    // Drag handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Clear file
    const clearFile = useCallback(() => {
        base.emit('clear', { id: base.model.id });
        onFileChange?.(null, null);
    }, [base, onFileChange]);

    // Classes
    const wrapperClasses = useMemo(() => {
        const classes = [
            'ark-upload',
            `ark-upload--${base.model.variant}`,
            `ark-upload--${base.model.size}`,
            base.model.isDark ? 'ark-upload--dark' : 'ark-upload--light',
        ];
        if (base.model.disabled) classes.push('ark-upload--disabled');
        return classes.join(' ');
    }, [base.model]);

    const zoneClasses = useMemo(() => {
        const classes = ['ark-upload__zone'];
        if (isDragging) classes.push('ark-upload__zone--dragging');
        if (hasFile) classes.push('ark-upload__zone--has-file');
        return classes.join(' ');
    }, [isDragging, hasFile]);

    return {
        ...base,
        isDragging,
        hasFile,
        handleFileChange,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        clearFile,
        wrapperClasses,
        zoneClasses,
    };
}

export default useFileUpload;
