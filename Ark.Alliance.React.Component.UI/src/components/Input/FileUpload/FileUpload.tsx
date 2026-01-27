/**
 * @fileoverview FileUpload Component View
 * @module components/Input/FileUpload
 */

import { forwardRef, memo, useRef } from 'react';
import { useFileUpload, type UseFileUploadOptions } from './FileUpload.viewmodel';
import './FileUpload.scss';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface FileUploadProps extends UseFileUploadOptions {
    className?: string;
    id?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * FileUpload - Drag-and-drop file upload with preview
 * 
 * @example
 * ```tsx
 * <FileUpload 
 *   label="Background Image"
 *   accept="image/*"
 *   onFileChange={(file, url) => setImage(url)}
 * />
 * ```
 */
export const FileUpload = memo(forwardRef<HTMLDivElement, FileUploadProps>(
    function FileUpload(props, ref) {
        const { className = '', id, ...options } = props;
        const vm = useFileUpload(options);
        const inputRef = useRef<HTMLInputElement>(null);

        const handleClick = () => {
            if (!vm.model.disabled) {
                inputRef.current?.click();
            }
        };

        return (
            <div
                ref={ref}
                className={`${vm.wrapperClasses} ${className}`}
                data-testid={vm.model.testId}
            >
                {/* Label */}
                {vm.model.label && (
                    <label className="ark-upload__label">{vm.model.label}</label>
                )}

                {/* Drop zone */}
                <div
                    className={vm.zoneClasses}
                    onClick={handleClick}
                    onDrop={vm.handleDrop}
                    onDragOver={vm.handleDragOver}
                    onDragLeave={vm.handleDragLeave}
                >
                    {/* Hidden input */}
                    <input
                        ref={inputRef}
                        type="file"
                        id={id}
                        className="ark-upload__input"
                        accept={vm.model.accept}
                        onChange={vm.handleFileChange}
                        disabled={vm.model.disabled}
                    />

                    {vm.hasFile ? (
                        <div className="ark-upload__preview">
                            {/* Image preview */}
                            {vm.model.showPreview && vm.model.fileUrl && (
                                <img
                                    src={vm.model.fileUrl}
                                    alt="Preview"
                                    className="ark-upload__image"
                                />
                            )}

                            {/* File info */}
                            <div className="ark-upload__info">
                                <span className="ark-upload__filename">
                                    {vm.model.fileName || 'File loaded'}
                                </span>
                                <button
                                    type="button"
                                    className="ark-upload__clear"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        vm.clearFile();
                                    }}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="ark-upload__placeholder">
                            <span className="ark-upload__icon">📁</span>
                            <span className="ark-upload__text">{vm.model.placeholder}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
));

FileUpload.displayName = 'FileUpload';

export default FileUpload;
