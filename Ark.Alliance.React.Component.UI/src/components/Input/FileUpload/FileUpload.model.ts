/**
 * @fileoverview FileUpload Component Model
 * @module components/Input/FileUpload
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';
import { BasicVariantSchema, BasicSizeSchema } from '../../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const FileUploadModelSchema = extendSchema({
    /** Accepted file types */
    accept: z.string().default('*'),
    /** Maximum file size in bytes */
    maxSize: z.number().optional(),
    /** Label text */
    label: z.string().optional(),
    /** Placeholder text */
    placeholder: z.string().default('Drop file here or click to upload'),
    /** Show preview for images */
    showPreview: z.boolean().default(true),
    /** Current file URL (for preview) */
    fileUrl: z.string().nullable().default(null),
    /** Current file name */
    fileName: z.string().nullable().default(null),
    /** Visual variant */
    variant: BasicVariantSchema.default('default'),
    /** Size variant */
    size: BasicSizeSchema.default('md'),
    /** Dark mode */
    isDark: z.boolean().default(true),
});

export type FileUploadModel = z.infer<typeof FileUploadModelSchema>;

export const defaultFileUploadModel: FileUploadModel = {
    accept: '*',
    maxSize: undefined,
    label: undefined,
    placeholder: 'Drop file here or click to upload',
    showPreview: true,
    fileUrl: null,
    fileName: null,
    variant: 'default',
    size: 'md',
    isDark: true,
    disabled: false,
    loading: false,
    focusable: false,
    clickable: false,
    doubleClickable: false,
    draggable: false,
    droppable: false,
    mouseOverEnabled: false,
    mouseMoveEnabled: false,
    mouseEnterEnabled: false,
    tooltipPosition: 'top',
    tooltipDelay: 300,
};
