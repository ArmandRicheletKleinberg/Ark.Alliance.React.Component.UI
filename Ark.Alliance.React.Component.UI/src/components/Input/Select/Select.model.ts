/**
 * @fileoverview Select Component Model
 * @module components/Input/Select
 * 
 * Dropdown select with MVVM pattern and neon styling.
 */

import { z } from 'zod';
import { extendSchema } from '../../../core/base';

// ═══════════════════════════════════════════════════════════════════════════
// SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export const SelectOptionSchema = z.object({
    value: z.string(),
    label: z.string(),
    disabled: z.boolean().optional(),
    icon: z.string().optional(),
});

export const SelectModelSchema = extendSchema({
    /** Current value */
    value: z.string().optional(),
    /** Options list */
    options: z.array(SelectOptionSchema).default([]),
    /** Placeholder text */
    placeholder: z.string().default('Select...'),
    /** Label text */
    label: z.string().optional(),
    /** Helper text below input */
    helperText: z.string().optional(),
    /** Error message */
    error: z.string().optional(),
    /** Required field */
    required: z.boolean().default(false),
    /** Searchable/filterable */
    searchable: z.boolean().default(false),
    /** Size variant */
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    /** Visual variant */
    variant: z.enum(['default', 'neon', 'minimal']).default('default'),
    /** Dark mode */
    isDark: z.boolean().default(true),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type SelectOption = z.infer<typeof SelectOptionSchema>;
export type SelectModel = z.infer<typeof SelectModelSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

export const defaultSelectModel: SelectModel = {
    value: undefined,
    options: [],
    placeholder: 'Select...',
    label: undefined,
    helperText: undefined,
    error: undefined,
    required: false,
    searchable: false,
    size: 'md',
    variant: 'default',
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
