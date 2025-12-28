/**
 * @fileoverview TextEditor Component Model
 * @module components/Input/TextEditor
 * 
 * Defines the data structure for a rich text editor component.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';
import { TextAlignmentSchema, type TextAlignment } from '../../../core/enums';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Text alignment options
 * @deprecated Use TextAlignmentSchema from '@core/enums' instead
 */
export const TextAlignment = TextAlignmentSchema;

/**
 * Editor visual mode (component-specific)
 */
export const EditorVisualMode = z.enum(['normal', 'neon', 'minimal', 'light']);

/**
 * Editor toolbar position (component-specific)
 */
export const ToolbarPosition = z.enum(['top', 'bottom', 'floating']);

/**
 * Document version entry
 */
export const VersionEntrySchema = z.object({
    id: z.string(),
    timestamp: z.string(),
    content: z.string(),
    note: z.string().optional(),
});
export type VersionEntry = z.infer<typeof VersionEntrySchema>;

/**
 * Active formatting state
 */
export const FormatStateSchema = z.object({
    bold: z.boolean().default(false),
    italic: z.boolean().default(false),
    underline: z.boolean().default(false),
    strikethrough: z.boolean().default(false),
    alignment: TextAlignmentSchema.default('left'),
    fontFamily: z.string().default('Arial'),
    fontSize: z.number().default(14),
    fontColor: z.string().default('#ffffff'),
    backgroundColor: z.string().optional(),
});
export type FormatState = z.infer<typeof FormatStateSchema>;

/**
 * TextEditor model schema
 */
export const TextEditorModelSchema = extendSchema({
    /** Initial HTML content */
    content: z.string().default(''),

    /** Placeholder text */
    placeholder: z.string().default('Start typing...'),

    /** Whether the editor is read-only */
    readOnly: z.boolean().default(false),

    /** Visual mode */
    visualMode: EditorVisualMode.default('neon'),

    /** Toolbar position */
    toolbarPosition: ToolbarPosition.default('top'),

    /** Whether to show toolbar */
    showToolbar: z.boolean().default(true),

    /** Whether to show menu bar */
    showMenuBar: z.boolean().default(true),

    /** Whether to show status bar */
    showStatusBar: z.boolean().default(true),

    /** Auto-save interval in ms (0 = disabled) */
    autoSaveInterval: z.number().default(0),

    /** Maximum version history */
    maxVersions: z.number().default(50),

    /** Version history */
    versions: z.array(VersionEntrySchema).default([]),

    /** Enable spell check */
    spellCheck: z.boolean().default(true),

    /** Available font families */
    fontFamilies: z.array(z.string()).default([
        'Arial',
        'Times New Roman',
        'Georgia',
        'Courier New',
        'Verdana',
        'Helvetica',
    ]),

    /** Available font sizes */
    fontSizes: z.array(z.number()).default([8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72]),

    /** Min height in pixels */
    minHeight: z.number().default(200),

    /** Max height in pixels (0 = unlimited) */
    maxHeight: z.number().default(0),

    /** Show word count */
    showWordCount: z.boolean().default(true),

    /** Enable image upload */
    enableImageUpload: z.boolean().default(true),

    /** Enable table insertion */
    enableTables: z.boolean().default(true),

    /** Enable AI features */
    enableAI: z.boolean().default(false),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type TextAlignmentType = z.infer<typeof TextAlignment>;
export type EditorVisualModeType = z.infer<typeof EditorVisualMode>;
export type ToolbarPositionType = z.infer<typeof ToolbarPosition>;
export type TextEditorModel = z.infer<typeof TextEditorModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default text editor model
 */
export const defaultTextEditorModel: TextEditorModel = TextEditorModelSchema.parse({});

/**
 * Create a text editor model with custom values
 */
export function createTextEditorModel(data: Partial<TextEditorModel> = {}): TextEditorModel {
    return TextEditorModelSchema.parse({ ...defaultTextEditorModel, ...data });
}

/**
 * Default format state
 */
export const defaultFormatState: FormatState = FormatStateSchema.parse({});
