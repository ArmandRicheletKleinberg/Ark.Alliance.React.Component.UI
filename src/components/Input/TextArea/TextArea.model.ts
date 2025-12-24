/**
 * @fileoverview TextArea Component
 * @module components/Input/TextArea
 * 
 * Multi-line text input with MVVM pattern.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// MODEL
// ═══════════════════════════════════════════════════════════════════════════

export const TextAreaModelSchema = extendSchema({
    value: z.string().default(''),
    placeholder: z.string().optional(),
    label: z.string().optional(),
    helperText: z.string().optional(),
    error: z.string().optional(),
    required: z.boolean().default(false),
    rows: z.number().default(4),
    maxLength: z.number().optional(),
    resize: z.enum(['none', 'vertical', 'horizontal', 'both']).default('vertical'),
    variant: z.enum(['default', 'neon', 'minimal']).default('default'),
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    isDark: z.boolean().default(true),
});

export type TextAreaModel = z.infer<typeof TextAreaModelSchema>;

export const defaultTextAreaModel: TextAreaModel = {
    value: '',
    placeholder: undefined,
    label: undefined,
    helperText: undefined,
    error: undefined,
    required: false,
    rows: 4,
    maxLength: undefined,
    resize: 'vertical',
    variant: 'default',
    size: 'md',
    isDark: true,
    disabled: false,
    loading: false,
};
